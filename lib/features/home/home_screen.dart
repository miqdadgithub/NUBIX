import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/language_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/nubix_logo.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<CryptoPrice> _cryptoPrices = [
    CryptoPrice(
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67542.30,
      change24h: 2.45,
      icon: Icons.currency_bitcoin,
      color: AppColors.bitcoin,
    ),
    CryptoPrice(
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3842.15,
      change24h: -1.23,
      icon: Icons.diamond,
      color: AppColors.ethereum,
    ),
    CryptoPrice(
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 596.78,
      change24h: 0.89,
      icon: Icons.monetization_on,
      color: AppColors.binanceCoin,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final isArabic = languageProvider.isArabic;
    
    return Scaffold(
      appBar: _buildAppBar(context, isArabic),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _buildHomeTab(isArabic),
          _buildPortfolioTab(isArabic),
          _buildTransactionsTab(isArabic),
        ],
      ),
      bottomNavigationBar: _buildBottomNavBar(isArabic),
      floatingActionButton: _selectedIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () => _showBuyDialog(context),
              backgroundColor: AppColors.secondary,
              foregroundColor: AppColors.onSecondary,
              icon: const Icon(Icons.add, color: AppColors.onSecondary),
              label: Text(
                isArabic ? 'شراء' : 'Buy',
                style: const TextStyle(color: AppColors.onSecondary),
              ),
            )
          : null,
    );
  }

  AppBar _buildAppBar(BuildContext context, bool isArabic) {
    return AppBar(
      title: const NubixLogo(size: 32, showText: true),
      centerTitle: false,
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.person_outline),
          onPressed: () => context.push('/profile'),
        ),
      ],
    );
  }

  Widget _buildHomeTab(bool isArabic) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome card
          Consumer<AuthProvider>(
            builder: (context, authProvider, child) {
              final user = authProvider.user;
              return Container(
                decoration: BoxDecoration(
                  gradient: AppColors.sunriseGradient,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.12),
                      blurRadius: 24,
                      offset: const Offset(0, 12),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    Positioned(
                      top: -40,
                      right: -30,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.08),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  isArabic
                                      ? 'مرحباً، ${user?.displayName ?? 'مستخدم'}!'
                                      : 'Welcome, ${user?.displayName ?? 'User'}!',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(
                                        color: AppColors.onPrimary,
                                        fontWeight: FontWeight.w700,
                                      ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  isArabic
                                      ? 'متابعتك تعني الكثير لنا. استمر في بناء محفظتك بخطوات واثقة'
                                      : 'We\'re glad to see you back. Build your portfolio with confidence.',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: Colors.white.withOpacity(0.8),
                                      ),
                                ),
                                const SizedBox(height: 24),
                                Container(
                                  padding: const EdgeInsets.all(18),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.18),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              isArabic
                                                  ? 'الرصيد التجريبي'
                                                  : 'Demo balance',
                                              style: const TextStyle(
                                                color: Colors.white70,
                                                fontSize: 14,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            const Text(
                                              'SDG 0.00',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 26,
                                                fontWeight: FontWeight.w800,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.all(12),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.15),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(
                                          Icons.show_chart,
                                          color: Colors.white,
                                          size: 28,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 24),
                          const NubixLogo(
                            size: 88,
                            showBadge: false,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          
          const SizedBox(height: 24),
          
          // Quick actions
          Text(
            isArabic ? 'إجراءات سريعة' : 'Quick Actions',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          
          const SizedBox(height: 16),
          
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _buildActionButton(
                context,
                title: isArabic ? 'شراء' : 'Buy',
                icon: Icons.trending_up,
                gradient: AppColors.primaryGradient,
                onTap: () => _showBuyDialog(context),
              ),
              _buildActionButton(
                context,
                title: isArabic ? 'دليل نوبكس' : 'NubiX Academy',
                icon: Icons.auto_stories,
                gradient: AppColors.goldGradient,
                onTap: () => _showAcademySheet(context, isArabic),
              ),
              _buildActionButton(
                context,
                title: isArabic ? 'خريطة الطريق' : 'Roadmap',
                icon: Icons.map_outlined,
                gradient: const LinearGradient(
                  colors: [AppColors.surface, AppColors.surfaceVariant],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                foregroundColor: AppColors.onSurface,
                onTap: () => _showRoadmapSheet(context, isArabic),
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Market prices
          Text(
            isArabic ? 'أسعار السوق' : 'Market Prices',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          
          const SizedBox(height: 16),
          
          Card(
            child: Column(
              children: _cryptoPrices
                  .map((crypto) => _buildCryptoTile(crypto, isArabic))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPortfolioTab(bool isArabic) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.pie_chart_outline,
            size: 64,
            color: AppColors.onSurfaceVariant,
          ),
          const SizedBox(height: 16),
          Text(
            isArabic ? 'المحفظة فارغة' : 'Portfolio Empty',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            isArabic 
                ? 'ابدأ بشراء عملتك المشفرة الأولى'
                : 'Start by buying your first cryptocurrency',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => _showBuyDialog(context),
            child: Text(isArabic ? 'شراء الآن' : 'Buy Now'),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionsTab(bool isArabic) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 64,
            color: AppColors.onSurfaceVariant,
          ),
          const SizedBox(height: 16),
          Text(
            isArabic ? 'لا توجد معاملات' : 'No Transactions',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            isArabic 
                ? 'ستظهر معاملاتك هنا'
                : 'Your transactions will appear here',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required String title,
    required IconData icon,
    required LinearGradient gradient,
    required VoidCallback onTap,
    Color? foregroundColor,
  }) {
    final textColor = foregroundColor ?? Colors.white;
    final iconAccent = foregroundColor ?? Colors.white;
    final iconBackground = foregroundColor == null
        ? Colors.white.withOpacity(0.2)
        : AppColors.secondary.withOpacity(0.2);
    final double width = (MediaQuery.of(context).size.width - 32 - 12) / 2;

    return SizedBox(
      width: width,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Ink(
            decoration: BoxDecoration(
              gradient: gradient,
              borderRadius: BorderRadius.circular(20),
              border: foregroundColor != null
                  ? Border.all(color: AppColors.outline)
                  : null,
              boxShadow: [
                BoxShadow(
                  color: (foregroundColor ?? gradient.colors.last)
                      .withOpacity(foregroundColor == null ? 0.18 : 0.08),
                  blurRadius: 18,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: iconBackground,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 24, color: iconAccent),
                ),
                const SizedBox(height: 18),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: textColor,
                        fontWeight: FontWeight.w700,
                      ) ??
                      TextStyle(
                        color: textColor,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCryptoTile(CryptoPrice crypto, bool isArabic) {
    final isPositive = crypto.change24h >= 0;
    
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: crypto.color.withOpacity(0.1),
        child: Icon(crypto.icon, color: crypto.color),
      ),
      title: Text(
        crypto.symbol,
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      subtitle: Text(crypto.name),
      trailing: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '\$${crypto.price.toStringAsFixed(2)}',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                isPositive ? Icons.arrow_upward : Icons.arrow_downward,
                color: isPositive ? AppColors.bullish : AppColors.bearish,
                size: 16,
              ),
              Text(
                '${crypto.change24h.abs().toStringAsFixed(2)}%',
                style: TextStyle(
                  color: isPositive ? AppColors.bullish : AppColors.bearish,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  BottomNavigationBar _buildBottomNavBar(bool isArabic) {
    return BottomNavigationBar(
      currentIndex: _selectedIndex,
      onTap: (index) {
        setState(() {
          _selectedIndex = index;
        });
      },
      items: [
        BottomNavigationBarItem(
          icon: const Icon(Icons.home),
          label: isArabic ? 'الرئيسية' : 'Home',
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.pie_chart),
          label: isArabic ? 'المحفظة' : 'Portfolio',
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.receipt_long),
          label: isArabic ? 'المعاملات' : 'Transactions',
        ),
      ],
    );
  }

  void _showAcademySheet(BuildContext context, bool isArabic) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: AppColors.background,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.auto_stories, color: AppColors.primary),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    isArabic ? 'دليل نوبكس' : 'NubiX Academy',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                isArabic
                    ? 'اطلع على أساسيات العملات المشفرة، وتعرف على كيفية حماية حسابك، واستكشف ما نعمل عليه قبل الإطلاق الرسمي.'
                    : 'Dive into crypto fundamentals, understand how we keep your account secure, and see what is coming next before the official launch.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: AppColors.onSurfaceVariant,
                    ),
              ),
              const SizedBox(height: 20),
              ...[
                _buildAcademyBullet(
                  context,
                  icon: Icons.verified_user,
                  title: isArabic ? 'إرشادات الأمان' : 'Security walkthroughs',
                  subtitle: isArabic
                      ? 'تعرف على المصادقة الثنائية، حماية OTP، وكيفية الإبلاغ عن أي نشاط مشبوه.'
                      : 'Learn about 2FA, OTP safety, and how to flag unusual activity.',
                ),
                _buildAcademyBullet(
                  context,
                  icon: Icons.payments_outlined,
                  title: isArabic ? 'رحلة الدفع المحلية' : 'Local payment journey',
                  subtitle: isArabic
                      ? 'خطوات ربط حساب بنك الخرطوم والتكامل القادم مع بنكك.'
                      : 'Steps for linking Bank of Khartoum accounts and the upcoming Bankak integration.',
                ),
                _buildAcademyBullet(
                  context,
                  icon: Icons.rocket_launch,
                  title: isArabic ? 'ابدأ بثقة' : 'Start confidently',
                  subtitle: isArabic
                      ? 'نصائح لتكوين محفظتك الأولى باستخدام أرصدة تجريبية قبل تفعيل التداول الحقيقي.'
                      : 'Tips for building your first portfolio with demo balances before live trading goes live.',
                ),
              ],
              const SizedBox(height: 12),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(isArabic ? 'تم' : 'Got it'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAcademyBullet(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppColors.secondary, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showRoadmapSheet(BuildContext context, bool isArabic) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        final milestones = [
          _RoadmapMilestone(
            title: isArabic ? 'تكامل بنكك' : 'Bankak integration',
            description: isArabic
                ? 'واجهات برمجية رسمية لربط حسابك في بنك الخرطوم وتعبئة رصيدك فورياً.'
                : 'Official APIs to link your Bank of Khartoum account for instant top-ups.',
            quarter: 'Q3',
          ),
          _RoadmapMilestone(
            title: isArabic ? 'توثيق الهوية (KYC)' : 'Identity verification',
            description: isArabic
                ? 'رحلة تحقق مبسطة بدعم المستندات المحلية والتقاط الهوية عبر الهاتف.'
                : 'Streamlined KYC with local document support and in-app ID capture.',
            quarter: 'Q4',
          ),
          _RoadmapMilestone(
            title: isArabic ? 'التداول المباشر' : 'Live trading',
            description: isArabic
                ? 'أوامر فورية، أسعار متدفقه، وإدارة محافظ متقدمة مع تنبيهات ذكية.'
                : 'Instant orders, streaming prices, and advanced portfolio tools with smart alerts.',
            quarter: 'Q1',
          ),
        ];

        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: AppColors.background,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.map_outlined, color: AppColors.primary),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    isArabic ? 'خريطة الطريق' : 'Roadmap',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                ],
              ),
              const SizedBox(height: 20),
              ...milestones
                  .map((milestone) => _buildMilestoneTile(context, milestone, isArabic))
                  .toList(),
              const SizedBox(height: 12),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(isArabic ? 'إغلاق' : 'Close'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMilestoneTile(
    BuildContext context,
    _RoadmapMilestone milestone,
    bool isArabic,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.2),
              borderRadius: BorderRadius.circular(14),
            ),
            alignment: Alignment.center,
            child: Text(
              milestone.quarter,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  milestone.title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 6),
                Text(
                  milestone.description,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.onSurfaceVariant,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showBuyDialog(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context, listen: false);
    final isArabic = languageProvider.isArabic;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isArabic ? 'شراء العملات المشفرة' : 'Buy Cryptocurrency'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              isArabic 
                  ? 'ستتمكن قريباً من شراء العملات المشفرة باستخدام الجنيه السوداني'
                  : 'You will soon be able to buy cryptocurrencies using Sudanese Pounds',
            ),
            const SizedBox(height: 16),
            Text(
              isArabic ? 'الميزات قيد التطوير:' : 'Features under development:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('• ${isArabic ? 'تكامل بنك الخرطوم' : 'Bank of Khartoum integration'}'),
                Text('• ${isArabic ? 'تحقق الهوية (KYC)' : 'KYC verification'}'),
                Text('• ${isArabic ? 'تداول مباشر' : 'Live trading'}'),
              ],
            ),
          ],
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

class CryptoPrice {
  final String symbol;
  final String name;
  final double price;
  final double change24h;
  final IconData icon;
  final Color color;

  const CryptoPrice({
    required this.symbol,
    required this.name,
    required this.price,
    required this.change24h,
    required this.icon,
    required this.color,
  });
}

class _RoadmapMilestone {
  final String title;
  final String description;
  final String quarter;

  const _RoadmapMilestone({
    required this.title,
    required this.description,
    required this.quarter,
  });
}