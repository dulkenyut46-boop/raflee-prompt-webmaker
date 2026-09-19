import React, { useState } from 'react';
import {
  UserPlus,
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Trash2,
  Edit2,
  Phone,
  CheckCircle2,
  X,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  setUsers,
  currentUser
}) => {
  const { themeConfig } = useTheme();

  // New user form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  // Edit user state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');

  // Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // If the user is not admin, show permission notice
  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto p-8 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Hak Akses Pengguna Biasa
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
          Halaman Manajemen Pengguna dan Pengaturan Sistem khusus untuk akun <span className="font-semibold text-slate-800">Administrator</span>.
        </p>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-md mx-auto mb-6 space-y-2 text-xs">
          <p className="font-bold text-slate-700">Hak Akses yang Anda Miliki Saat Ini:</p>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={14} />
              <span>Membuat prompt web app lengkap dengan PRD Generator</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={14} />
              <span>Mengakses checklist 50-item evaluasi proyek</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={14} />
              <span>Menyalin, ekspor, dan mengunduh hasil prompt</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={14} />
              <span>Mengubah nama profil, nomor HP, email, dan password Anda sendiri</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim(),
      role,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setShowAddForm(false);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('user');
    showToast(`Pengguna "${newUser.name}" berhasil ditambahkan.`);
  };

  const handleStartEdit = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || '');
    setEditPassword(u.password || '');
    setEditRole(u.role);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim() || !editEmail.trim() || !editPassword.trim()) return;

    const updatedUsers = users.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editName.trim(),
          email: editEmail.trim().toLowerCase(),
          phone: editPhone.trim(),
          password: editPassword.trim(),
          role: editRole
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setEditingUser(null);
    showToast(`Data akun "${editName}" berhasil diperbarui.`);
  };

  const handleDeleteUser = (id: string, userName: string) => {
    if (id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri saat sedang login.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus akun "${userName}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`Akun "${userName}" telah dihapus.`);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Manajemen Akun & Hak Akses</h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data akun, edit kata sandi standar, dan atur hak akses peran sistem.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingUser(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 ${themeConfig.primaryBg} rounded-xl font-bold transition-all shadow-sm ${themeConfig.shadowClass} cursor-pointer text-xs`}
        >
          <UserPlus size={16} />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Info Box: Hak Akses Pengguna Biasa vs Administrator */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-indigo-700 font-bold mb-1.5">
              <UserCheck size={16} />
              <span>Hak Akses Pengguna Biasa</span>
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Membuat prompt & PRD web app tanpa batas</li>
              <li>• Mengakses 50 item checklist evaluasi</li>
              <li>• Menyalin & mengunduh prompt ke file markdown</li>
              <li>• Mengedit profil dan password pribadi mereka</li>
              <li className="text-slate-400">• Dibatasi dari manajemen pengguna sistem</li>
            </ul>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-amber-700 font-bold mb-1.5">
              <ShieldCheck size={16} />
              <span>Hak Akses Administrator</span>
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Memiliki semua akses Pengguna Biasa</li>
              <li>• Mengedit nama, email, phone & password akun manapun</li>
              <li>• Mengubah peran user menjadi admin atau sebaliknya</li>
              <li>• Menambah dan menghapus akun pengguna sistem</li>
              <li>• Mengatur tema tampilan dan konfigurasi global</li>
            </ul>
          </div>
        </div>

        {/* Form Tambah Pengguna Baru */}
        {showAddForm && (
          <form
            onSubmit={handleAddUser}
            className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserPlus size={16} className={themeConfig.primaryText} />
                <span>Tambah Pengguna Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 ${themeConfig.focusRing} outline-none text-xs bg-white`}
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 ${themeConfig.focusRing} outline-none text-xs bg-white`}
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 ${themeConfig.focusRing} outline-none text-xs bg-white`}
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 ${themeConfig.focusRing} outline-none text-xs bg-white`}
                    placeholder="Password akun"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Peran Akses</label>
                <div className="relative">
                  <Shield size={14} className="absolute left-3 top-3 text-slate-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 ${themeConfig.focusRing} outline-none text-xs bg-white`}
                  >
                    <option value="user">Pengguna Biasa (Akses Generator & Checklist)</option>
                    <option value="admin">Administrator (Akses Penuh Kelola Sistem)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-bold ${themeConfig.primaryBg} shadow-sm cursor-pointer`}
              >
                Simpan Akun
              </button>
            </div>
          </form>
        )}

        {/* Modal / Form Edit Pengguna Terpilih */}
        {editingUser && (
          <form
            onSubmit={handleSaveEdit}
            className="bg-amber-50/70 p-6 rounded-2xl border-2 border-amber-300 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 size={16} className="text-amber-700" />
                <h3 className="text-sm font-bold text-slate-800">
                  Edit Akun & Password: <span className="text-amber-800">{editingUser.name}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (Kata Sandi)
                </label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-white font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Peran / Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'admin' | 'user')}
                  disabled={editingUser.id === currentUser.id}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs bg-white font-medium disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="user">Pengguna Biasa</option>
                  <option value="admin">Administrator</option>
                </select>
                {editingUser.id === currentUser.id && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    * Anda tidak dapat mengubah peran akun Anda sendiri saat sedang login.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm cursor-pointer transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-3">Pengguna</th>
                <th className="pb-3 px-3">Password</th>
                <th className="pb-3 px-3">Role / Hak Akses</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="truncate">{u.name}</span>
                          {u.id === currentUser.id && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-md font-bold">
                              Akun Anda
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                        {u.phone && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            📱 {u.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                      <KeyRound size={12} className="text-slate-400" />
                      <span>{u.password || '••••••'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {u.role === 'admin' ? (
                        <>
                          <ShieldCheck size={12} />
                          <span>Administrator</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={12} />
                          <span>Pengguna Biasa</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleStartEdit(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit Akun & Password"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        disabled={u.id === currentUser.id}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          u.id === currentUser.id
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                        }`}
                        title={u.id === currentUser.id ? 'Tidak bisa menghapus akun yang sedang aktif' : 'Hapus Akun'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
