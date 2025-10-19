import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/auth/phone_auth_screen.dart';
import '../../features/auth/otp_verification_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/profile/profile_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    redirect: _handleRedirect,
    routes: [
      // Splash Route
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      
      // Onboarding Route
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      
      // Authentication Routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/phone-auth',
        name: 'phone-auth',
        builder: (context, state) => const PhoneAuthScreen(),
      ),
      GoRoute(
        path: '/otp-verification',
        name: 'otp-verification',
        builder: (context, state) {
          final phoneNumber = state.uri.queryParameters['phone'] ?? '';
          final verificationId = state.uri.queryParameters['verificationId'] ?? '';
          return OtpVerificationScreen(
            phoneNumber: phoneNumber,
            verificationId: verificationId,
          );
        },
      ),
      
      // Main App Routes (Protected)
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
  
  static String? _handleRedirect(BuildContext context, GoRouterState state) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final currentLocation = state.matchedLocation;

    // Don't redirect during splash screen
    if (currentLocation == '/splash') {
      return null;
    }

    if (!authProvider.isInitialized) {
      return '/splash';
    }

    // Public routes that don't require authentication
    final publicRoutes = [
      '/onboarding',
      '/login',
      '/register', 
      '/phone-auth',
      '/otp-verification',
    ];
    
    final isPublicRoute = publicRoutes.contains(currentLocation);
    
    // If user is not authenticated
    if (!authProvider.isAuthenticated) {
      // If trying to access protected route, redirect to onboarding
      if (!isPublicRoute) {
        return authProvider.isFirstTime ? '/onboarding' : '/login';
      }
      return null; // Allow access to public routes
    }
    
    // If user is authenticated but trying to access auth routes
    if (authProvider.isAuthenticated && isPublicRoute) {
      return '/home';
    }
    
    return null; // No redirect needed
  }
}