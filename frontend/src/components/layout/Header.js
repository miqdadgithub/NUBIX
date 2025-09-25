import React, { useState } from 'react';
import NubixLogo from '../NubixLogo';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <NubixLogo size="md" showText={true} />
        <div className="flex items-center gap-3">
          <button className="p-2 text-secondary-600 hover:text-primary-600" aria-label="Notifications" data-testid="header-notifications">
            <Bell className="w-5 h-5" />
          </button>
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100" data-testid="header-profile-menu">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-600" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-nubix z-10" onMouseLeave={() => setOpen(false)}>
                <button onClick={() => { setOpen(false); navigate('/profile'); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" data-testid="menu-profile">Profile</button>
                <button onClick={() => { setOpen(false); navigate('/kyc'); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" data-testid="menu-kyc">KYC & Regulation</button>
                <hr />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-error hover:bg-red-50 flex items-center gap-2" data-testid="menu-signout">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;