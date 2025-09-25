import axios from 'axios';

// Exchange rates - $1 USD = 4,000 SDG (Sudanese Pounds)
const USD_TO_SDG_RATE = 4000;

class CryptoService {
  // Get latest cryptocurrency prices - Using backend API to avoid CORS
  async getLatestPrices(symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP']) {
    try {
      const response = await axios.get('/api/crypto/prices');
      return response.data.prices;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return this.getMockPrices();
    }
  }

  async getTrendingCoins() {
    try {
      const response = await axios.get('/api/crypto/trending');
      return response.data.trending || [];
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
    }
  }

  // Convert USD to SDG
  convertUSDToSDG(usdAmount) {
    return usdAmount * USD_TO_SDG_RATE;
  }

  // Convert SDG to USD
  convertSDGToUSD(sdgAmount) {
    return sdgAmount / USD_TO_SDG_RATE;
  }

  // Format currency for display (English numerals, SDG code)
  formatSDG(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatUSD(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(amount);
  }

  // Get crypto icon
  getCryptoIcon(symbol) {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      BNB: '⬡',
      ADA: '₳',
      XRP: 'X',
      LTC: 'Ł',
      DOT: '●',
      LINK: '🔗',
      BCH: '₿',
      XLM: '🌟'
    };
    return icons[symbol] || '●';
  }

  // Mock data fallback for development
  getMockPrices() {
    const mockData = [
      {
        id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        priceUSD: 67542.30,
        priceSDG: 67542.30 * USD_TO_SDG_RATE,
        change24h: 2.45,
        change7d: 5.12,
        marketCap: 1320000000000,
        volume24h: 28500000000,
        icon: '₿'
      },
      {
        id: 1027,
        symbol: 'ETH',
        name: 'Ethereum',
        priceUSD: 3842.15,
        priceSDG: 3842.15 * USD_TO_SDG_RATE,
        change24h: -1.23,
        change7d: 3.45,
        marketCap: 462000000000,
        volume24h: 15200000000,
        icon: 'Ξ'
      },
      {
        id: 1839,
        symbol: 'BNB',
        name: 'Binance Coin',
        priceUSD: 596.78,
        priceSDG: 596.78 * USD_TO_SDG_RATE,
        change24h: 0.89,
        change7d: 2.1,
        marketCap: 86500000000,
        volume24h: 1800000000,
        icon: '⬡'
      },
      {
        id: 2010,
        symbol: 'ADA',
        name: 'Cardano',
        priceUSD: 0.4521,
        priceSDG: 0.4521 * USD_TO_SDG_RATE,
        change24h: 3.12,
        change7d: 1.85,
        marketCap: 15800000000,
        volume24h: 850000000,
        icon: '₳'
      },
      {
        id: 52,
        symbol: 'XRP',
        name: 'XRP',
        priceUSD: 0.6234,
        priceSDG: 0.6234 * USD_TO_SDG_RATE,
        change24h: 1.76,
        change7d: -0.43,
        marketCap: 35200000000,
        volume24h: 1200000000,
        icon: 'X'
      }
    ].map(coin => ({
      ...coin,
      lastUpdated: new Date().toISOString()
    }));

    return mockData;
  }

  // Calculate purchase amount
  calculatePurchase(cryptoAmount, priceUSD) {
    const totalUSD = cryptoAmount * priceUSD;
    const totalSDG = totalUSD * USD_TO_SDG_RATE;
    const fee = totalSDG * 0.0075; // 0.75% fee
    const processingFee = 50; // SDG 50 processing fee
    return {
      cryptoAmount,
      priceUSD,
      totalUSD,
      totalSDG,
      fee,
      processingFee,
      finalAmount: totalSDG + fee + processingFee
    };
  }
}

const cryptoService = new CryptoService();
export default cryptoService;