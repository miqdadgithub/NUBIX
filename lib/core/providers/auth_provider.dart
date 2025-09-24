import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  UserModel? _user;
  bool _isLoading = false;
  String? _error;
  bool _isFirstTime = true;
  
  // Getters
  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isFirstTime => _isFirstTime;
  
  AuthProvider() {
    _checkAuthState();
  }
  
  void _checkAuthState() {
    _authService.authStateChanges.listen((User? user) {
      if (user != null) {
        _user = UserModel.fromFirebaseUser(user);
      } else {
        _user = null;
      }
      notifyListeners();
    });
  }
  
  void setFirstTimeComplete() {
    _isFirstTime = false;
    notifyListeners();
  }
  
  Future<bool> signInWithPhone(String phoneNumber) async {
    _setLoading(true);
    try {
      await _authService.signInWithPhone(phoneNumber);
      _clearError();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<bool> verifyOTP(String verificationId, String otp) async {
    _setLoading(true);
    try {
      final user = await _authService.verifyOTP(verificationId, otp);
      if (user != null) {
        _user = UserModel.fromFirebaseUser(user);
        _clearError();
        return true;
      }
      return false;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<bool> signInWithEmail(String email, String password) async {
    _setLoading(true);
    try {
      final user = await _authService.signInWithEmail(email, password);
      if (user != null) {
        _user = UserModel.fromFirebaseUser(user);
        _clearError();
        return true;
      }
      return false;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<bool> registerWithEmail(String email, String password, String fullName) async {
    _setLoading(true);
    try {
      final user = await _authService.registerWithEmail(email, password, fullName);
      if (user != null) {
        _user = UserModel.fromFirebaseUser(user);
        _clearError();
        return true;
      }
      return false;
    } catch (e) {
      _setError(e.toString());
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
      _clearError();
    } catch (e) {
      _setError(e.toString());
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
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
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
}