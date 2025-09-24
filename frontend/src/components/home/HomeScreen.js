import React, { useState, useEffect } from 'react';
import { useAuth, useLanguage } from '../../App';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  CreditCard, 
  User, 
  LogOut, 
  Bell,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const { t, toggleLanguage, isArabic } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('home');
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get('/api/crypto/prices');
      setCryptoPrices(response.data.prices);
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = () => {
    alert(t(
      'Buy feature coming soon! You will be able to purchase cryptocurrencies with Sudanese Pounds through Bank of Khartoum.',
      'ميزة الشراء قريباً! ستتمكن من شراء العملات المشفرة بالجنيه السوداني عبر بنك الخرطوم.'
    ));
  };

  const handleDepositClick = () => {
    alert(t(
      'Deposit feature coming soon! You will be able to deposit funds from your Bank of Khartoum account.',
      'ميزة الإيداع قريباً! ستتمكن من إيداع الأموال من حسابك في بنك الخرطوم.'
    ));
  };

  const handleLogout = () => {
    if (window.confirm(t('Are you sure you want to sign out?', 'هل أنت متأكد من أنك تريد تسجيل الخروج؟'))) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl text-gray-900">NUBIX</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={toggleLanguage}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isArabic ? 'English' : 'العربية'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <User className="w-5 h-5 mr-1" />
                <span className="hidden lg:block">{user?.fullName}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
            <div className="space-y-2">
              <button
                onClick={toggleLanguage}
                className="block w-full text-left text-primary-600 hover:text-primary-700 font-medium py-2"
              >
                {isArabic ? 'English' : 'العربية'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 py-2"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t('Sign Out', 'تسجيل الخروج')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && <HomeTab user={user} cryptoPrices={cryptoPrices} loading={loading} />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'home' ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Wallet className="w-6 h-6 mb-1" />
            <span className="text-xs">{t('Home', 'الرئيسية')}</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'portfolio' ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-xs">{t('Portfolio', 'المحفظة')}</span>
          </button>
          <button
            onClick={handleBuyClick}
            className="flex flex-col items-center py-2 px-3 rounded-lg bg-primary-600 text-white"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-xs">{t('Buy', 'شراء')}</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'transactions' ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <CreditCard className="w-6 h-6 mb-1" />
            <span className="text-xs">{t('History', 'التاريخ')}</span>
          </button>
        </div>
      </nav>

      {/* Padding for bottom navigation */}
      <div className="h-20"></div>
    </div>
  );
};

// Home Tab Component
const HomeTab = ({ user, cryptoPrices, loading }) => {
  const { t, isArabic } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="crypto-card">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {t(`Welcome, ${user?.fullName || 'User'}!`, `مرحباً، ${user?.fullName || 'مستخدم'}!`)}
          </h1>
          <p className="text-gray-600">
            {t('Start your cryptocurrency journey', 'ابدأ رحلتك في عالم العملات المشفرة')}
          </p>
        </div>
        
        <div className="gradient-primary rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-opacity-80 text-sm">
                {t('Total Balance', 'الرصيد الإجمالي')}
              </p>
              <h2 className="text-3xl font-bold">SDG {(user?.balance || 0).toFixed(2)}</h2>
            </div>
            <Wallet className="w-12 h-12 text-white text-opacity-60" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('Quick Actions', 'إجراءات سريعة')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            title={t('Buy Crypto', 'شراء العملات')}
            icon={Plus}
            color="bg-green-500"
            onClick={() => alert(t('Buy feature coming soon!', 'ميزة الشراء قريباً!'))}
          />
          <ActionCard
            title={t('Deposit Funds', 'إيداع الأموال')}
            icon={CreditCard}
            color="bg-primary-600"
            onClick={() => alert(t('Deposit feature coming soon!', 'ميزة الإيداع قريباً!'))}
          />
        </div>
      </div>

      {/* Market Prices */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('Market Prices', 'أسعار السوق')}
        </h3>
        
        {loading ? (
          <div className="crypto-card text-center py-8">
            <div className="loading-spinner mx-auto"></div>
            <p className="text-gray-600 mt-2">{t('Loading prices...', 'جارٍ تحميل الأسعار...')}</p>
          </div>
        ) : (
          <div className="crypto-card">
            {cryptoPrices.map((crypto) => (
              <CryptoPriceItem key={crypto.symbol} crypto={crypto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Portfolio Tab Component
const PortfolioTab = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('Portfolio Empty', 'المحفظة فارغة')}
      </h3>
      <p className="text-gray-600 mb-6">
        {t('Start by buying your first cryptocurrency', 'ابدأ بشراء عملتك المشفرة الأولى')}
      </p>
      <button className="btn-primary">
        {t('Buy Now', 'شراء الآن')}
      </button>
    </div>
  );
};

// Transactions Tab Component
const TransactionsTab = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('No Transactions', 'لا توجد معاملات')}
      </h3>
      <p className="text-gray-600">
        {t('Your transactions will appear here', 'ستظهر معاملاتك هنا')}
      </p>
    </div>
  );
};

// Action Card Component
const ActionCard = ({ title, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="crypto-card text-center hover:shadow-lg transition-shadow"
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-gray-900 font-medium">{title}</span>
    </button>
  );
};

// Crypto Price Item Component
const CryptoPriceItem = ({ crypto }) => {
  const isPositive = crypto.change24h >= 0;
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
          <span className="font-bold text-gray-700">{crypto.icon || crypto.symbol[0]}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{crypto.symbol}</h4>
          <p className="text-gray-600 text-sm">{crypto.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-900">${crypto.price.toFixed(2)}</p>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(crypto.change24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;