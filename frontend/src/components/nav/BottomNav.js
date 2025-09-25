import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, LineChart, MessageSquare, User } from 'lucide-react';

const Item = ({ to, icon: Icon, label, testid }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex flex-col items-center justify-center flex-1 py-2 ${isActive ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'}`}
    data-testid={testid}
  >
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-[12px] font-medium">{label}</span>
  </NavLink>
);

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 shadow-nubix z-50" data-testid="bottom-nav">
      <div className="max-w-3xl mx-auto flex">
        <Item to="/home" icon={Home} label="Home" testid="nav-home" />
        <Item to="/buy" icon={ShoppingCart} label="Buy" testid="nav-buy" />
        <Item to="/markets" icon={LineChart} label="Markets" testid="nav-markets" />
        <Item to="/inbox" icon={MessageSquare} label="Inbox" testid="nav-inbox" />
        <Item to="/profile" icon={User} label="Profile" testid="nav-profile" />
      </div>
    </nav>
  );
};

export default BottomNav;