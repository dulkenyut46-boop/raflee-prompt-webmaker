import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface LoginModalProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ users, onLogin }) => {
  const { themeConfig } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (matched) {
      setError('');
      onLogin(matched);
    } else {
      setError('Email atau password salah. Silakan coba kembali.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'user') => {
    const target = users.find((u) => u.role === role) || users[0];
    if (target) {
      onLogin(target);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decorative Blur Blobs */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${themeConfig.blobBg} rounded-full blur-[120px] pointer-events-none transition-colors duration-500`} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Header / Brand */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className={`w-16 h-16 ${themeConfig.primaryBg} rounded-2xl flex items-center justify-center shadow-lg ${themeConfig.shadowClass} mb-4 transition-colors duration-300`}>
                <Sparkles className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Raflee Prompt Maker</h1>
              <p className="text-sm text-slate-500 mt-1">Masuk untuk mulai membuat prompt web app</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-lg font-medium"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Gunakan akun demo: admin@prdgen.com (password: admin) atau user@prdgen.com (password: user)')}
                    className={`text-xs font-medium ${themeConfig.primaryText} hover:underline`}
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 px-6 ${themeConfig.primaryBg} font-bold rounded-xl shadow-lg ${themeConfig.shadowClass} transition-all flex items-center justify-center gap-2 group cursor-pointer`}
              >
                <span>Masuk Sekarang</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Demo Login Helpers */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Atau Masuk Cepat (Akun Demo)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 ${themeConfig.lightBgHover} border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer`}
                >
                  <ShieldCheck size={16} className={themeConfig.primaryText} />
                  <span>Admin Utama</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 ${themeConfig.lightBgHover} border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer`}
                >
                  <UserCheck size={16} className="text-slate-500" />
                  <span>User Biasa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
