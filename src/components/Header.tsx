import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuthContext } from './AuthProvider';

const Header = () => {
  const { signOut } = useAuthContext();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-horizon-100 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-10 ml-0 md:ml-16">
      <div className="flex items-center gap-4 flex-1"></div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-horizon-50 rounded-full">
          <Bell className="w-5 h-5 text-horizon-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
              alt="プロフィール"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-horizon-100"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium">山田 太郎</p>
              <p className="text-xs text-gray-500">制作部長</p>
            </div>
            <button
              onClick={() => signOut()}
              className="ml-4 text-sm text-gray-600 hover:text-gray-900"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;