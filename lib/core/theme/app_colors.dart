import 'package:flutter/material.dart';

class AppColors {
  // Brand palette inspired by the official NubiX mark
  static const Color primary = Color(0xFF0B2D4D); // Deep brand navy
  static const Color primaryDark = Color(0xFF081E34);
  static const Color secondary = Color(0xFFC99A2E); // Heritage gold
  static const Color secondaryVariant = Color(0xFFAD8226);
  static const Color accentBlue = Color(0xFF1C4E80);

  // Surface Colors
  static const Color background = Color(0xFFF7EEDF); // Warm ivory backdrop
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF1E4D0);

  // Text Colors
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onSecondary = Color(0xFF082038);
  static const Color onSurface = Color(0xFF0F253B);
  static const Color onSurfaceVariant = Color(0xFF4B5B6C);
  static const Color onBackground = Color(0xFF102436);

  // Functional Colors
  static const Color success = Color(0xFF0EAD69);
  static const Color warning = secondary;
  static const Color error = Color(0xFFE35D5B);
  static const Color info = accentBlue;

  // Input & outline Colors
  static const Color inputBackground = Color(0xFFFFFFFF);
  static const Color outline = Color(0xFFE1D4C0);
  static const Color outlineVariant = Color(0xFFD0C2AC);

  // Dark Theme Colors
  static const Color darkBackground = Color(0xFF050B16);
  static const Color darkSurface = Color(0xFF0F1C2C);
  static const Color darkOnSurface = Color(0xFFE6E9EF);

  // Crypto Colors (unchanged)
  static const Color bitcoin = Color(0xFFF7931A);
  static const Color ethereum = Color(0xFF627EEA);
  static const Color binanceCoin = Color(0xFFF3BA2F);

  // Status Colors
  static const Color bullish = Color(0xFF0EAD69);
  static const Color bearish = Color(0xFFE35D5B);

  // Gradients and blends
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sunriseGradient = LinearGradient(
    colors: [secondary, primary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [secondary, secondaryVariant],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient successGradient = LinearGradient(
    colors: [Color(0xFF0EAD69), Color(0xFF069A5A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}