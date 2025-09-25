import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import BottomNav from '../nav/BottomNav';
import { inboxApi } from '../../services/api';

const InboxScreen = () => {
  const [threads, setThreads] = useState([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payment');
  const [text, setText] = useState('');
  const [active, setActive] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const list = await inboxApi.threads().catch(() => []);
    setThreads(list);
  };

  const create = async () => {
    const th = await inboxApi.createThread({ subject, category });
    setSubject('');
    setThreads([th, ...threads]);
    setActive(th);
  };

  const send = async () => {
    if (!active) return;
    const msg = await inboxApi.postMessage({ threadId: active.id, text });
    setActive({ ...active, messages: [...active.messages, msg] });
    setText('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF2E6' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-6 pb-28 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 md:col-span-1">
          <div className="nubix-card">
            <div className="font-semibold mb-2">New support request</div>
            <input className="nubix-input mb-2" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <select className="nubix-input mb-2" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Payment</option>
              <option>KYC</option>
              <option>Order</option>
            </select>
            <button className="w-full nubix-btn-primary" onClick={create} disabled={!subject}>Create</button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            {threads.map((t, i) => (
              <button key={t.id} onClick={() => setActive(t)} className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${i < threads.length - 1 ? 'border-b border-gray-200' : ''}`}> 
                <div className="font-semibold text-secondary-900">{t.subject}</div>
                <div className="text-sm text-secondary-600">{t.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {active ? (
            <div className="nubix-card">
              <div className="font-semibold mb-2">{active.subject}</div>
              <div className="space-y-3 max-h-80 overflow-auto">
                {active.messages.map(m => (
                  <div key={m.id} className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-secondary-600">{m.from}</div>
                    <div>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input className="flex-1 nubix-input" placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} />
                <button className="nubix-btn-primary px-4" onClick={send} disabled={!text}>Send</button>
              </div>
            </div>
          ) : (
            <div className="nubix-card text-secondary-600">Select a thread or create a new one.</div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default InboxScreen;