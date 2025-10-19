import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/language_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/nubix_logo.dart';

class PhoneAuthScreen extends StatefulWidget {
  const PhoneAuthScreen({Key? key}) : super(key: key);

  @override
  State<PhoneAuthScreen> createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends State<PhoneAuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  String _selectedCountryCode = '+249'; // Sudan

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final isArabic = languageProvider.isArabic;
    
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 20),
                
                // Header
                Row(
                  children: [
                    IconButton(
                      onPressed: () => context.pop(),
                      icon: Icon(
                        isArabic ? Icons.arrow_forward_ios : Icons.arrow_back_ios,
                      ),
                    ),
                    const Spacer(),
                    const NubixLogo(size: 40),
                    const Spacer(),
                    TextButton(
                      onPressed: languageProvider.toggleLanguage,
                      child: Text(isArabic ? 'English' : 'العربية'),
                    ),
                  ],
                ),
                
                const SizedBox(height: 40),
                
                // Phone icon
                const Icon(
                  Icons.phone,
                  size: 80,
                  color: AppColors.primary,
                ),
                
                const SizedBox(height: 24),
                
                // Title
                Text(
                  isArabic ? 'التحقق من الهاتف' : 'Phone Verification',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 8),
                
                Text(
                  isArabic 
                      ? 'سنرسل لك رمز التحقق عبر الرسائل القصيرة'
                      : 'We will send you a verification code via SMS',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 40),
                
                // Development Mode Notice
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    final otpHint = authProvider.pendingOtp?.otp;
                    return Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(
                        color: AppColors.info.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.info.withOpacity(0.3)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Development Mode',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  color: AppColors.info,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            otpHint != null
                                ? 'Latest OTP: $otpHint\nCodes expire after 5 minutes.'
                                : 'Enter a Sudanese phone number (e.g. +249123456789) to receive a mock OTP.',
                            style: const TextStyle(fontSize: 12),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                
                // Phone form
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      // Phone number field
                      Row(
                        children: [
                          // Country code dropdown
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                            decoration: BoxDecoration(
                              border: Border.all(color: AppColors.outline),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedCountryCode,
                                items: const [
                                  DropdownMenuItem(value: '+249', child: Text('🇸🇩 +249')),
                                  DropdownMenuItem(value: '+1', child: Text('🇺🇸 +1')),
                                  DropdownMenuItem(value: '+44', child: Text('🇬🇧 +44')),
                                ],
                                onChanged: (value) {
                                  setState(() {
                                    _selectedCountryCode = value ?? '+249';
                                  });
                                },
                              ),
                            ),
                          ),
                          
                          const SizedBox(width: 12),
                          
                          // Phone number input
                          Expanded(
                            child: TextFormField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              textInputAction: TextInputAction.done,
                              decoration: InputDecoration(
                                labelText: isArabic ? 'رقم الهاتف' : 'Phone Number',
                                prefixIcon: const Icon(Icons.phone_outlined),
                                hintText: '123456789',
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return isArabic 
                                      ? 'يرجى إدخال رقم الهاتف'
                                      : 'Please enter your phone number';
                                }
                                if (value.length < 9) {
                                  return isArabic 
                                      ? 'رقم الهاتف قصير جداً'
                                      : 'Phone number is too short';
                                }
                                return null;
                              },
                              onFieldSubmitted: (_) => _sendOTP(),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Send OTP button
                      Consumer<AuthProvider>(
                        builder: (context, authProvider, child) {
                          return SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: authProvider.isLoading ? null : _sendOTP,
                              child: authProvider.isLoading
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.white,
                                        ),
                                      ),
                                    )
                                  : Text(isArabic ? 'إرسال الرمز' : 'Send Code'),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Error display
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    if (authProvider.error != null) {
                      return Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 20),
                        decoration: BoxDecoration(
                          color: AppColors.error.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.error.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: AppColors.error),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                authProvider.error!,
                                style: const TextStyle(color: AppColors.error),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, color: AppColors.error),
                              onPressed: authProvider.clearError,
                            ),
                          ],
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _sendOTP() async {
    if (!_formKey.currentState!.validate()) return;
    
    final phoneNumber = '$_selectedCountryCode${_phoneController.text.trim()}';
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    final challenge = await authProvider.signInWithPhone(phoneNumber);

    if (challenge != null && mounted) {
      final encodedPhone = Uri.encodeComponent(phoneNumber);
      final encodedVerificationId = Uri.encodeComponent(challenge.verificationId);
      context.push('/otp-verification?phone=$encodedPhone&verificationId=$encodedVerificationId');
    }
  }
}