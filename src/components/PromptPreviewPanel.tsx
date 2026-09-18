import React, { useState } from 'react';
import { Copy, Check, Download, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FormState } from '../types';
import { generatePromptText } from '../utils/promptGenerator';
import { useTheme } from '../context/ThemeContext';

interface PromptPreviewPanelProps {
  state: FormState;
}

export const PromptPreviewPanel: React.FC<PromptPreviewPanelProps> = ({ state }) => {
  const { themeConfig } = useTheme();
  const [copied, setCopied] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  const promptText = generatePromptText(state);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setRateLimitMessage('Gagal menyalin ke clipboard.');
      setTimeout(() => setRateLimitMessage(''), 3000);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([promptText], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Prompt_${(state.productName || 'WebApp').replace(/\s+/g, '_')}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setRateLimitMessage('Gagal mendownload file.');
      setTimeout(() => setRateLimitMessage(''), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-200">
      {/* Panel Window Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <div className="flex items-center gap-1.5 ml-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
            <Terminal size={12} className={themeConfig.primaryText} />
            <span>Live Prompt Preview</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-xs font-medium cursor-pointer"
            title="Salin isi prompt ke clipboard"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${themeConfig.primaryBg} transition-all text-xs font-medium cursor-pointer shadow-sm`}
            title="Download prompt sebagai file .md"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Rate Limit Alert */}
      <AnimatePresence>
        {rateLimitMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-950/80 text-red-200 border-b border-red-800 text-xs px-6 py-2"
          >
            {rateLimitMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preformatted Prompt Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 font-mono text-xs sm:text-sm text-slate-300 whitespace-pre-wrap selection:bg-slate-700 custom-scrollbar leading-relaxed">
        {promptText}
      </div>
    </div>
  );
};
