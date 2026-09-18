import React, { useState } from 'react';
import { UserPlus, User as UserIcon, Mail, Lock, Shield, Trash2 } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  setUsers,
  currentUser
}) => {
  const { themeConfig } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role
    };

    setUsers([...users, newUser]);
    setShowAddForm(false);
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri saat sedang login.');
      return;
    }
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola akses admin dan user untuk aplikasi ini.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 ${themeConfig.primaryBg} rounded-lg font-medium transition-colors shadow-sm ${themeConfig.shadowClass} cursor-pointer text-sm`}
        >
          <UserPlus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="p-8">
        {/* Add User Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddUser}
            className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="text-lg font-bold text-slate-800">Tambah Pengguna Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 ${themeConfig.focusRing} outline-none text-sm bg-white`}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 ${themeConfig.focusRing} outline-none text-sm bg-white`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 ${themeConfig.focusRing} outline-none text-sm bg-white`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Role / Peran</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-3 text-slate-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 ${themeConfig.focusRing} outline-none text-sm bg-white`}
                  >
                    <option value="user">User Biasa</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-lg text-sm font-bold ${themeConfig.primaryBg} shadow-sm cursor-pointer`}
              >
                Simpan User
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">Pengguna</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                              Anda
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? themeConfig.badgeBg
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === currentUser.id}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        u.id === currentUser.id
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title={u.id === currentUser.id ? 'Tidak bisa menghapus diri sendiri' : 'Hapus'}
                    >
                      <Trash2 size={16} />
                    </button>
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
