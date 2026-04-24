import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';

class ForgotPasswordSuccessScreen extends StatefulWidget {
  const ForgotPasswordSuccessScreen({super.key});

  @override
  State<ForgotPasswordSuccessScreen> createState() =>
      _ForgotPasswordSuccessScreenState();
}

class _ForgotPasswordSuccessScreenState
    extends State<ForgotPasswordSuccessScreen> {
  Timer? _redirectTimer;

  @override
  void initState() {
    super.initState();
    _redirectTimer = Timer(const Duration(seconds: 3), () {
      if (mounted) context.go('/login');
    });
  }

  @override
  void dispose() {
    _redirectTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle,
                  size: 84,
                  color: AppColors.success,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Password reset successfully!',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: AppColors.secondary,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              Text(
                'You can now sign in with your new password.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: const Color(0xFF8A9BAC),
                    ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.go('/login'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary,
                    foregroundColor: AppColors.primary,
                  ),
                  child: const Text('Return to Sign In'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
