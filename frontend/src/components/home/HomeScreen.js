import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { 
  Wallet, 
  TrendingUp, 
  Plus, 
  CreditCard, 
  User, 
  LogOut, 
  Bell,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw
} from 'lucide-react';
import NubixLogo from '../NubixLogo';
import cryptoService from '../../services/cryptoService';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, toggleLanguage, isArabic } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('home');
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCryptoPrices();
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoPrices = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const prices = await cryptoService.getLatestPrices(['BTC', 'ETH', 'BNB', 'ADA', 'XRP']);
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBuyClick = (crypto = null) => {
    setActiveTab('buy');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-nubix border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NubixLogo size="md" showText={true} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => fetchCryptoPrices(true)}
                className="p-2 text-gray-600 hover:text-primary-600 nubix-transition"
                disabled={refreshing}
              >
                <RotateCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary-600 nubix-transition">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={toggleLanguage}
                className="nubix-btn-secondary px-4 py-2 text-sm"
              >
                {isArabic ? 'English' : 'العربية'}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden lg:block font-medium text-gray-700">{user?.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="p-1 text-gray-400 hover:text-gray-600 nubix-transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
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
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
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
        {activeTab === 'home' && <HomeTab user={user} cryptoPrices={cryptoPrices} loading={loading} onBuyClick={handleBuyClick} />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'buy' && <BuyTab cryptoPrices={cryptoPrices} onBack={() => setActiveTab('home')} />}
        {activeTab === 'kyc' && <KYCTab />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
        {activeTab === 'history' && <TransactionsTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-nubix px-4 py-2 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <NavButton
            icon={Wallet}
            label={t('Home', 'الرئيسية')}
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavButton
            icon={TrendingUp}
            label={t('Portfolio', 'المحفظة')}
            isActive={activeTab === 'portfolio'}
            onClick={() => setActiveTab('portfolio')}
          />
          <NavButton
            icon={Plus}
            label={t('Buy', 'شراء')}
            isActive={activeTab === 'buy'}
            onClick={() => setActiveTab('buy')}
            isPrimary={true}
          />
          <NavButton
            icon={User}
            label={t('KYC', 'التحقق')}
            isActive={activeTab === 'kyc'}
            onClick={() => setActiveTab('kyc')}
          />
          <NavButton
            icon={CreditCard}
            label={t('Profile', 'الملف')}
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </nav>

      {/* Padding for bottom navigation */}
      <div className="h-20"></div>
    </div>
  );
};

// Navigation Button Component
const NavButton = ({ icon: Icon, label, isActive, onClick, isPrimary = false }) => {
  if (isPrimary) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center py-2 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-nubix transform hover:scale-105 nubix-transition"
      >
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center py-2 px-3 rounded-lg nubix-transition ${
        isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600'
      }`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs">{label}</span>
    </button>
  );
};

// Home Tab Component
const HomeTab = ({ user, cryptoPrices, loading, onBuyClick }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="nubix-card bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
        <div className="mb-4">
          <h1 className="text-2xl font-display font-bold">
            {t(`Welcome, ${user?.fullName || 'User'}!`, `مرحباً، ${user?.fullName || 'مستخدم'}!`)}
          </h1>
          <p className="text-white text-opacity-90">
            {t('Start your cryptocurrency journey', 'ابدأ رحلتك في عالم العملات المشفرة')}
          </p>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-opacity-80 text-sm font-medium">
                {t('Total Balance', 'الرصيد الإجمالي')}
              </p>
              <h2 className="text-2xl font-bold">{cryptoService.formatSDG(user?.balance || 0)}</h2>
            </div>
            <Wallet className="w-10 h-10 text-white text-opacity-60" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          {t('Quick Actions', 'إجراءات سريعة')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            title={t('Buy Crypto', 'شراء العملات')}
            icon={Plus}
            color="bg-gradient-to-r from-success to-green-600"
            onClick={() => onBuyClick()}
          />
          <ActionCard
            title={t('Deposit Funds', 'إيداع الأموال')}
            icon={CreditCard}
            color="bg-gradient-to-r from-primary-500 to-primary-600"
            onClick={() => alert(t('Deposit feature coming soon!', 'ميزة الإيداع قريباً!'))}
          />
        </div>
      </div>

      {/* Market Prices */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-display font-semibold text-gray-900">
            {t('Market Prices', 'أسعار السوق')}
          </h3>
          <p className="text-xs text-gray-500">
            {t('Updated every 30 seconds', 'يتم التحديث كل 30 ثانية')}
          </p>
        </div>
        
        {loading ? (
          <div className="nubix-card text-center py-8">
            <div className="nubix-spinner mx-auto mb-2"></div>
            <p className="text-gray-600">{t('Loading prices...', 'جارٍ تحميل الأسعار...')}</p>
          </div>
        ) : (
          <div className="nubix-card space-y-1">
            {cryptoPrices.map((crypto) => (
              <CryptoPriceItem key={crypto.symbol} crypto={crypto} onBuyClick={onBuyClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Crypto Price Item Component
const CryptoPriceItem = ({ crypto, onBuyClick }) => {
  const { t } = useLanguage();
  const isPositive = crypto.change24h >= 0;
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 nubix-transition cursor-pointer"
         onClick={() => onBuyClick(crypto)}>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl">{crypto.icon}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{crypto.symbol}</h4>
          <p className="text-gray-600 text-sm">{crypto.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-900">{cryptoService.formatUSD(crypto.priceUSD)}</p>
        <p className="text-sm text-gray-600">{cryptoService.formatSDG(crypto.priceSDG)}</p>
        <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(crypto.change24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

// Action Card Component
const ActionCard = ({ title, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="nubix-card text-center hover:shadow-nubix-lg nubix-transition transform hover:scale-105"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-gray-900 font-semibold">{title}</span>
    </button>
  );
};

// Portfolio Tab Component
const PortfolioTab = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <TrendingUp className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {t('Portfolio Empty', 'المحفظة فارغة')}
      </h3>
      <p className="text-gray-600 mb-6">
        {t('Start by buying your first cryptocurrency', 'ابدأ بشراء عملتك المشفرة الأولى')}
      </p>
      <button className="nubix-btn-primary">
        {t('Buy Now', 'شراء الآن')}
      </button>
    </div>
  );
};

// Buy Tab Component  
const BuyTab = ({ cryptoPrices, onBack }) => {
  const { t } = useLanguage();
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [amount, setAmount] = useState('');
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    if (selectedCrypto && amount) {
      const calc = cryptoService.calculatePurchase(parseFloat(amount), selectedCrypto.priceUSD);
      setCalculation(calc);
    } else {
      setCalculation(null);
    }
  }, [selectedCrypto, amount]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900">
          {t('Buy Cryptocurrency', 'شراء العملة المشفرة')}
        </h2>
        <button onClick={onBack} className="nubix-btn-secondary px-4 py-2">
          {t('Back', 'رجوع')}
        </button>
      </div>

      {/* Crypto Selection */}
      <div className="nubix-card">
        <h3 className="font-semibold text-gray-900 mb-4">
          {t('Select Cryptocurrency', 'اختر العملة المشفرة')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cryptoPrices.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => setSelectedCrypto(crypto)}
              className={`p-4 border-2 rounded-xl nubix-transition ${
                selectedCrypto?.symbol === crypto.symbol
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{crypto.icon}</span>
                <div className="text-left">
                  <p className="font-semibold">{crypto.symbol}</p>
                  <p className="text-sm text-gray-600">{cryptoService.formatUSD(crypto.priceUSD)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      {selectedCrypto && (
        <div className="nubix-card">
          <h3 className="font-semibold text-gray-900 mb-4">
            {t('Enter Amount', 'أدخل المبلغ')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Amount in', 'الكمية بـ')} {selectedCrypto.symbol}
              </label>
              <input
                type="number"
                step="0.00000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="nubix-input"
                placeholder={`0.0 ${selectedCrypto.symbol}`}
              />
            </div>

            {calculation && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span>{t('Price per', 'سعر كل')} {selectedCrypto.symbol}:</span>
                  <span className="font-medium">{cryptoService.formatSDG(selectedCrypto.priceSDG)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Subtotal:', 'المجموع الفرعي:')}</span>
                  <span className="font-medium">{cryptoService.formatSDG(calculation.totalSDG)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('Fee (0.75%):', 'الرسوم (0.75%):')}</span>
                  <span>{cryptoService.formatSDG(calculation.fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('Processing Fee:', 'رسوم المعالجة:')}</span>
                  <span>{cryptoService.formatSDG(calculation.processingFee)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('Total:', 'الإجمالي:')}</span>
                  <span>{cryptoService.formatSDG(calculation.finalAmount)}</span>
                </div>
              </div>
            )}

            <button 
              className="w-full nubix-btn-primary text-lg py-4"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {t('Proceed to Payment', 'الانتقال للدفع')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// KYC Tab Component
const KYCTab = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-gray-900">
        {t('KYC Verification', 'التحقق من الهوية')}
      </h2>

      <div className="nubix-card">
        <h3 className="font-semibold text-gray-900 mb-4">
          {t('Verification Status', 'حالة التحقق')}
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 font-medium">
            {t('Verification Required', 'التحقق مطلوب')}
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            {t('Complete your KYC verification to start trading', 'أكمل التحقق من هويتك لبدء التداول')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span>{t('Identity Document', 'وثيقة الهوية')}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {t('Pending', 'معلق')}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <span>{t('Address Proof', 'إثبات العنوان')}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {t('Pending', 'معلق')}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span>{t('Selfie Verification', 'التحقق بالصورة الشخصية')}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {t('Pending', 'معلق')}
            </span>
          </div>
        </div>

        <button className="w-full nubix-btn-primary mt-6">
          {t('Start Verification', 'بدء التحقق')}
        </button>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ user, onLogout }) => {
  const { t, toggleLanguage, isArabic } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-gray-900">
        {t('Profile', 'الملف الشخصي')}
      </h2>

      {/* Profile Info */}
      <div className="nubix-card text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{user?.fullName}</h3>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      {/* Profile Options */}
      <div className="nubix-card space-y-1">
        <ProfileOption
          icon={User}
          title={t('Account Settings', 'إعدادات الحساب')}
          onClick={() => {}}
        />
        <ProfileOption
          icon={Bell}
          title={t('Notifications', 'الإشعارات')}
          onClick={() => {}}
        />
        <ProfileOption
          icon={CreditCard}
          title={t('Transaction History', 'تاريخ المعاملات')}
          onClick={() => {}}
        />
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between py-3 hover:bg-gray-50 nubix-transition"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🌐</span>
            </div>
            <span className="text-gray-900">{t('Language', 'اللغة')}</span>
          </div>
          <span className="text-gray-600">{isArabic ? 'العربية' : 'English'}</span>
        </button>
      </div>

      {/* Sign Out */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center py-3 px-4 border-2 border-error text-error rounded-xl hover:bg-red-50 nubix-transition"
      >
        <LogOut className="w-5 h-5 mr-2" />
        {t('Sign Out', 'تسجيل الخروج')}
      </button>
    </div>
  );
};

const ProfileOption = ({ icon: Icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center py-3 hover:bg-gray-50 nubix-transition"
  >
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <span className="text-gray-900">{title}</span>
  </button>
);

// Transactions Tab Component
const TransactionsTab = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CreditCard className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {t('No Transactions', 'لا توجد معاملات')}
      </h3>
      <p className="text-gray-600">
        {t('Your transactions will appear here', 'ستظهر معاملاتك هنا')}
      </p>
    </div>
  );
};

export default HomeScreen;