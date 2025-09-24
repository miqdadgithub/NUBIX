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
      floatingActionButton: _selectedIndex == 0 ? FloatingActionButton.extended(
        onPressed: () => _showBuyDialog(context),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: Text(
          isArabic ? 'شراء' : 'Buy',
          style: const TextStyle(color: Colors.white),
        ),
      ) : null,
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
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isArabic 
                            ? 'مرحباً، ${user?.displayName ?? 'مستخدم'}!'
                            : 'Welcome, ${user?.displayName ?? 'User'}!',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        isArabic 
                            ? 'ابدأ رحلتك في عالم العملات المشفرة'
                            : 'Start your cryptocurrency journey',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    isArabic ? 'الرصيد الإجمالي' : 'Total Balance',
                                    style: const TextStyle(
                                      color: Colors.white70,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'SDG 0.00',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.account_balance_wallet,
                              color: Colors.white,
                              size: 32,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
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
          
          Row(
            children: [
              Expanded(
                child: _buildActionCard(
                  context,
                  isArabic ? 'شراء' : 'Buy',
                  Icons.add_circle,
                  AppColors.success,
                  () => _showBuyDialog(context),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildActionCard(
                  context,
                  isArabic ? 'إيداع' : 'Deposit',
                  Icons.account_balance,
                  AppColors.primary,
                  () => _showDepositDialog(context),
                ),
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

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Icon(icon, size: 32, color: color),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
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

  void _showDepositDialog(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context, listen: false);
    final isArabic = languageProvider.isArabic;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isArabic ? 'إيداع الأموال' : 'Deposit Funds'),
        content: Text(
          isArabic 
              ? 'ستتمكن قريباً من إيداع الأموال من حسابك المصرفي في بنك الخرطوم'
              : 'You will soon be able to deposit funds from your Bank of Khartoum account',
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