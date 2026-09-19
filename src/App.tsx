import { useState, useEffect } from 'react';
import { User, FormState } from './types';
import { INITIAL_USERS, INITIAL_FORM_STATE } from './data/presets';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { PromptWizard } from './components/PromptWizard';
import { PromptPreviewPanel } from './components/PromptPreviewPanel';
import { ChecklistView } from './components/ChecklistView';
import { UserManagement } from './components/UserManagement';
import { ProfileModal } from './components/ProfileModal';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { themeConfig } = useTheme();
  // Users state with local storage persistence and migration from old demo names
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('prd_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        // Replace old demo names if cached previously
        const hasOldDemo = parsed.some(
          (u) => u.name === 'Admin Utama' || u.name === 'User Biasa'
        );
        if (hasOldDemo) {
          localStorage.setItem('prd_users', JSON.stringify(INITIAL_USERS));
          return INITIAL_USERS;
        }
        return parsed;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('prd_users', JSON.stringify(users));
  }, [users]);

  // Current logged in user (must pass through login/registration page to enter main page)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('prd_current_user');
      if (savedUser) {
        const parsed: User = JSON.parse(savedUser);
        if (parsed.name === 'Admin Utama' || parsed.name === 'User Biasa') {
          localStorage.removeItem('prd_current_user');
          return null;
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'generator' | 'checklist' | 'settings'>('generator');

  // Profile & Password modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Form State with local persistence
  const [formState, setFormState] = useState<FormState>(() => {
    try {
      const savedForm = localStorage.getItem('prd_form_state');
      if (savedForm) return JSON.parse(savedForm);
    } catch {
      // Fallback
    }
    return INITIAL_FORM_STATE;
  });

  useEffect(() => {
    localStorage.setItem('prd_form_state', JSON.stringify(formState));
  }, [formState]);

  // Generated state toggle
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const handleUpdateForm = (patch: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...patch }));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('prd_current_user', JSON.stringify(user));
    setActiveTab('generator');
  };

  const handleRegister = (newUser: User) => {
    setUsers((prev) => {
      const updated = [...prev, newUser];
      localStorage.setItem('prd_users', JSON.stringify(updated));
      return updated;
    });
    handleLogin(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('prd_current_user');
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('prd_current_user', JSON.stringify(updatedUser));
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      localStorage.setItem('prd_users', JSON.stringify(next));
      return next;
    });
  };

  // If user is not logged in, show the Login/Registration screen
  if (!currentUser) {
    return (
      <LoginModal
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'settings' ? (
          <UserManagement
            users={users}
            setUsers={setUsers}
            currentUser={currentUser}
          />
        ) : activeTab === 'checklist' ? (
          <ChecklistView
            state={formState}
            onBack={() => setActiveTab('generator')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-500">
            <div
              className={`transition-all duration-500 ${
                isGenerated ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-2'
              }`}
            >
              <PromptWizard
                state={formState}
                onChange={handleUpdateForm}
                onGenerate={() => setIsGenerated(true)}
                onEdit={() => setIsGenerated(false)}
                isGenerated={isGenerated}
              />
            </div>

            {isGenerated && (
              <div className="lg:col-span-7 h-[calc(100vh-160px)] sticky top-28 animate-in fade-in slide-in-from-right-8 duration-500">
                <PromptPreviewPanel state={formState} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Background Decorative Blur Blobs */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${themeConfig.blobBg} rounded-full blur-[120px] transition-all duration-700`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[120px]" />
      </div>

      {/* Profile & Password Edit Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onUpdateUser={handleUpdateCurrentUser}
        />
      )}
    </div>
  );
}
