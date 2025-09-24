import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/language_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/nubix_logo.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _acceptTerms = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
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
                
                // Welcome text
                Text(
                  isArabic ? 'إنشاء حساب جديد' : 'Create New Account',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 8),
                
                Text(
                  isArabic 
                      ? 'انضم إلى نوبكس لبدء تداول العملات المشفرة'
                      : 'Join NUBIX to start trading cryptocurrencies',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 40),
                
                // Register form
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      // Full Name field
                      TextFormField(
                        controller: _fullNameController,
                        textInputAction: TextInputAction.next,
                        decoration: InputDecoration(
                          labelText: isArabic ? 'الاسم الكامل' : 'Full Name',
                          prefixIcon: const Icon(Icons.person_outline),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return isArabic 
                                ? 'يرجى إدخال الاسم الكامل'
                                : 'Please enter your full name';
                          }
                          if (value.length < 2) {
                            return isArabic 
                                ? 'الاسم قصير جداً'
                                : 'Name is too short';
                          }
                          return null;
                        },
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Email field
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        decoration: InputDecoration(
                          labelText: isArabic ? 'البريد الإلكتروني' : 'Email',
                          prefixIcon: const Icon(Icons.email_outlined),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return isArabic 
                                ? 'يرجى إدخال البريد الإلكتروني'
                                : 'Please enter your email';
                          }
                          if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                            return isArabic 
                                ? 'يرجى إدخال بريد إلكتروني صحيح'
                                : 'Please enter a valid email';
                          }
                          return null;
                        },
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Password field
                      TextFormField(
                        controller: _passwordController,
                        obscureText: !_isPasswordVisible,
                        textInputAction: TextInputAction.next,
                        decoration: InputDecoration(
                          labelText: isArabic ? 'كلمة المرور' : 'Password',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isPasswordVisible 
                                  ? Icons.visibility_off 
                                  : Icons.visibility,
                            ),
                            onPressed: () {
                              setState(() {
                                _isPasswordVisible = !_isPasswordVisible;
                              });
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return isArabic 
                                ? 'يرجى إدخال كلمة المرور'
                                : 'Please enter your password';
                          }
                          if (value.length < 6) {
                            return isArabic 
                                ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                                : 'Password must be at least 6 characters';
                          }
                          return null;
                        },
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Confirm Password field
                      TextFormField(
                        controller: _confirmPasswordController,
                        obscureText: !_isConfirmPasswordVisible,
                        textInputAction: TextInputAction.done,
                        decoration: InputDecoration(
                          labelText: isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isConfirmPasswordVisible 
                                  ? Icons.visibility_off 
                                  : Icons.visibility,
                            ),
                            onPressed: () {
                              setState(() {
                                _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                              });
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return isArabic 
                                ? 'يرجى تأكيد كلمة المرور'
                                : 'Please confirm your password';
                          }
                          if (value != _passwordController.text) {
                            return isArabic 
                                ? 'كلمات المرور غير متطابقة'
                                : 'Passwords do not match';
                          }
                          return null;
                        },
                        onFieldSubmitted: (_) => _handleRegister(),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Terms and conditions
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Checkbox(
                            value: _acceptTerms,
                            onChanged: (value) {
                              setState(() {
                                _acceptTerms = value ?? false;
                              });
                            },
                          ),
                          Expanded(
                            child: RichText(
                              text: TextSpan(
                                style: Theme.of(context).textTheme.bodyMedium,
                                children: [
                                  TextSpan(
                                    text: isArabic 
                                        ? 'أوافق على ' 
                                        : 'I agree to the ',
                                  ),
                                  TextSpan(
                                    text: isArabic 
                                        ? 'الشروط والأحكام'
                                        : 'Terms and Conditions',
                                    style: const TextStyle(
                                      color: AppColors.primary,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                  TextSpan(
                                    text: isArabic 
                                        ? ' و'
                                        : ' and ',
                                  ),
                                  TextSpan(
                                    text: isArabic 
                                        ? 'سياسة الخصوصية'
                                        : 'Privacy Policy',
                                    style: const TextStyle(
                                      color: AppColors.primary,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Register button
                      Consumer<AuthProvider>(
                        builder: (context, authProvider, child) {
                          return SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: authProvider.isLoading || !_acceptTerms
                                  ? null 
                                  : _handleRegister,
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
                                  : Text(isArabic ? 'إنشاء حساب' : 'Create Account'),
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
                
                // Login link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      isArabic ? 'تملك حساباً بالفعل؟' : "Already have an account?",
                    ),
                    TextButton(
                      onPressed: () => context.pop(),
                      child: Text(
                        isArabic ? 'تسجيل الدخول' : 'Sign In',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    
    if (!_acceptTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            Provider.of<LanguageProvider>(context, listen: false).isArabic
                ? 'يرجى الموافقة على الشروط والأحكام'
                : 'Please accept the terms and conditions',
          ),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    final success = await authProvider.registerWithEmail(
      _emailController.text.trim(),
      _passwordController.text,
      _fullNameController.text.trim(),
    );
    
    if (success && mounted) {
      context.go('/home');
    }
  }
}