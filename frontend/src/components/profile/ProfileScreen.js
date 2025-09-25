import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import BottomNav from '../nav/BottomNav';
import axios from 'axios';

const currencySDG = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SDG', minimumFractionDigits: 0 });

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/user/profile');
        setUser(data.user);
      } catch (e) {}
    })();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF2E6' }}>
      <Header />

      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-6 pb-28 space-y-6">
        <div className="nubix-card text-center">
          <div className="text-2xl font-semibold">{user?.fullName || 'Profile'}</div>
          <div className="text-secondary-600">{user?.email}</div>
          <div className="mt-2 text-secondary-700">Balance: {currencySDG.format(user?.balance || 0)}</div>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-sm ${user?.kycStatus === 'approved' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>KYC: {user?.kycStatus || 'not_started'}</span>
          </div>
        </div>

        <div className="nubix-card">
          <div className="font-semibold mb-2">Linked Accounts</div>
          <div className="text-secondary-700">Bank of Khartoum — add during payment</div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileScreen;