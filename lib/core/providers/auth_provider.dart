import 'package:flutter/foundation.dart';

import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;

  UserModel? _user;
  bool _isLoading = false;
  String? _error;
  bool _isFirstTime = true;
  bool _isInitialized = false;
  AuthOtpChallenge? _pendingOtp;
  late final Future<void> _initializationFuture;

  // Getters
  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isFirstTime => _isFirstTime;
  bool get isInitialized => _isInitialized;
  AuthOtpChallenge? get pendingOtp => _pendingOtp;
  Future<void> get initialization => _initializationFuture;

  AuthProvider({AuthService? authService}) : _authService = authService ?? AuthService() {
    _initializationFuture = _initialize();
  }

  Future<void> _initialize() async {
    try {
      await _authService.initialize();
      _isFirstTime = !(await _authService.isOnboardingComplete());
      _user = await _authService.getPersistedUser();
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  Future<AuthOtpChallenge?> signInWithPhone(String phoneNumber) async {
    _setLoading(true);
    try {
      _pendingOtp = null;
      final challenge = await _authService.signInWithPhone(phoneNumber);
      _pendingOtp = challenge;
      _clearError();
      return challenge;
    } catch (e) {
      _setError(_formatError(e));
      _pendingOtp = null;
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<AuthOtpChallenge?> resendOtp(String phoneNumber) async {
    _setLoading(true);
    try {
      final challenge = await _authService.resendOtp(phoneNumber);
      _pendingOtp = challenge;
      _clearError();
      return challenge;
    } catch (e) {
      _setError(_formatError(e));
      return null;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> verifyOTP(String verificationId, String otp) async {
    _setLoading(true);
    try {
      final user = await _authService.verifyOTP(verificationId, otp);
      _user = user;
      _pendingOtp = null;
      _clearError();
      return true;
    } catch (e) {
      _setError(_formatError(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signInWithEmail(String email, String password) async {
    _setLoading(true);
    try {
      final user = await _authService.signInWithEmail(email, password);
      _user = user;
      _pendingOtp = null;
      _clearError();
      return true;
    } catch (e) {
      _setError(_formatError(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> registerWithEmail(String email, String password, String fullName) async {
    _setLoading(true);
    try {
      final user = await _authService.registerWithEmail(email, password, fullName);
      _user = user;
      _pendingOtp = null;
      _clearError();
      return true;
    } catch (e) {
      _setError(_formatError(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    _setLoading(true);
    try {
      await _authService.signOut();
      _user = null;
      _pendingOtp = null;
      _clearError();
    } catch (e) {
      _setError(_formatError(e));
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> resetPassword(String email) async {
    _setLoading(true);
    try {
      await _authService.resetPassword(email);
      _clearError();
      return true;
    } catch (e) {
      _setError(_formatError(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> setFirstTimeComplete() async {
    await _authService.setOnboardingComplete();
    _isFirstTime = false;
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  void clearError() {
    _clearError();
  }

  String _formatError(Object error) {
    final message = error.toString();
    if (message.startsWith('Exception: ')) {
      return message.replaceFirst('Exception: ', '');
    }
    return message;
  }
}
