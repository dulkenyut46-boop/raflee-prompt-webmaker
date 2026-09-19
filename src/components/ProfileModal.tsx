import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Shield,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser
}) => {
  const { themeConfig } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState(user.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setStatusMessage({ type: 'error', text: 'Nama tidak boleh kosong.' });
      return;
    }
    if (!cleanEmail) {
      setStatusMessage({ type: 'error', text: 'Email tidak boleh kosong.' });
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setStatusMessage({ type: 'error', text: 'Password minimal 4 karakter.' });
      return;
    }

    const updated: User = {
      ...user,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPassword
    };

    onUpdateUser(updated);
    setStatusMessage({
      type: 'success',
      text: 'Akun dan password berhasil diperbarui!'
    });

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${themeConfig.badgeBg} flex items-center justify-center ${themeConfig.primaryText}`}>
                {user.role === 'admin' ? <ShieldCheck size={20} /> : <UserCheck size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Edit Akun & Password</h3>
                <p className="text-xs text-slate-500">Perbarui identitas profil dan kata sandi Anda</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Status notification */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Hak Akses Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Status Hak Akses
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  }`}
                >
                  {user.role === 'admin' ? 'Administrator' : 'Pengguna Biasa'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mt-2">
                <p className="font-semibold text-slate-800">
                  {user.role === 'admin' ? 'Izin Hak Akses Administrator:' : 'Izin Hak Akses Pengguna Biasa:'}
                </p>
                <div className="grid grid-cols-1 gap-1 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={13} />
                    <span>Membuat & Merancang Prompt Web App</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={13} />
                    <span>Menguji Proyek dengan 50-Item Checklist</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={13} />
                    <span>Mengubah Profil & Password Pribadi</span>
                  </div>
                  {user.role === 'admin' ? (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={13} />
                      <span>Kelola Semua Akun, Role & Pengguna Sistem</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="w-3.5 text-center text-xs font-bold text-slate-400">✕</span>
                      <span>Manajemen Akun Pengguna Lain (Hanya Administrator)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none text-sm text-slate-900 font-medium`}
                  />
                </div>
              </div>

              {/* No HP */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Nomor HP / WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none text-sm text-slate-900 font-medium`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none text-sm text-slate-900 font-medium`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-700">Password / Kata Sandi</label>
                  <span className="text-[10px] text-slate-400">Dapat diedit kapan saja</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password baru"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl ${themeConfig.focusRing} outline-none text-sm text-slate-900 font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold ${themeConfig.primaryBg} shadow-md ${themeConfig.shadowClass} flex items-center gap-2 cursor-pointer transition-all`}
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
