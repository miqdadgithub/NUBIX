import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { 
  Wallet, 
  Plus, 
  User, 
  LogOut, 
  Bell,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  History
} from 'lucide-react';
import NubixLogo from '../NubixLogo';
import cryptoService from '../../services/cryptoService';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with improved spacing */}
      <header className="bg-white shadow-nubix border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <NubixLogo size="md" showText={true} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => fetchCryptoPrices(true)}
                className="p-3 text-gray-600 hover:text-primary-600 nubix-transition rounded-lg hover:bg-gray-50"
                disabled={refreshing}
              >
                <RotateCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-3 text-gray-600 hover:text-primary-600 nubix-transition rounded-lg hover:bg-gray-50">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block">
                  <span className="font-semibold text-gray-700">{user?.fullName}</span>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 nubix-transition"
                >
                  <LogOut className="w-5 h-5" />
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
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 py-2"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with better spacing */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        {activeTab === 'home' && <HomeTab user={user} cryptoPrices={cryptoPrices} loading={loading} onBuyClick={handleBuyClick} />}
        {activeTab === 'buy' && <BuyTab cryptoPrices={cryptoPrices} onBack={() => setActiveTab('home')} />}
        {activeTab === 'kyc' && <KYCTab />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
        {activeTab === 'history' && <TransactionsTab />}
      </main>

      {/* Bottom Navigation - Removed Portfolio */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-nubix px-4 py-3 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <NavButton
            icon={Wallet}
            label="Home"
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavButton
            icon={Plus}
            label="Buy"
            isActive={activeTab === 'buy'}
            onClick={() => setActiveTab('buy')}
            isPrimary={true}
          />
          <NavButton
            icon={User}
            label="KYC"
            isActive={activeTab === 'kyc'}
            onClick={() => setActiveTab('kyc')}
          />
          <NavButton
            icon={History}
            label="History"
            isActive={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <NavButton
            icon={User}
            label="Profile"
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </nav>

      {/* Padding for bottom navigation */}
      <div className="h-24"></div>
    </div>
  );
};

// Navigation Button Component
const NavButton = ({ icon: Icon, label, isActive, onClick, isPrimary = false }) => {
  if (isPrimary) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center py-3 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-nubix transform hover:scale-105 nubix-transition"
      >
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-semibold">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center py-3 px-3 rounded-lg nubix-transition ${
        isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600'
      }`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs">{label}</span>
    </button>
  );
};

// Home Tab Component - Removed deposit funds
const HomeTab = ({ user, cryptoPrices, loading, onBuyClick }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Card with better spacing */}
      <div className="nubix-card bg-gradient-to-r from-primary-500 to-secondary-600 text-white p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome, {user?.fullName || 'User'}!
          </h1>
          <p className="text-white text-opacity-90 text-lg">
            Start your cryptocurrency trading journey
          </p>
        </div>
        
        <div className="bg-white bg-opacity-15 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-opacity-80 text-sm font-medium mb-2">
                Total Balance
              </p>
              <h2 className="text-3xl font-bold">{cryptoService.formatSDG(user?.balance || 0)}</h2>
            </div>
            <Wallet className="w-12 h-12 text-white text-opacity-60" />
          </div>
        </div>
      </div>

      {/* Quick Actions - Removed deposit */}
      <div>
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
          Quick Actions
        </h3>
        <div className="max-w-sm">
          <ActionCard
            title="Buy Cryptocurrency"
            subtitle="Purchase crypto with SDG"
            icon={Plus}
            color="bg-gradient-to-r from-success to-green-600"
            onClick={() => onBuyClick()}
          />
        </div>
      </div>

      {/* Market Prices with better spacing */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-semibold text-gray-900">
            Market Prices
          </h3>
          <p className="text-sm text-gray-500">
            Updated every 30 seconds
          </p>
        </div>
        
        {loading ? (
          <div className="nubix-card text-center py-12">
            <div className="nubix-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prices...</p>
          </div>
        ) : (
          <div className="nubix-card p-0 overflow-hidden">
            {cryptoPrices.map((crypto, index) => (
              <CryptoPriceItem 
                key={crypto.symbol} 
                crypto={crypto} 
                onBuyClick={onBuyClick}
                isLast={index === cryptoPrices.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Crypto Price Item Component with better spacing
const CryptoPriceItem = ({ crypto, onBuyClick, isLast }) => {
  const isPositive = crypto.change24h >= 0;
  
  return (
    <div 
      className={`flex items-center justify-between p-6 hover:bg-gray-50 nubix-transition cursor-pointer ${!isLast ? 'border-b border-gray-100' : ''}`}
      onClick={() => onBuyClick(crypto)}
    >
      <div className="flex items-center">
        <div className="w-14 h-14 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mr-4">
          <span className="text-2xl">{crypto.icon}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{crypto.symbol}</h4>
          <p className="text-gray-600">{crypto.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-900 text-lg">{cryptoService.formatUSD(crypto.priceUSD)}</p>
        <p className="text-sm text-gray-600">{cryptoService.formatSDG(crypto.priceSDG)}</p>
        <div className={`flex items-center justify-end text-sm mt-1 ${isPositive ? 'text-success' : 'text-error'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(crypto.change24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

// Action Card Component with better design
const ActionCard = ({ title, subtitle, icon: Icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full nubix-card text-left hover:shadow-nubix-lg nubix-transition transform hover:scale-105 p-6"
    >
      <div className="flex items-center">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </div>
    </button>
  );
};

// Buy Tab Component  
const BuyTab = ({ cryptoPrices, onBack }) => {
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-gray-900">
          Buy Cryptocurrency
        </h2>
        <button onClick={onBack} className="nubix-btn-secondary px-6 py-3">
          Back
        </button>
      </div>

      {/* Crypto Selection with better spacing */}
      <div className="nubix-card p-8">
        <h3 className="font-semibold text-gray-900 text-xl mb-6">
          Select Cryptocurrency
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptoPrices.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => setSelectedCrypto(crypto)}
              className={`p-6 border-2 rounded-2xl nubix-transition ${
                selectedCrypto?.symbol === crypto.symbol
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{crypto.icon}</span>
                <div className="text-left">
                  <p className="font-semibold text-lg">{crypto.symbol}</p>
                  <p className="text-sm text-gray-600">{cryptoService.formatUSD(crypto.priceUSD)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input with better spacing */}
      {selectedCrypto && (
        <div className="nubix-card p-8">
          <h3 className="font-semibold text-gray-900 text-xl mb-6">
            Enter Amount
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amount in {selectedCrypto.symbol}
              </label>
              <input
                type="number"
                step="0.00000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="nubix-input text-lg py-4"
                placeholder={`0.0 ${selectedCrypto.symbol}`}
              />
            </div>

            {calculation && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Price per {selectedCrypto.symbol}:</span>
                  <span className="font-semibold">{cryptoService.formatSDG(selectedCrypto.priceSDG)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{cryptoService.formatSDG(calculation.totalSDG)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee (0.75%):</span>
                  <span>{cryptoService.formatSDG(calculation.fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>{cryptoService.formatSDG(calculation.processingFee)}</span>
                </div>
                <hr className="my-3 border-gray-300" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{cryptoService.formatSDG(calculation.finalAmount)}</span>
                </div>
              </div>
            )}

            <button 
              className="w-full nubix-btn-primary text-xl py-5"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// KYC Tab Component
const KYCTab = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-display font-bold text-gray-900">
        KYC Verification
      </h2>

      <div className="nubix-card p-8">
        <h3 className="font-semibold text-gray-900 text-xl mb-6">
          Verification Status
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-800 font-semibold text-lg">
            Verification Required
          </p>
          <p className="text-yellow-700 mt-2">
            Complete your KYC verification to start trading cryptocurrencies
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b">
            <span className="text-lg">Identity Document</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between py-4 border-b">
            <span className="text-lg">Address Proof</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-lg">Selfie Verification</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
              Pending
            </span>
          </div>
        </div>

        <button className="w-full nubix-btn-primary mt-8 py-4 text-lg">
          Start Verification
        </button>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ user, onLogout }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-display font-bold text-gray-900">
        Profile
      </h2>

      {/* Profile Info with better spacing */}
      <div className="nubix-card text-center p-8">
        <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{user?.fullName}</h3>
        <p className="text-gray-600 text-lg">{user?.email}</p>
      </div>

      {/* Profile Options */}
      <div className="nubix-card p-8 space-y-1">
        <ProfileOption
          icon={User}
          title="Account Settings"
          onClick={() => {}}
        />
        <ProfileOption
          icon={Bell}
          title="Notifications"
          onClick={() => {}}
        />
        <ProfileOption
          icon={History}
          title="Transaction History"
          onClick={() => {}}
        />
      </div>

      {/* Sign Out */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center py-4 px-6 border-2 border-error text-error rounded-xl hover:bg-red-50 nubix-transition text-lg"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Sign Out
      </button>
    </div>
  );
};

const ProfileOption = ({ icon: Icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center py-4 hover:bg-gray-50 nubix-transition rounded-lg"
  >
    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <span className="text-gray-900 text-lg">{title}</span>
  </button>
);

// Transactions Tab Component
const TransactionsTab = () => {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <History className="w-12 h-12 text-primary-600" />
      </div>
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
        No Transactions
      </h3>
      <p className="text-gray-600 text-lg">
        Your transaction history will appear here
      </p>
    </div>
  );
};

export default HomeScreen;