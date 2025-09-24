import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

class AuthService {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  
  // Development mode flag
  static const bool _isDevelopmentMode = true;
  
  User? get currentUser => _firebaseAuth.currentUser;
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();
  
  // Mock users for development
  static final Map<String, Map<String, String>> _mockUsers = {
    'test@nubix.com': {
      'password': '123456',
      'name': 'Test User',
      'phone': '+249123456789',
    },
    'admin@nubix.com': {
      'password': 'admin123',
      'name': 'Admin User', 
      'phone': '+249987654321',
    },
  };
  
  // Phone authentication
  Future<void> signInWithPhone(String phoneNumber) async {
    if (_isDevelopmentMode) {
      // Mock phone authentication for development
      await Future.delayed(const Duration(seconds: 2));
      if (phoneNumber == '+249123456789' || phoneNumber == '+249987654321') {
        return; // Success
      } else {
        throw Exception('Invalid phone number for development mode');
      }
    }
    
    try {
      await _firebaseAuth.verifyPhoneNumber(
        phoneNumber: phoneNumber,
        verificationCompleted: (PhoneAuthCredential credential) async {
          await _firebaseAuth.signInWithCredential(credential);
        },
        verificationFailed: (FirebaseAuthException e) {
          throw Exception('Phone verification failed: ${e.message}');
        },
        codeSent: (String verificationId, int? resendToken) {
          // Handle code sent
        },
        codeAutoRetrievalTimeout: (String verificationId) {
          // Handle timeout
        },
      );
    } catch (e) {
      throw Exception('Phone authentication failed: $e');
    }
  }
  
  Future<User?> verifyOTP(String verificationId, String otp) async {
    if (_isDevelopmentMode) {
      // Mock OTP verification for development
      await Future.delayed(const Duration(seconds: 1));
      if (otp == '123456') {
        // Create a mock user for development
        return await _createMockUser('test@nubix.com');
      } else {
        throw Exception('Invalid OTP. Use 123456 for development mode.');
      }
    }
    
    try {
      final credential = PhoneAuthProvider.credential(
        verificationId: verificationId,
        smsCode: otp,
      );
      final result = await _firebaseAuth.signInWithCredential(credential);
      return result.user;
    } catch (e) {
      throw Exception('OTP verification failed: $e');
    }
  }
  
  // Email authentication
  Future<User?> signInWithEmail(String email, String password) async {
    if (_isDevelopmentMode) {
      // Mock email authentication for development
      await Future.delayed(const Duration(seconds: 2));
      if (_mockUsers.containsKey(email)) {
        final user = _mockUsers[email]!;
        if (user['password'] == password) {
          return await _createMockUser(email);
        } else {
          throw Exception('Invalid password');
        }
      } else {
        throw Exception('User not found');
      }
    }
    
    try {
      final result = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return result.user;
    } catch (e) {
      throw Exception('Email sign-in failed: $e');
    }
  }
  
  Future<User?> registerWithEmail(String email, String password, String fullName) async {
    if (_isDevelopmentMode) {
      // Mock email registration for development
      await Future.delayed(const Duration(seconds: 2));
      _mockUsers[email] = {
        'password': password,
        'name': fullName,
        'phone': '',
      };
      return await _createMockUser(email);
    }
    
    try {
      final result = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      // Update display name
      await result.user?.updateDisplayName(fullName);
      
      return result.user;
    } catch (e) {
      throw Exception('Registration failed: $e');
    }
  }
  
  Future<void> signOut() async {
    if (_isDevelopmentMode) {
      await Future.delayed(const Duration(milliseconds: 500));
      return;
    }
    
    try {
      await _firebaseAuth.signOut();
    } catch (e) {
      throw Exception('Sign out failed: $e');
    }
  }
  
  Future<void> resetPassword(String email) async {
    if (_isDevelopmentMode) {
      await Future.delayed(const Duration(seconds: 1));
      if (!_mockUsers.containsKey(email)) {
        throw Exception('Email not found');
      }
      return;
    }
    
    try {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
    } catch (e) {
      throw Exception('Password reset failed: $e');
    }
  }
  
  // Mock user creation for development
  Future<User?> _createMockUser(String email) async {
    if (!_isDevelopmentMode) return null;
    
    // Return null for now as we can't create actual Firebase User objects
    // In development mode, the AuthProvider will handle this differently
    return null;
  }
  
  // Development helper methods
  static List<String> getDevelopmentEmails() {
    return _mockUsers.keys.toList();
  }
  
  static bool isDevelopmentMode() {
    return _isDevelopmentMode;
  }
}