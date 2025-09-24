import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  Locale _locale = const Locale('en', 'US');
  
  Locale get locale => _locale;
  
  bool get isArabic => _locale.languageCode == 'ar';
  bool get isEnglish => _locale.languageCode == 'en';
  
  LanguageProvider() {
    _loadSavedLanguage();
  }
  
  Future<void> _loadSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final languageCode = prefs.getString('language_code') ?? 'en';
    final countryCode = prefs.getString('country_code') ?? 'US';
    
    _locale = Locale(languageCode, countryCode);
    notifyListeners();
  }
  
  Future<void> setLocale(Locale locale) async {
    _locale = locale;
    notifyListeners();
    
    // Save to preferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('language_code', locale.languageCode);
    await prefs.setString('country_code', locale.countryCode ?? '');
  }
  
  Future<void> setEnglish() async {
    await setLocale(const Locale('en', 'US'));
  }
  
  Future<void> setArabic() async {
    await setLocale(const Locale('ar', 'SA'));
  }
  
  Future<void> toggleLanguage() async {
    if (isEnglish) {
      await setArabic();
    } else {
      await setEnglish();
    }
  }
}