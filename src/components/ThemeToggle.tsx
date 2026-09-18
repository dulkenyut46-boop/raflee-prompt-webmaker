import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, THEME_CONFIGS, ColorTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, setTheme, toggleTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-xs transition-all cursor-pointer"
        title={`Tema saat ini: ${themeConfig.label}. Klik untuk ganti.`}
      >
        <div className={`w-3 h-3 rounded-full ${themeConfig.previewClass}`} />
        <span>{themeConfig.label}</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        {/* Quick 2-way toggle switch for Indigo vs Emerald */}
        <button
          type="button"
          onClick={() => setTheme('indigo')}
          className={`relative px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            theme === 'indigo'
              ? 'bg-white text-indigo-700 shadow-xs font-extrabold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          title="Ganti ke tema Indigo"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
          <span className="hidden sm:inline">Indigo</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('emerald')}
          className={`relative px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            theme === 'emerald'
              ? 'bg-white text-emerald-700 shadow-xs font-extrabold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          title="Ganti ke tema Emerald"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span className="hidden sm:inline">Emerald</span>
        </button>

        {/* Dropdown trigger for more colors */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer ${
            theme !== 'indigo' && theme !== 'emerald' ? 'bg-white text-slate-900 shadow-xs' : ''
          }`}
          title="Pilih tema warna lainnya"
        >
          <Palette size={14} />
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 overflow-hidden"
          >
            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pilih Tema Aksen
            </div>
            <div className="space-y-1">
              {(Object.keys(THEME_CONFIGS) as ColorTheme[]).map((themeKey) => {
                const config = THEME_CONFIGS[themeKey];
                const isSelected = theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => {
                      setTheme(themeKey);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${config.previewClass}`} />
                      <span>{config.label}</span>
                    </div>
                    {isSelected && <Check size={14} className="text-slate-800" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
