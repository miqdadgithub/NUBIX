import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import BottomNav from '../nav/BottomNav';
import cryptoService from '../../services/cryptoService';
import Sparkline from '../charts/Sparkline';

const Dashboard = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await cryptoService.getLatestPrices(['BTC','ETH','BNB','ADA','XRP']);
        if (mounted) setPrices(list);
      } finally { if (mounted) setLoading(false); }
    };
    load();
    const id = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF2E6' }}>
      <Header />
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-6 pb-28 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {prices.map((p) => (
            <div key={p.symbol} className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-secondary-900">{p.symbol}</div>
                <div className={`text-xs ${p.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{p.change24h.toFixed(2)}%</div>
              </div>
              <div className="text-secondary-700 text-sm">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.priceUSD)}</div>
              <div className="mt-1"><Sparkline data={p.spark || []} stroke={p.change24h >= 0 ? '#16a34a' : '#dc2626'} /></div>
            </div>
          ))}
        </div>

        <div className="nubix-card">
          <div className="font-semibold mb-2">Top Movers</div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prices
                .slice()
                .sort((a,b) => Math.abs(b.change24h) - Math.abs(a.change24h))
                .slice(0,6)
                .map((m) => (
                  <div key={m.symbol} className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-secondary-900">{m.name}</div>
                      <div className={`text-sm ${m.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{m.change24h.toFixed(2)}%</div>
                    </div>
                    <div className="text-secondary-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(m.priceUSD)}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;