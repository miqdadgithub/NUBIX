import 'dart:convert';

enum KycStatus {
  notStarted,
  pending,
  approved,
  rejected,
  expired,
}

enum KycTier {
  none,
  basic, // Level 1 - Daily limit SDG 5,000
  enhanced, // Level 2 - Monthly limit SDG 100,000
}

class UserModel {
  final String id;
  final String? email;
  final String? phoneNumber;
  final String? displayName;
  final String? photoURL;
  final bool emailVerified;
  final DateTime? createdAt;
  final DateTime? lastSignIn;
  
  // KYC Information
  final KycStatus kycStatus;
  final KycTier kycTier;
  final DateTime? kycSubmittedAt;
  final DateTime? kycApprovedAt;
  final String? kycRejectionReason;
  
  // Profile Information
  final String? fullName;
  final String? dateOfBirth;
  final String? nationality;
  final String? address;
  final String? idNumber;
  
  // App Settings
  final bool biometricEnabled;
  final bool twoFactorEnabled;
  final String preferredLanguage;
  final bool notificationsEnabled;
  
  // Trading Limits
  final double dailyLimit;
  final double monthlyLimit;
  final double usedDailyLimit;
  final double usedMonthlyLimit;
  
  const UserModel({
    required this.id,
    this.email,
    this.phoneNumber,
    this.displayName,
    this.photoURL,
    this.emailVerified = false,
    this.createdAt,
    this.lastSignIn,
    this.kycStatus = KycStatus.notStarted,
    this.kycTier = KycTier.none,
    this.kycSubmittedAt,
    this.kycApprovedAt,
    this.kycRejectionReason,
    this.fullName,
    this.dateOfBirth,
    this.nationality,
    this.address,
    this.idNumber,
    this.biometricEnabled = false,
    this.twoFactorEnabled = false,
    this.preferredLanguage = 'en',
    this.notificationsEnabled = true,
    this.dailyLimit = 0.0,
    this.monthlyLimit = 0.0,
    this.usedDailyLimit = 0.0,
    this.usedMonthlyLimit = 0.0,
  });
  
  factory UserModel.fromMap(Map<String, dynamic> map) {
    DateTime? parseDate(dynamic value) {
      if (value == null) return null;
      if (value is DateTime) return value;
      if (value is String && value.isNotEmpty) {
        return DateTime.tryParse(value);
      }
      return null;
    }

    return UserModel(
      id: map['id'] ?? map['email'] ?? '',
      email: map['email'],
      phoneNumber: map['phoneNumber'],
      displayName: map['displayName'] ?? map['fullName'],
      photoURL: map['photoURL'],
      emailVerified: map['emailVerified'] ?? false,
      createdAt: parseDate(map['createdAt']),
      lastSignIn: parseDate(map['lastSignIn']),
      kycStatus: KycStatus.values.firstWhere(
        (e) => e.name == map['kycStatus'],
        orElse: () => KycStatus.notStarted,
      ),
      kycTier: KycTier.values.firstWhere(
        (e) => e.name == map['kycTier'],
        orElse: () => KycTier.none,
      ),
      kycSubmittedAt: parseDate(map['kycSubmittedAt']),
      kycApprovedAt: parseDate(map['kycApprovedAt']),
      kycRejectionReason: map['kycRejectionReason'],
      fullName: map['fullName'] ?? map['displayName'],
      dateOfBirth: map['dateOfBirth'],
      nationality: map['nationality'],
      address: map['address'],
      idNumber: map['idNumber'],
      biometricEnabled: map['biometricEnabled'] ?? false,
      twoFactorEnabled: map['twoFactorEnabled'] ?? false,
      preferredLanguage: map['preferredLanguage'] ?? 'en',
      notificationsEnabled: map['notificationsEnabled'] ?? true,
      dailyLimit: (map['dailyLimit'] ?? 0.0).toDouble(),
      monthlyLimit: (map['monthlyLimit'] ?? 0.0).toDouble(),
      usedDailyLimit: (map['usedDailyLimit'] ?? 0.0).toDouble(),
      usedMonthlyLimit: (map['usedMonthlyLimit'] ?? 0.0).toDouble(),
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'email': email,
      'phoneNumber': phoneNumber,
      'displayName': displayName,
      'photoURL': photoURL,
      'emailVerified': emailVerified,
      'createdAt': createdAt?.toIso8601String(),
      'lastSignIn': lastSignIn?.toIso8601String(),
      'kycStatus': kycStatus.name,
      'kycTier': kycTier.name,
      'kycSubmittedAt': kycSubmittedAt?.toIso8601String(),
      'kycApprovedAt': kycApprovedAt?.toIso8601String(),
      'kycRejectionReason': kycRejectionReason,
      'fullName': fullName,
      'dateOfBirth': dateOfBirth,
      'nationality': nationality,
      'address': address,
      'idNumber': idNumber,
      'biometricEnabled': biometricEnabled,
      'twoFactorEnabled': twoFactorEnabled,
      'preferredLanguage': preferredLanguage,
      'notificationsEnabled': notificationsEnabled,
      'dailyLimit': dailyLimit,
      'monthlyLimit': monthlyLimit,
      'usedDailyLimit': usedDailyLimit,
      'usedMonthlyLimit': usedMonthlyLimit,
    };
  }

  String toJson() => jsonEncode(toMap());

  factory UserModel.fromJson(String source) {
    final data = jsonDecode(source) as Map<String, dynamic>;
    return UserModel.fromMap(data);
  }
  
  UserModel copyWith({
    String? id,
    String? email,
    String? phoneNumber,
    String? displayName,
    String? photoURL,
    bool? emailVerified,
    DateTime? createdAt,
    DateTime? lastSignIn,
    KycStatus? kycStatus,
    KycTier? kycTier,
    DateTime? kycSubmittedAt,
    DateTime? kycApprovedAt,
    String? kycRejectionReason,
    String? fullName,
    String? dateOfBirth,
    String? nationality,
    String? address,
    String? idNumber,
    bool? biometricEnabled,
    bool? twoFactorEnabled,
    String? preferredLanguage,
    bool? notificationsEnabled,
    double? dailyLimit,
    double? monthlyLimit,
    double? usedDailyLimit,
    double? usedMonthlyLimit,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      displayName: displayName ?? this.displayName,
      photoURL: photoURL ?? this.photoURL,
      emailVerified: emailVerified ?? this.emailVerified,
      createdAt: createdAt ?? this.createdAt,
      lastSignIn: lastSignIn ?? this.lastSignIn,
      kycStatus: kycStatus ?? this.kycStatus,
      kycTier: kycTier ?? this.kycTier,
      kycSubmittedAt: kycSubmittedAt ?? this.kycSubmittedAt,
      kycApprovedAt: kycApprovedAt ?? this.kycApprovedAt,
      kycRejectionReason: kycRejectionReason ?? this.kycRejectionReason,
      fullName: fullName ?? this.fullName,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      nationality: nationality ?? this.nationality,
      address: address ?? this.address,
      idNumber: idNumber ?? this.idNumber,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
      twoFactorEnabled: twoFactorEnabled ?? this.twoFactorEnabled,
      preferredLanguage: preferredLanguage ?? this.preferredLanguage,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      dailyLimit: dailyLimit ?? this.dailyLimit,
      monthlyLimit: monthlyLimit ?? this.monthlyLimit,
      usedDailyLimit: usedDailyLimit ?? this.usedDailyLimit,
      usedMonthlyLimit: usedMonthlyLimit ?? this.usedMonthlyLimit,
    );
  }
  
  // Helper methods
  bool get isKycVerified => kycStatus == KycStatus.approved;
  bool get canTrade => isKycVerified && kycTier != KycTier.none;
  
  double get availableDailyLimit => dailyLimit - usedDailyLimit;
  double get availableMonthlyLimit => monthlyLimit - usedMonthlyLimit;
  
  String get kycStatusDisplayText {
    switch (kycStatus) {
      case KycStatus.notStarted:
        return 'Not Started';
      case KycStatus.pending:
        return 'Under Review';
      case KycStatus.approved:
        return 'Verified';
      case KycStatus.rejected:
        return 'Rejected';
      case KycStatus.expired:
        return 'Expired';
    }
  }
  
  String get kycTierDisplayText {
    switch (kycTier) {
      case KycTier.none:
        return 'No Verification';
      case KycTier.basic:
        return 'Basic (Level 1)';
      case KycTier.enhanced:
        return 'Enhanced (Level 2)';
    }
  }
}
