import React, { useEffect, useMemo, useState } from 'react';
import Header from '../layout/Header';
import BottomNav from '../nav/BottomNav';
import { marketsApi, ordersApi } from '../../services/api';

const currencyUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const currencySDG = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SDG', minimumFractionDigits: 0 });

const BuyScreen = () => {
  const [markets, setMarkets] = useState([]);
  const [symbol, setSymbol] = useState('BTC');
  const [amountUSD, setAmountUSD] = useState('50');
  const [quote, setQuote] = useState(null);
  const [step, setStep] = useState(1); // 1 Select, 2 Payment, 3 Review, 4 Status
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await marketsApi.list(20);
      setMarkets(list);
    })();
  }, []);

  const selected = useMemo(() => markets.find(m => m.symbol === symbol), [markets, symbol]);

  const requestQuote = async () => {
    setLoading(true);
    try {
      const q = await ordersApi.quote({ symbol, amountUSD: parseFloat(amountUSD) || 0 });
      setQuote(q);
      setStep(2);
    } finally { setLoading(false); }
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      const o = await ordersApi.create({ quoteId: quote.id, paymentMethod: 'bank_transfer' });
      setOrder(o);
      setStep(3);
    } finally { setLoading(false); }
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      const o = await ordersApi.confirmPayment({ orderId: order.id, reference: order.reference });
      setOrder(o);
      setStep(4);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF2E6' }}>
      <Header />

      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-6 pb-28">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <span className={`px-2 py-1 rounded-lg ${step >= 1 ? 'bg-primary-50 text-secondary-900' : 'bg-gray-100'}`}>Select</span>
            <span>→</span>
            <span className={`px-2 py-1 rounded-lg ${step >= 2 ? 'bg-primary-50 text-secondary-900' : 'bg-gray-100'}`}>Payment</span>
            <span>→</span>
            <span className={`px-2 py-1 rounded-lg ${step >= 3 ? 'bg-primary-50 text-secondary-900' : 'bg-gray-100'}`}>Review</span>
            <span>→</span>
            <span className={`px-2 py-1 rounded-lg ${step >= 4 ? 'bg-primary-50 text-secondary-900' : 'bg-gray-100'}`}>Status</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="nubix-card">
              <label className="block text-sm font-semibold text-secondary-700 mb-2">Select Coin</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {markets.map((m) => (
                  <button
                    key={m.symbol}
                    onClick={() => setSymbol(m.symbol)}
                    className={`px-4 py-3 rounded-xl border-2 ${symbol === m.symbol ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'}`}
                    data-testid={`buy-select-${m.symbol}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      <span className="font-semibold">{m.symbol}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="nubix-card">
              <label className="block text-sm font-semibold text-secondary-700 mb-2">Amount (USD)</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['25','50','100','250'].map(p => (
                  <button key={p} onClick={() => setAmountUSD(p)} className={`px-3 py-2 rounded-lg border ${amountUSD === p ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'}`}>${p}</button>
                ))}
              </div>
              <input value={amountUSD} onChange={(e) => setAmountUSD(e.target.value)} type="number" className="nubix-input" placeholder="Enter amount in USD" data-testid="buy-amount-usd" />
            </div>

            <button onClick={requestQuote} disabled={loading || !amountUSD} className="w-full nubix-btn-primary py-4" data-testid="buy-request-quote">
              {loading ? 'Loading...' : 'Get Quote'}
            </button>
          </div>
        )}

        {step === 2 && quote && (
          <div className="space-y-6">
            <div className="nubix-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary-600">Quote for</div>
                  <div className="text-xl font-semibold">{symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-secondary-900 font-semibold">{currencyUSD.format(quote.amountUSD)}</div>
                  <div className="text-secondary-600 text-sm">≈ {currencySDG.format(quote.amountUSD * 4000)}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><span>Price</span><span>{currencyUSD.format(quote.priceUSD)}</span></div>
                <div className="flex justify-between"><span>Crypto</span><span>{quote.cryptoAmount} {symbol}</span></div>
                <div className="flex justify-between"><span>Fee (0.75%)</span><span>{currencyUSD.format(quote.feeUSD)}</span></div>
                <div className="flex justify-between"><span>Processing Fee</span><span>{currencyUSD.format(quote.processingFeeUSD)}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>{currencyUSD.format(quote.totalUSD)}</span></div>
              </div>
            </div>

            <div className="nubix-card">
              <div className="font-semibold mb-2">Payment Method</div>
              <div className="text-secondary-700">Bank transfer via Bank of Khartoum</div>
            </div>

            <button onClick={createOrder} disabled={loading} className="w-full nubix-btn-primary py-4" data-testid="buy-create-order">
              {loading ? 'Creating...' : 'Continue to Payment'}
            </button>
          </div>
        )}

        {step === 3 && order && (
          <div className="space-y-6">
            <div className="nubix-card">
              <div className="font-semibold mb-2">Transfer Instructions</div>
              <div className="space-y-1 text-secondary-800">
                <div><strong>Bank:</strong> {order.bankInstructions.bank}</div>
                <div><strong>Account Name:</strong> {order.bankInstructions.accountName}</div>
                <div><strong>Account Number:</strong> {order.bankInstructions.accountNumber}</div>
                <div><strong>SWIFT:</strong> {order.bankInstructions.swift}</div>
                <div><strong>Reference:</strong> {order.bankInstructions.reference}</div>
                <div className="text-sm text-secondary-600 mt-2">Please include the reference in your transfer. Once you have paid, confirm below.</div>
              </div>
            </div>

            <button onClick={confirmPayment} disabled={loading} className="w-full nubix-btn-primary py-4" data-testid="buy-confirm-payment">
              {loading ? 'Confirming...' : 'I have paid — Confirm'}
            </button>
          </div>
        )}

        {step === 4 && order && (
          <div className="space-y-6">
            <div className="nubix-card text-center">
              <div className="text-2xl font-semibold mb-2">Order Completed</div>
              <div className="text-secondary-700">Your order has been processed successfully.</div>
              <div className="mt-3 text-sm text-secondary-600">Order ID: {order.id}</div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default BuyScreen;