import axios from 'axios';

const CRYPTO_API_KEY = 'e50b0216-3b44-41fa-bf7c-536d34eee2e0';
const COINMARKET_API_BASE = 'https://pro-api.coinmarketcap.com/v1';

// Exchange rates - $1 USD = 4,000 SDG (Sudanese Pounds)
const USD_TO_SDG_RATE = 4000;

class CryptoService {
  constructor() {
    this.apiKey = CRYPTO_API_KEY;
  }

  // Get latest cryptocurrency prices
  async getLatestPrices(symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP']) {
    try {
      const response = await axios.get(`${COINMARKET_API_BASE}/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          'Accept': 'application/json',
          'Accept-Encoding': 'deflate, gzip'
        },
        params: {
          symbol: symbols.join(','),
          convert: 'USD'
        }
      });

      const data = response.data.data;
      
      return symbols.map(symbol => {
        const coinData = data[symbol];
        if (coinData) {
          const usdPrice = coinData.quote.USD.price;
          const sdgPrice = usdPrice * USD_TO_SDG_RATE;
          
          return {
            id: coinData.id,
            symbol: coinData.symbol,
            name: coinData.name,
            priceUSD: usdPrice,
            priceSDG: sdgPrice,
            change24h: coinData.quote.USD.percent_change_24h,
            change7d: coinData.quote.USD.percent_change_7d,
            marketCap: coinData.quote.USD.market_cap,
            volume24h: coinData.quote.USD.volume_24h,
            lastUpdated: coinData.last_updated,
            icon: this.getCryptoIcon(symbol)
          };
        }
        return null;
      }).filter(Boolean);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      
      // Fallback to mock data if API fails
      return this.getMockPrices();
    }
  }

  // Get trending cryptocurrencies
  async getTrendingCoins() {
    try {
      const response = await axios.get(`${COINMARKET_API_BASE}/cryptocurrency/trending/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          'Accept': 'application/json'
        }
      });

      return response.data.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        priceUSD: coin.quote.USD.price,
        priceSDG: coin.quote.USD.price * USD_TO_SDG_RATE,
        change24h: coin.quote.USD.percent_change_24h,
        icon: this.getCryptoIcon(coin.symbol)
      }));
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

  // Format currency for display
  formatSDG(amount) {
    return new Intl.NumberFormat('ar-SD', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
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

export default new CryptoService();