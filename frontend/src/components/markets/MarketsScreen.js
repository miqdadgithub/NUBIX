import React, { useEffect, useMemo, useState } from 'react';
import Header from '../layout/Header';
import BottomNav from '../nav/BottomNav';
import { marketsApi } from '../../services/api';
import Sparkline from '../charts/Sparkline';
import { useNavigate } from 'react-router-dom';

const MarketsScreen = () => {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await marketsApi.list(30);
        if (mounted) setAll(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => all.filter(c => (c.symbol + ' ' + c.name).toLowerCase().includes(q.toLowerCase())), [all, q]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF2E6' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-6 pb-28">
        <div className="nubix-card mb-4 p-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search coins (e.g., BTC, ETH)"
            className="w-full nubix-input"
            data-testid="markets-search"
          />
        </div>

        {loading ? (
          <div className="nubix-card text-center py-10">Loading markets...</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filtered.map((c, idx) => (
              <button
                key={c.symbol}
                onClick={() => navigate(`/markets/${c.symbol}`)}
                className={`w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-100 ${idx < filtered.length - 1 ? 'border-b border-gray-200' : ''}`}
                data-testid={`market-row-${c.symbol}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                    <span className="text-xl">{c.icon}</span>
                  </div>
                  <div>
                    <div className="text-secondary-900 font-semibold">{c.symbol}</div>
                    <div className="text-secondary-600 text-sm">{c.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-secondary-900 font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(c.priceUSD)}</div>
                  <div className={`text-sm ${c.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{c.change24h.toFixed(2)}%</div>
                </div>
                <div className="hidden sm:block">
                  <Sparkline data={c.spark} stroke={c.change24h >= 0 ? '#16a34a' : '#dc2626'} />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MarketsScreen;