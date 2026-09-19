import React from 'react';
import { Sparkles, CheckSquare, User as UserIcon, Settings, LogOut, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  user: User;
  activeTab: 'generator' | 'checklist' | 'settings';
  setActiveTab: (tab: 'generator' | 'checklist' | 'settings') => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenProfile
}) => {
  const { themeConfig } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
        {/* Brand Logo & Title */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => setActiveTab('generator')}
        >
          <div className={`w-10 h-10 ${themeConfig.primaryBg} rounded-xl flex items-center justify-center shadow-lg ${themeConfig.shadowClass} transition-all duration-300 group-hover:scale-105`}>
            <Sparkles className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
              Raflee Prompt Maker
            </h1>
            <p className={`text-[10px] font-bold ${themeConfig.primaryText} uppercase tracking-widest mt-1`}>
              Membuat web app semudah bikin kopi
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Color Theme Switcher */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'checklist' ? 'generator' : 'checklist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? `${themeConfig.primaryBg} shadow-lg ${themeConfig.shadowClass}`
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckSquare size={16} />
            <span className="hidden sm:inline">Checklist</span>
          </button>

          {/* User profile & actions pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            {/* Clickable Profile & Role Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
              title="Klik untuk Edit Profil & Password"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {user.role === 'admin' ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 max-w-[90px] sm:max-w-[130px] truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 leading-none">
                  {user.role === 'admin' ? 'Admin' : 'Pengguna Biasa'}
                </span>
              </div>
            </button>

            {/* Tombol Edit Profil / Sandi */}
            <button
              onClick={onOpenProfile}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Edit Akun & Password"
            >
              <KeyRound size={15} />
            </button>

            {/* Tombol Admin Manajemen User */}
            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab(activeTab === 'settings' ? 'generator' : 'settings')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? `${themeConfig.primaryText} ${themeConfig.lightBg}`
                    : `text-slate-400 hover:${themeConfig.primaryText}`
                }`}
                title="Kelola Semua Pengguna"
              >
                <Settings size={15} />
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Keluar (Logout)"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
