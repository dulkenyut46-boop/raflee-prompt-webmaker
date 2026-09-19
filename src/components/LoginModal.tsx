import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Phone,
  User as UserIcon,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface LoginModalProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
}

type AuthMode = 'login' | 'register';
type LoginMethod = 'password' | 'code';

export const LoginModal: React.FC<LoginModalProps> = ({ users, onLogin, onRegister }) => {
  const { themeConfig } = useTheme();

  // Active Tab: Login vs Register
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');

  // Registration Form States (Simple: Nama, No HP, Email)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Code Verification State (Used for registration or code login)
  const [verifyingUser, setVerifyingUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    isNew: boolean;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeNotification, setCodeNotification] = useState<{
    code: string;
    email: string;
    timestamp: Date;
  } | null>(null);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Countdown for resend code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Generate 6-digit random verification code
  const createSixDigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Trigger simulated email code notification
  const sendLoginCodeToEmail = (targetEmail: string, userName: string, isNewAccount: boolean, targetPhone?: string) => {
    const code = createSixDigitCode();
    setGeneratedCode(code);
    setVerificationCode('');
    setError('');
    setVerifyingUser({
      name: userName,
      email: targetEmail,
      phone: targetPhone,
      isNew: isNewAccount
    });
    setCodeNotification({
      code,
      email: targetEmail,
      timestamp: new Date()
    });
    setResendCooldown(30);
  };

  // Submit Password-based Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = loginEmail.trim().toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === loginPassword
    );

    if (matched) {
      onLogin(matched);
    } else {
      setError('Email atau password salah. Silakan periksa kembali.');
    }
  };

  // Request Code for Login
  const handleRequestLoginCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Masukkan email Anda untuk menerima kode login.');
      return;
    }

    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      setError('Email belum terdaftar. Silakan pilih tab "Registrasi" untuk mendaftar.');
      return;
    }

    sendLoginCodeToEmail(matched.email, matched.name, false, matched.phone);
  };

  // Submit Simple Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regName.trim();
    const cleanPhone = regPhone.trim();

    if (!cleanName) {
      setError('Mohon isi nama lengkap Anda.');
      return;
    }

    if (!cleanPhone) {
      setError('Mohon isi nomor HP aktif Anda.');
      return;
    }

    if (!cleanEmail) {
      setError('Mohon isi alamat email untuk pengiriman notifikasi kode login.');
      return;
    }

    // Check if email already registered
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setError('Email sudah terdaftar. Silakan masuk melalui tab Login.');
      return;
    }

    // Immediately send login code to user's email
    sendLoginCodeToEmail(cleanEmail, cleanName, true, cleanPhone);
  };

  // Verify Code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode.trim() !== generatedCode) {
      setError('Kode verifikasi yang Anda masukkan salah. Silakan coba lagi.');
      return;
    }

    if (!verifyingUser) return;

    if (verifyingUser.isNew) {
      // Create new user account
      const newUser: User = {
        id: Date.now().toString(),
        name: verifyingUser.name,
        email: verifyingUser.email,
        phone: verifyingUser.phone,
        password: 'user123',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      onRegister(newUser);
    } else {
      // Existing user logging in with code
      const matched = users.find(
        (u) => u.email.toLowerCase() === verifyingUser.email.toLowerCase()
      );
      if (matched) {
        onLogin(matched);
      }
    }
  };

  // Quick autofill of received code
  const handleAutofillCode = () => {
    if (generatedCode) {
      setVerificationCode(generatedCode);
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decorative Blur Blobs */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${themeConfig.blobBg} rounded-full blur-[120px] pointer-events-none transition-colors duration-500`}
      />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Simulated Email Notification Toast Banner */}
        <AnimatePresence>
          {codeNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-4 bg-white/95 backdrop-blur-md border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl shadow-emerald-500/10 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Notifikasi Email Masuk
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Baru saja</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Kode login Anda untuk <span className="font-semibold text-slate-800">{codeNotification.email}</span> adalah:
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-xl font-black tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {codeNotification.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleAutofillCode}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-emerald-200"
                  >
                    Salin & Pasang Kode
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-10">
            {/* Header Brand */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div
                className={`w-14 h-14 ${themeConfig.primaryBg} rounded-2xl flex items-center justify-center shadow-lg ${themeConfig.shadowClass} mb-3 transition-colors duration-300`}
              >
                <Sparkles className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Raflee Prompt Maker
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Akses sistem generator prompt web app modern
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-5 bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* If currently in Verification Step */}
            {verifyingUser ? (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center mx-auto mb-2 text-slate-700">
                    <KeyRound size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Masukkan 6 Digit Kode Login
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kode login telah dikirimkan ke email{' '}
                    <span className="font-semibold text-slate-800">{verifyingUser.email}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Kode Verifikasi</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 123456"
                    className={`w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 font-bold`}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 px-6 ${themeConfig.primaryBg} font-bold rounded-xl shadow-lg ${themeConfig.shadowClass} transition-all flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <CheckCircle2 size={18} />
                  <span>Verifikasi & Buka Halaman Utama</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyingUser(null);
                      setCodeNotification(null);
                      setError('');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Kembali / Ubah Email
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={() =>
                      sendLoginCodeToEmail(
                        verifyingUser.email,
                        verifyingUser.name,
                        verifyingUser.isNew,
                        verifyingUser.phone
                      )
                    }
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={12} className={resendCooldown > 0 ? 'animate-spin' : ''} />
                    <span>
                      {resendCooldown > 0
                        ? `Kirim ulang (${resendCooldown}s)`
                        : 'Kirim Ulang Kode'}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Switcher Tab: Login vs Registrasi */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      authMode === 'login'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Masuk (Login)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setError('');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      authMode === 'register'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Daftar (Registrasi)</span>
                  </button>
                </div>

                {/* REGISTRATION FORM: Super Simple (Nama, No HP, Email untuk Kode) */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                      <Info size={16} className={`${themeConfig.primaryText} shrink-0 mt-0.5`} />
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Pendaftaran simpel dan instan. Kode verifikasi login akan langsung dikirimkan ke email Anda untuk masuk.
                      </p>
                    </div>

                    {/* 1. Nama */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 ml-1">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                          <UserIcon size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                        />
                      </div>
                    </div>

                    {/* 2. No HP */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 ml-1">
                        Nomor HP / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                          <Phone size={16} />
                        </div>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Contoh: 08123456789"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                        />
                      </div>
                    </div>

                    {/* 3. Email untuk notifikasi kode login */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-700">
                          Email (Notifikasi Kode Login) <span className="text-rose-500">*</span>
                        </label>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="emailanda@gmail.com"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-1">
                        Notifikasi 6 digit kode login akan dikirim ke email ini.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className={`w-full mt-2 py-3.5 px-6 ${themeConfig.primaryBg} font-bold rounded-xl shadow-lg ${themeConfig.shadowClass} transition-all flex items-center justify-center gap-2 group cursor-pointer`}
                    >
                      <span>Daftar & Terima Kode Login</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}

                {/* LOGIN FORM */}
                {authMode === 'login' && (
                  <div className="space-y-4">
                    {/* Secondary choice: Login via Code vs Password */}
                    <div className="flex items-center justify-end gap-2 text-xs mb-1">
                      <span className="text-slate-400">Metode login:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod(loginMethod === 'code' ? 'password' : 'code');
                          setError('');
                        }}
                        className={`font-bold ${themeConfig.primaryText} hover:underline cursor-pointer`}
                      >
                        {loginMethod === 'code' ? 'Gunakan Password' : 'Gunakan Kode Email'}
                      </button>
                    </div>

                    {loginMethod === 'code' ? (
                      <form onSubmit={handleRequestLoginCode} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 ml-1">
                            Email Terdaftar
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                              <Mail size={16} />
                            </div>
                            <input
                              type="email"
                              required
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="nama@email.com"
                              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 ml-1">
                            Kami akan mengirimkan notifikasi 6-digit kode verifikasi ke email ini.
                          </p>
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-3.5 px-6 ${themeConfig.primaryBg} font-bold rounded-xl shadow-lg ${themeConfig.shadowClass} transition-all flex items-center justify-center gap-2 group cursor-pointer`}
                        >
                          <span>Kirim Kode Login ke Email</span>
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                              <Mail size={16} />
                            </div>
                            <input
                              type="email"
                              required
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="nama@email.com"
                              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-slate-700">Password</label>
                            <button
                              type="button"
                              onClick={() => {
                                setLoginMethod('code');
                                setError('');
                              }}
                              className={`text-xs font-medium ${themeConfig.primaryText} hover:underline cursor-pointer`}
                            >
                              Lupa password? (Pakai Kode Email)
                            </button>
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                              <Lock size={16} />
                            </div>
                            <input
                              type="password"
                              required
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="••••••••"
                              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm`}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-3.5 px-6 ${themeConfig.primaryBg} font-bold rounded-xl shadow-lg ${themeConfig.shadowClass} transition-all flex items-center justify-center gap-2 group cursor-pointer`}
                        >
                          <span>Masuk ke Halaman Utama</span>
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
