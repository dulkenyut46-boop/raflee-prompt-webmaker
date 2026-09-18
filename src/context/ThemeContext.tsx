import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'indigo' | 'emerald' | 'violet' | 'rose';

export interface ThemeConfig {
  id: ColorTheme;
  label: string;
  hex: string;
  badgeHex: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryBorder: string;
  focusRing: string;
  lightBg: string;
  lightBgHover: string;
  badgeBg: string;
  blobBg: string;
  shadowClass: string;
  previewClass: string;
  progressBg: string;
}

export const THEME_CONFIGS: Record<ColorTheme, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    label: 'Indigo',
    hex: '#4F46E5',
    badgeHex: '#E0E7FF',
    primaryBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    primaryHover: 'hover:bg-indigo-700',
    primaryText: 'text-indigo-600',
    primaryBorder: 'border-indigo-600',
    focusRing: 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
    lightBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    lightBgHover: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-700',
    blobBg: 'bg-indigo-100/60',
    shadowClass: 'shadow-indigo-200',
    previewClass: 'bg-indigo-600',
    progressBg: 'bg-indigo-600'
  },
  emerald: {
    id: 'emerald',
    label: 'Emerald',
    hex: '#059669',
    badgeHex: '#D1FAE5',
    primaryBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    primaryHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    primaryBorder: 'border-emerald-600',
    focusRing: 'focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
    lightBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    lightBgHover: 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    blobBg: 'bg-emerald-100/60',
    shadowClass: 'shadow-emerald-200',
    previewClass: 'bg-emerald-600',
    progressBg: 'bg-emerald-600'
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    hex: '#7C3AED',
    badgeHex: '#EDE9FE',
    primaryBg: 'bg-violet-600 hover:bg-violet-700 text-white',
    primaryHover: 'hover:bg-violet-700',
    primaryText: 'text-violet-600',
    primaryBorder: 'border-violet-600',
    focusRing: 'focus:ring-2 focus:ring-violet-500 focus:border-transparent',
    lightBg: 'bg-violet-50 text-violet-600 border border-violet-200',
    lightBgHover: 'hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200',
    badgeBg: 'bg-violet-100 text-violet-700',
    blobBg: 'bg-violet-100/60',
    shadowClass: 'shadow-violet-200',
    previewClass: 'bg-violet-600',
    progressBg: 'bg-violet-600'
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    hex: '#E11D48',
    badgeHex: '#FFE4E6',
    primaryBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-600',
    focusRing: 'focus:ring-2 focus:ring-rose-500 focus:border-transparent',
    lightBg: 'bg-rose-50 text-rose-600 border border-rose-200',
    lightBgHover: 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-700',
    blobBg: 'bg-rose-100/60',
    shadowClass: 'shadow-rose-200',
    previewClass: 'bg-rose-600',
    progressBg: 'bg-rose-600'
  }
};

interface ThemeContextType {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem('app_color_theme') as ColorTheme;
      if (saved && THEME_CONFIGS[saved]) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'indigo';
  });

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('app_color_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    // Quick toggle primarily between Indigo and Emerald as requested
    setTheme(theme === 'indigo' ? 'emerald' : 'indigo');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.indigo;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
