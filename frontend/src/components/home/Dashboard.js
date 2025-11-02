import React, { useCallback, useEffect, useState } from 'react';
import Header from '../layout/Header';
import BottomNav from '../nav/BottomNav';
import cryptoService from '../../services/cryptoService';
import Sparkline from '../charts/Sparkline';

const PROJECT_DOCS = [
  'android/app/src/main/flutter/dev/docs/snippets.html',
  'android/app/src/main/flutter/dev/docs/analytics-header.html',
  'android/app/src/main/flutter/dev/docs/opensearch.html',
  'android/app/src/main/flutter/dev/docs/styles.html',
  'android/app/src/main/flutter/dev/docs/survey.html',
  'android/app/src/main/flutter/dev/docs/analytics-footer.html'
];

const Dashboard = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const openProjectDoc = useCallback((docPath) => {
    if (!docPath) return;
    const base = process.env.PUBLIC_URL || '';
    const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
    const url = `${prefix}/${docPath}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

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
          {prices.map((p, index) => {
            const docPath = PROJECT_DOCS[index % PROJECT_DOCS.length];
            return (
              <button
                key={p.symbol}
                type="button"
                onClick={() => openProjectDoc(docPath)}
                className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-primary-300 hover:shadow-nubix transition"
                data-testid={`project-card-${p.symbol.toLowerCase()}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-secondary-900">{p.symbol}</div>
                  <div className={`text-xs ${p.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{p.change24h.toFixed(2)}%</div>
                </div>
                <div className="text-secondary-700 text-sm">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.priceUSD)}</div>
                <div className="mt-1"><Sparkline data={p.spark || []} stroke={p.change24h >= 0 ? '#16a34a' : '#dc2626'} /></div>
              </button>
            );
          })}
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
                .map((m, index) => {
                  const docPath = PROJECT_DOCS[(index + prices.length) % PROJECT_DOCS.length];
                  return (
                    <button
                      key={m.symbol}
                      type="button"
                      onClick={() => openProjectDoc(docPath)}
                      className="border border-gray-200 rounded-xl p-4 bg-white text-left hover:border-primary-300 hover:shadow-nubix transition"
                      data-testid={`project-top-mover-${m.symbol.toLowerCase()}`}
                    >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-secondary-900">{m.name}</div>
                      <div className={`text-sm ${m.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{m.change24h.toFixed(2)}%</div>
                    </div>
                    <div className="text-secondary-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(m.priceUSD)}</div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;