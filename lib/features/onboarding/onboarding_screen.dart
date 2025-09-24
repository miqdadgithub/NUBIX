import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/language_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/nubix_logo.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingPage> _pages = [
    OnboardingPage(
      title: 'Welcome to NUBIX',
      titleAr: 'مرحباً بك في نوبكس',
      description: 'Your trusted platform for buying cryptocurrency with Sudanese Pounds',
      descriptionAr: 'منصتك الموثوقة لشراء العملات المشفرة بالجنيه السوداني',
      icon: Icons.currency_bitcoin,
      color: AppColors.bitcoin,
    ),
    OnboardingPage(
      title: 'Secure Trading',
      titleAr: 'تداول آمن',
      description: 'Advanced security features with KYC verification and biometric authentication',
      descriptionAr: 'ميزات أمان متقدمة مع التحقق من الهوية والمصادقة البيومترية',
      icon: Icons.security,
      color: AppColors.success,
    ),
    OnboardingPage(
      title: 'Bank Integration',
      titleAr: 'تكامل مصرفي',
      description: 'Seamless integration with Bank of Khartoum through Bankak payment system',
      descriptionAr: 'تكامل سلس مع بنك الخرطوم من خلال نظام بنكك للدفع',
      icon: Icons.account_balance,
      color: AppColors.primary,
    ),
    OnboardingPage(
      title: 'Choose Your Language',
      titleAr: 'اختر لغتك',
      description: 'Select your preferred language to get started',
      descriptionAr: 'اختر لغتك المفضلة للبدء',
      icon: Icons.language,
      color: AppColors.secondary,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header with logo and skip button
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const NubixLogo(size: 40, showText: true),
                  if (_currentPage < _pages.length - 1)
                    TextButton(
                      onPressed: () => _goToLanguageSelection(),
                      child: const Text('Skip'),
                    ),
                ],
              ),
            ),
            
            // PageView
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  if (index == _pages.length - 1) {
                    return _buildLanguageSelectionPage();
                  }
                  return _buildOnboardingPage(_pages[index]);
                },
              ),
            ),
            
            // Bottom navigation
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Page indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _pages.length,
                      (index) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: _currentPage == index ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _currentPage == index 
                              ? AppColors.primary 
                              : AppColors.outline,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Navigation buttons
                  if (_currentPage < _pages.length - 1) ...[
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _nextPage,
                        child: Text(_currentPage == _pages.length - 2 ? 'Continue' : 'Next'),
                      ),
                    ),
                    if (_currentPage > 0) ...[
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: _previousPage,
                          child: const Text('Previous'),
                        ),
                      ),
                    ],
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOnboardingPage(OnboardingPage page) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final isArabic = languageProvider.isArabic;
    
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: page.color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              page.icon,
              size: 60,
              color: page.color,
            ),
          ),
          
          const SizedBox(height: 40),
          
          // Title
          Text(
            isArabic ? page.titleAr : page.title,
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.onSurface,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 16),
          
          // Description
          Text(
            isArabic ? page.descriptionAr : page.description,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: AppColors.onSurfaceVariant,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageSelectionPage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.language,
            size: 80,
            color: AppColors.secondary,
          ),
          
          const SizedBox(height: 40),
          
          Text(
            'Choose Your Language',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 8),
          
          Text(
            'اختر لغتك المفضلة',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 40),
          
          // Language selection buttons
          Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => _selectLanguageAndContinue('en'),
                  icon: const Text('🇺🇸', style: TextStyle(fontSize: 24)),
                  label: const Text('English'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
              
              const SizedBox(height: 16),
              
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => _selectLanguageAndContinue('ar'),
                  icon: const Text('🇸🇩', style: TextStyle(fontSize: 24)),
                  label: const Text('العربية'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _goToLanguageSelection() {
    _pageController.animateToPage(
      _pages.length - 1,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  void _selectLanguageAndContinue(String languageCode) {
    final languageProvider = Provider.of<LanguageProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    // Set selected language
    if (languageCode == 'ar') {
      languageProvider.setArabic();
    } else {
      languageProvider.setEnglish();
    }
    
    // Mark onboarding as complete
    authProvider.setFirstTimeComplete();
    
    // Navigate to login
    context.go('/login');
  }
}

class OnboardingPage {
  final String title;
  final String titleAr;
  final String description;
  final String descriptionAr;
  final IconData icon;
  final Color color;

  const OnboardingPage({
    required this.title,
    required this.titleAr,
    required this.description,
    required this.descriptionAr,
    required this.icon,
    required this.color,
  });
}