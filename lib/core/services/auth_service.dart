import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/user_model.dart';

class AuthOtpChallenge {
  final String verificationId;
  final String phoneNumber;
  final String otp;
  final DateTime expiresAt;

  const AuthOtpChallenge({
    required this.verificationId,
    required this.phoneNumber,
    required this.otp,
    required this.expiresAt,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  Map<String, dynamic> toMap() {
    return {
      'verificationId': verificationId,
      'phoneNumber': phoneNumber,
      'otp': otp,
      'expiresAt': expiresAt.toIso8601String(),
    };
  }

  factory AuthOtpChallenge.fromMap(Map<String, dynamic> map) {
    return AuthOtpChallenge(
      verificationId: map['verificationId'] as String,
      phoneNumber: map['phoneNumber'] as String,
      otp: map['otp'] as String,
      expiresAt: DateTime.parse(map['expiresAt'] as String),
    );
  }
}

class AuthService {
  static const _onboardingKey = 'nubix_onboarding_complete';
  static const _sessionKey = 'nubix_current_user';
  static const _usersKey = 'nubix_mock_users';
  static const _otpKey = 'nubix_pending_otps';

  final Map<String, Map<String, dynamic>> _users = {};
  final Map<String, AuthOtpChallenge> _pendingOtps = {};

  SharedPreferences? _prefs;
  bool _initialized = false;

  static bool isDevelopmentMode() {
    const bool isProductMode = bool.fromEnvironment('dart.vm.product');
    return !isProductMode;
  }

  Future<void> initialize() async {
    if (_initialized) return;
    _prefs = await SharedPreferences.getInstance();
    _loadUsers();
    _loadPendingOtps();
    _initialized = true;
  }

  Future<void> _ensureInitialized() async {
    if (!_initialized) {
      await initialize();
    }
  }

  Future<bool> isOnboardingComplete() async {
    await _ensureInitialized();
    return _prefs!.getBool(_onboardingKey) ?? false;
  }

  Future<void> setOnboardingComplete() async {
    await _ensureInitialized();
    await _prefs!.setBool(_onboardingKey, true);
  }

  Future<UserModel?> getPersistedUser() async {
    await _ensureInitialized();
    final json = _prefs!.getString(_sessionKey);
    if (json == null) return null;
    try {
      return UserModel.fromJson(json);
    } catch (_) {
      return null;
    }
  }

  Future<void> persistUser(UserModel user) async {
    await _ensureInitialized();
    await _prefs!.setString(_sessionKey, user.toJson());
  }

  Future<void> clearSession() async {
    await _ensureInitialized();
    await _prefs!.remove(_sessionKey);
  }

  Future<AuthOtpChallenge> signInWithPhone(String phoneNumber) async {
    await _ensureInitialized();
    await Future.delayed(const Duration(milliseconds: 500));

    final random = Random.secure();
    final verificationId =
        'mock-${DateTime.now().millisecondsSinceEpoch}-${random.nextInt(1 << 32)}';
    final otp = (random.nextInt(900000) + 100000).toString();
    final challenge = AuthOtpChallenge(
      verificationId: verificationId,
      phoneNumber: phoneNumber,
      otp: otp,
      expiresAt: DateTime.now().add(const Duration(minutes: 5)),
    );

    _pendingOtps[verificationId] = challenge;
    await _savePendingOtps();

    return challenge;
  }

  Future<AuthOtpChallenge> resendOtp(String phoneNumber) {
    return signInWithPhone(phoneNumber);
  }

  Future<UserModel> verifyOTP(String verificationId, String otp) async {
    await _ensureInitialized();
    await Future.delayed(const Duration(milliseconds: 300));

    final challenge = _pendingOtps[verificationId];
    if (challenge == null) {
      throw Exception('Verification expired. Please request a new code.');
    }

    if (challenge.isExpired) {
      _pendingOtps.remove(verificationId);
      await _savePendingOtps();
      throw Exception('The verification code has expired.');
    }

    if (challenge.otp != otp) {
      throw Exception('Invalid verification code.');
    }

    final now = DateTime.now().toIso8601String();

    String? matchedEmail;
    Map<String, dynamic>? matchedUser;
    _users.forEach((email, data) {
      if (data['phoneNumber'] == challenge.phoneNumber) {
        matchedEmail = email;
        matchedUser = data;
      }
    });

    if (matchedUser == null) {
      final email =
          'user_${challenge.phoneNumber.replaceAll('+', '').replaceAll(' ', '')}@nubix.com';
      matchedEmail = email;
      matchedUser = {
        'id': 'user-${DateTime.now().millisecondsSinceEpoch}',
        'email': email,
        'password': 'temp123',
        'fullName': 'Phone User',
        'displayName': 'Phone User',
        'phoneNumber': challenge.phoneNumber,
        'kycStatus': 'not_started',
        'balance': 0.0,
        'createdAt': now,
      };
      _users[email] = Map<String, dynamic>.from(matchedUser!);
    }

    final normalizedUser = Map<String, dynamic>.from(matchedUser!);
    normalizedUser['email'] = matchedEmail ?? normalizedUser['email'];
    normalizedUser['displayName'] =
        normalizedUser['displayName'] ?? normalizedUser['fullName'] ?? 'NubiX Trader';
    normalizedUser['fullName'] =
        normalizedUser['fullName'] ?? normalizedUser['displayName'];
    normalizedUser['lastSignIn'] = now;
    _pendingOtps.remove(verificationId);

    _users[normalizedUser['email'] as String] = normalizedUser;

    await _saveUsers();
    await _savePendingOtps();

    final user = UserModel.fromMap(normalizedUser);
    await persistUser(user);
    return user;
  }

  Future<UserModel> signInWithEmail(String email, String password) async {
    await _ensureInitialized();
    await Future.delayed(const Duration(milliseconds: 500));

    final userData = _users[email];
    if (userData == null) {
      throw Exception('User not found');
    }

    if (userData['password'] != password) {
      throw Exception('Invalid password');
    }

    userData['displayName'] = userData['displayName'] ?? userData['fullName'];
    userData['fullName'] = userData['fullName'] ?? userData['displayName'];
    userData['lastSignIn'] = DateTime.now().toIso8601String();
    await _saveUsers();

    userData['email'] = email;
    final user = UserModel.fromMap(userData);
    await persistUser(user);
    return user;
  }

  Future<UserModel> registerWithEmail(
    String email,
    String password,
    String fullName,
  ) async {
    await _ensureInitialized();
    await Future.delayed(const Duration(milliseconds: 600));

    if (_users.containsKey(email)) {
      throw Exception('Email already registered');
    }

    final now = DateTime.now().toIso8601String();
    final userData = {
      'id': 'user-${DateTime.now().millisecondsSinceEpoch}',
      'email': email,
      'password': password,
      'fullName': fullName,
      'displayName': fullName,
      'phoneNumber': '',
      'kycStatus': 'not_started',
      'balance': 0.0,
      'createdAt': now,
      'lastSignIn': now,
    };

    _users[email] = userData;
    await _saveUsers();

    final user = UserModel.fromMap(userData);
    await persistUser(user);
    return user;
  }

  Future<void> signOut() async {
    await clearSession();
  }

  Future<void> resetPassword(String email) async {
    await _ensureInitialized();
    await Future.delayed(const Duration(milliseconds: 400));

    if (!_users.containsKey(email)) {
      throw Exception('Email not found');
    }
  }

  static List<String> getDevelopmentEmails() {
    return _defaultUsers.keys.toList();
  }

  static const Map<String, Map<String, dynamic>> _defaultUsers = {
    'test@nubix.com': {
      'id': 'user-test',
      'email': 'test@nubix.com',
      'password': '123456',
      'fullName': 'Test User',
      'displayName': 'Test User',
      'phoneNumber': '+249123456789',
      'kycStatus': 'pending',
      'balance': 0.0,
      'createdAt': '2024-01-01T00:00:00Z',
    },
    'admin@nubix.com': {
      'id': 'user-admin',
      'email': 'admin@nubix.com',
      'password': 'admin123',
      'fullName': 'Admin User',
      'displayName': 'Admin User',
      'phoneNumber': '+249987654321',
      'kycStatus': 'approved',
      'balance': 50000.0,
      'createdAt': '2024-01-01T00:00:00Z',
    },
  };

  void _loadUsers() {
    _users
      ..clear()
      ..addAll(_defaultUsers.map(
        (key, value) => MapEntry(key, Map<String, dynamic>.from(value)),
      ));

    final stored = _prefs!.getString(_usersKey);
    if (stored == null) {
      return;
    }

    try {
      final decoded = jsonDecode(stored) as Map<String, dynamic>;
      decoded.forEach((key, value) {
        if (value is Map<String, dynamic>) {
          final normalized = Map<String, dynamic>.from(value);
          normalized['displayName'] =
              normalized['displayName'] ?? normalized['fullName'] ?? 'NubiX Trader';
          normalized['fullName'] =
              normalized['fullName'] ?? normalized['displayName'];
          _users[key] = normalized;
        }
      });
    } catch (_) {
      // Ignore corrupt data and fall back to defaults.
    }
  }

  Future<void> _saveUsers() async {
    await _ensureInitialized();
    final serializable = _users.map((key, value) {
      final copy = Map<String, dynamic>.from(value);
      copy['email'] = copy['email'] ?? key;
      copy['displayName'] = copy['displayName'] ?? copy['fullName'];
      copy['fullName'] = copy['fullName'] ?? copy['displayName'];
      return MapEntry(key, copy);
    });
    await _prefs!.setString(_usersKey, jsonEncode(serializable));
  }

  void _loadPendingOtps() {
    final stored = _prefs!.getString(_otpKey);
    if (stored == null) {
      return;
    }

    try {
      final decoded = jsonDecode(stored) as Map<String, dynamic>;
      decoded.forEach((key, value) {
        if (value is Map<String, dynamic>) {
          final challenge = AuthOtpChallenge.fromMap(value);
          if (!challenge.isExpired) {
            _pendingOtps[key] = challenge;
          }
        }
      });
    } catch (_) {
      // Ignore corrupt data.
    }
  }

  Future<void> _savePendingOtps() async {
    await _ensureInitialized();
    final serializable = _pendingOtps.map((key, value) => MapEntry(key, value.toMap()));
    await _prefs!.setString(_otpKey, jsonEncode(serializable));
  }
}

