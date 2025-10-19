import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/language_provider.dart';
import '../../core/theme/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final isArabic = languageProvider.isArabic;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(isArabic ? 'الملف الشخصي' : 'Profile'),
        centerTitle: true,
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Profile header
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: AppColors.primary.withOpacity(0.1),
                          child: user?.photoURL != null
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(50),
                                  child: Image.network(
                                    user!.photoURL!,
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                  ),
                                )
                              : Text(
                                  (user?.displayName?.isNotEmpty ?? false)
                                      ? user!.displayName![0].toUpperCase()
                                      : 'U',
                                  style: const TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          user?.displayName ?? (isArabic ? 'مستخدم' : 'User'),
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (user?.email != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            user!.email!,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                        ],
                        if (user?.phoneNumber != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            user!.phoneNumber!,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Account section
                _buildSectionCard(
                  context,
                  isArabic ? 'الحساب' : 'Account',
                  [
                    _buildListTile(
                      context,
                      isArabic ? 'معلومات الحساب' : 'Account Information',
                      Icons.person_outline,
                      () => _showComingSoon(context, isArabic),
                    ),
                    _buildListTile(
                      context,
                      isArabic ? 'التحقق من الهوية' : 'Identity Verification',
                      Icons.verified_user_outlined,
                      () => _showKycInfo(context, isArabic),
                      trailing: Chip(
                        label: Text(
                          isArabic ? 'مطلوب' : 'Required',
                          style: const TextStyle(fontSize: 12),
                        ),
                        backgroundColor: AppColors.warning.withOpacity(0.1),
                        side: const BorderSide(color: AppColors.warning),
                      ),
                    ),
                    _buildListTile(
                      context,
                      isArabic ? 'الأمان' : 'Security',
                      Icons.security_outlined,
                      () => _showComingSoon(context, isArabic),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                // Preferences section
                _buildSectionCard(
                  context,
                  isArabic ? 'التفضيلات' : 'Preferences',
                  [
                    _buildListTile(
                      context,
                      isArabic ? 'اللغة' : 'Language',
                      Icons.language,
                      () => _showLanguageDialog(context, languageProvider, isArabic),
                      trailing: Text(isArabic ? 'العربية' : 'English'),
                    ),
                    _buildListTile(
                      context,
                      isArabic ? 'الإشعارات' : 'Notifications',
                      Icons.notifications_outlined,
                      () => _showComingSoon(context, isArabic),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                // Support section
                _buildSectionCard(
                  context,
                  isArabic ? 'الدعم' : 'Support',
                  [
                    _buildListTile(
                      context,
                      isArabic ? 'مركز المساعدة' : 'Help Center',
                      Icons.help_outline,
                      () => _showComingSoon(context, isArabic),
                    ),
                    _buildListTile(
                      context,
                      isArabic ? 'اتصل بنا' : 'Contact Us',
                      Icons.contact_support_outlined,
                      () => _showComingSoon(context, isArabic),
                    ),
                    _buildListTile(
                      context,
                      isArabic ? 'حول نوبكس' : 'About NUBIX',
                      Icons.info_outline,
                      () => _showAboutDialog(context, isArabic),
                    ),
                  ],
                ),
                
                const SizedBox(height: 32),
                
                // Sign out button
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => _showSignOutDialog(context, authProvider, isArabic),
                    icon: const Icon(Icons.logout, color: AppColors.error),
                    label: Text(
                      isArabic ? 'تسجيل الخروج' : 'Sign Out',
                      style: const TextStyle(color: AppColors.error),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                ),
                
                const SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionCard(BuildContext context, String title, List<Widget> children) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _buildListTile(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap, {
    Widget? trailing,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.onSurfaceVariant),
      title: Text(title),
      trailing: trailing ?? const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }

  void _showLanguageDialog(
    BuildContext context,
    LanguageProvider languageProvider,
    bool isArabic,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isArabic ? 'اختر اللغة' : 'Choose Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<bool>(
              title: const Text('English'),
              value: false,
              groupValue: isArabic,
              onChanged: (value) {
                languageProvider.setEnglish();
                Navigator.pop(context);
              },
            ),
            RadioListTile<bool>(
              title: const Text('العربية'),
              value: true,
              groupValue: isArabic,
              onChanged: (value) {
                languageProvider.setArabic();
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showKycInfo(BuildContext context, bool isArabic) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isArabic ? 'التحقق من الهوية' : 'Identity Verification'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isArabic 
                  ? 'للبدء في التداول، تحتاج إلى التحقق من هويتك'
                  : 'To start trading, you need to verify your identity',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            Text(
              isArabic ? 'المستويات المتاحة:' : 'Available levels:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('• ${isArabic ? 'المستوى الأساسي: حد يومي 5,000 جنيه' : 'Basic Level: Daily limit SDG 5,000'}'),
            Text('• ${isArabic ? 'المستوى المتقدم: حد شهري 100,000 جنيه' : 'Enhanced Level: Monthly limit SDG 100,000'}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'لاحقاً' : 'Later'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _showComingSoon(context, isArabic);
            },
            child: Text(isArabic ? 'ابدأ التحقق' : 'Start Verification'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context, bool isArabic) {
    showDialog(
      context: context,
      builder: (context) => AboutDialog(
        applicationName: 'NUBIX',
        applicationVersion: '1.0.0',
        applicationIcon: const CircleAvatar(
          radius: 24,
          backgroundColor: AppColors.primary,
          child: Text(
            'N',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ),
        children: [
          Text(
            isArabic 
                ? 'نوبكس هو تطبيق تداول العملات المشفرة للمستخدمين السودانيين، يمكن من شراء العملات المشفرة بالجنيه السوداني عبر بنك الخرطوم.'
                : 'NUBIX is a cryptocurrency trading app for Sudanese users, enabling cryptocurrency purchases with Sudanese Pounds through Bank of Khartoum.',
          ),
        ],
      ),
    );
  }

  void _showSignOutDialog(
    BuildContext context,
    AuthProvider authProvider,
    bool isArabic,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isArabic ? 'تسجيل الخروج' : 'Sign Out'),
        content: Text(
          isArabic 
              ? 'هل أنت متأكد من أنك تريد تسجيل الخروج؟'
              : 'Are you sure you want to sign out?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'إلغاء' : 'Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              await authProvider.signOut();
              if (context.mounted) {
                context.go('/login');
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            child: Text(
              isArabic ? 'تسجيل الخروج' : 'Sign Out',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showComingSoon(BuildContext context, bool isArabic) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isArabic ? 'قريباً' : 'Coming Soon'),
        content: Text(
          isArabic 
              ? 'هذه الميزة قيد التطوير وستكون متاحة قريباً'
              : 'This feature is under development and will be available soon',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(isArabic ? 'حسناً' : 'OK'),
          ),
        ],
      ),
    );
  }
}
