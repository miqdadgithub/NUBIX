import 'package:flutter/material.dart';

class AppColors {
  // NUBIX Brand Colors
  static const Color primary = Color(0xFF1E3A8A); // Deep Blue
  static const Color primaryVariant = Color(0xFF1E40AF);
  static const Color secondary = Color(0xFFF59E0B); // Amber/Gold
  static const Color secondaryVariant = Color(0xFFD97706);
  
  // Surface Colors
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF5F5F5);
  
  // Text Colors
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onSecondary = Color(0xFF000000);
  static const Color onSurface = Color(0xFF1F2937);
  static const Color onSurfaceVariant = Color(0xFF6B7280);
  static const Color onBackground = Color(0xFF1F2937);
  
  // Functional Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  
  // Input Colors
  static const Color inputBackground = Color(0xFFF9FAFB);
  static const Color outline = Color(0xFFE5E7EB);
  static const Color outlineVariant = Color(0xFFD1D5DB);
  
  // Dark Theme Colors
  static const Color darkBackground = Color(0xFF111827);
  static const Color darkSurface = Color(0xFF1F2937);
  static const Color darkOnSurface = Color(0xFFFFFFFF);
  
  // Crypto Colors
  static const Color bitcoin = Color(0xFFF7931A);
  static const Color ethereum = Color(0xFF627EEA);
  static const Color binanceCoin = Color(0xFFF3BA2F);
  
  // Status Colors
  static const Color bullish = Color(0xFF10B981); // Green for gains
  static const Color bearish = Color(0xFFEF4444); // Red for losses
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryVariant],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient goldGradient = LinearGradient(
    colors: [secondary, secondaryVariant],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient successGradient = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}