import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';

enum SelfieCaptureState { empty, captured, processing }

class KycSelfieScreen extends StatefulWidget {
  const KycSelfieScreen({super.key});

  @override
  State<KycSelfieScreen> createState() => _KycSelfieScreenState();
}

class _KycSelfieScreenState extends State<KycSelfieScreen> {
  SelfieCaptureState _state = SelfieCaptureState.empty;

  Future<void> _captureOrSubmit() async {
    if (_state == SelfieCaptureState.empty) {
      setState(() => _state = SelfieCaptureState.captured);
      SemanticsService.announce(
        'Selfie successfully captured. Submitting for verification.',
        TextDirection.ltr,
      );
      return;
    }

    if (_state == SelfieCaptureState.captured) {
      setState(() => _state = SelfieCaptureState.processing);
      await Future.delayed(const Duration(milliseconds: 1500));
      if (mounted) {
        context.go('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isCaptured = _state == SelfieCaptureState.captured;
    final isProcessing = _state == SelfieCaptureState.processing;

    return Scaffold(
      backgroundColor: const Color(0xFFFAF2E6),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(context),
              const SizedBox(height: 12),
              _buildStepper(),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Take a live selfie',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Please remove glasses and face the camera directly. Ensure your face is well-lit.',
                      style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      height: 230,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1E4D0),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      alignment: Alignment.center,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 160,
                            height: 190,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: isCaptured ? AppColors.success : AppColors.secondary,
                                width: 2,
                                style: isCaptured ? BorderStyle.solid : BorderStyle.solid,
                              ),
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: isProcessing
                                ? const Center(
                                    child: CircularProgressIndicator(
                                      color: AppColors.secondary,
                                    ),
                                  )
                                : isCaptured
                                    ? const Icon(
                                        Icons.check_circle,
                                        color: AppColors.secondary,
                                        size: 46,
                                      )
                                    : null,
                          ),
                          if (isCaptured && !isProcessing)
                            const Positioned(
                              bottom: 10,
                              child: Text(
                                'Selfie captured',
                                style: TextStyle(
                                  color: AppColors.success,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.success,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: const Text(
                          'BIOMETRIC DATA IS ENCRYPTED IN TRANSIT',
                          style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              if (isCaptured && !isProcessing)
                TextButton(
                  onPressed: () => setState(() => _state = SelfieCaptureState.empty),
                  child: const Text('Retake'),
                ),
              ElevatedButton(
                onPressed: isProcessing ? null : _captureOrSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.secondary,
                  foregroundColor: AppColors.primary,
                ),
                child: Text(isCaptured ? 'Submit & Continue' : 'Capture Selfie'),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          ),
          const Expanded(
            child: Column(
              children: [
                Text(
                  'KYC Verification',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Divider(color: AppColors.secondary, thickness: 3, indent: 80, endIndent: 80),
              ],
            ),
          ),
          const SizedBox(width: 42),
        ],
      ),
    );
  }

  Widget _buildStepper() {
    return Row(
      children: const [
        _StepDot(label: 'Personal Details', done: true),
        _StepConnector(),
        _StepDot(label: 'ID Upload', done: true),
        _StepConnector(),
        _StepDot(label: 'Selfie', active: true),
      ],
    );
  }
}

class _StepDot extends StatelessWidget {
  final String label;
  final bool done;
  final bool active;

  const _StepDot({required this.label, this.done = false, this.active = false});

  @override
  Widget build(BuildContext context) {
    final color = done
        ? AppColors.success
        : active
            ? AppColors.secondary
            : AppColors.outlineVariant;
    return Expanded(
      child: Column(
        children: [
          CircleAvatar(radius: 8, backgroundColor: color),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 9), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

class _StepConnector extends StatelessWidget {
  const _StepConnector();

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      width: 24,
      child: Divider(thickness: 2, color: AppColors.outlineVariant),
    );
  }
}
