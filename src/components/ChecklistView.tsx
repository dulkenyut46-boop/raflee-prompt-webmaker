import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ListChecks,
  AlertCircle,
  FileDown,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { FormState, ChecklistItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ChecklistViewProps {
  state: FormState;
  onBack: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ state, onBack }) => {
  const { themeConfig } = useTheme();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Local storage cache key
  const storageKey = `checklist_${(state.productName || 'Aplikasi').trim()}`;

  // Load existing checklist from localStorage on mount or state change
  useEffect(() => {
    if (!state.productName) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing stored checklist', err);
      }
    } else if (state.coreModules) {
      // Auto generate if not yet saved and coreModules are present
      handleGenerateChecklist();
    }
  }, [state.productName]);

  // Generate checklist via Backend API (powered by Gemini)
  const handleGenerateChecklist = async () => {
    if (!state.productName) {
      setErrorMessage('Nama produk harus diisi terlebih dahulu di tab Generator.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });

      if (!response.ok) {
        throw new Error('Gagal menghasilkan checklist dari server.');
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        setItems(data.items);
        localStorage.setItem(storageKey, JSON.stringify(data.items));
      } else {
        throw new Error('Checklist yang diterima kosong.');
      }
    } catch (err) {
      console.error('Checklist generation error:', err);
      setErrorMessage(
        'Terjadi kesalahan saat menghubungi AI. Pastikan server aktif dan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle item completion
  const handleToggleComplete = (id: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        // Celebrate with mini confetti on check
        if (nextCompleted) {
          try {
            confetti({
              particleCount: 20,
              spread: 40,
              origin: { y: 0.7 }
            });
          } catch {
            // Ignore
          }
        }
        return { ...item, completed: nextCompleted };
      }
      return item;
    });

    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Update item notes
  const handleNotesChange = (id: number, notes: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, notes } : item));
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Copy single suggestion prompt
  const handleCopySuggestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Copy all uncompleted suggestions
  const handleCopyAllPending = () => {
    const pending = items.filter((item) => !item.completed);
    if (pending.length === 0) return;

    const formatted = pending
      .map((item, idx) => `${idx + 1}. [${item.category}] ${item.suggestion}`)
      .join('\n\n');

    navigator.clipboard.writeText(formatted);
    setCopiedIndex(-1); // -1 signifies "All copied"
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Export to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    if (items.length === 0) return;

    const dataRows = items.map((item, index) => ({
      No: index + 1,
      Kategori: item.category,
      Fitur: item.feature,
      'Cara Mengetes': item.question,
      'Perintah Perbaikan': item.suggestion,
      Status: item.completed ? 'Selesai' : 'Belum',
      Catatan: item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Checklist');

    // Set column widths for readability
    worksheet['!cols'] = [
      { wch: 6 },  // No
      { wch: 22 }, // Kategori
      { wch: 24 }, // Fitur
      { wch: 45 }, // Cara Mengetes
      { wch: 45 }, // Perintah Perbaikan
      { wch: 12 }, // Status
      { wch: 28 }  // Catatan
    ];

    XLSX.writeFile(
      workbook,
      `Checklist_${(state.productName || 'Aplikasi').replace(/\s+/g, '_')}.xlsx`
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header Bar */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:${themeConfig.primaryText} ${themeConfig.lightBgHover} transition-all mr-1 shadow-xs cursor-pointer`}
            title="Kembali ke Generator"
          >
            <ArrowLeft size={18} />
          </button>
          <div className={`w-10 h-10 ${themeConfig.badgeBg} rounded-xl flex items-center justify-center ${themeConfig.primaryText} shadow-xs`}>
            <ListChecks size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Daftar Pengecekan — {state.productName || 'Aplikasi'}
            </h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
              Panduan mudah untuk memastikan aplikasi berjalan lancar
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {errorMessage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 text-[11px] font-bold">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Export to Excel */}
          <button
            onClick={handleExportExcel}
            disabled={items.length === 0}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              items.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300'
            }`}
            title="Export ke spreadsheet Excel (.xlsx)"
          >
            <FileDown size={14} className="text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          {/* Copy All Pending */}
          <button
            onClick={handleCopyAllPending}
            disabled={items.length === 0 || items.every((i) => i.completed)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              copiedIndex === -1
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
            title="Salin semua instruksi perbaikan yang belum dicentang"
          >
            {copiedIndex === -1 ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedIndex === -1 ? 'Tersalin!' : 'Salin Semua Perintah AI'}</span>
          </button>

          {/* Generate / Regenerate button */}
          <button
            onClick={handleGenerateChecklist}
            disabled={isLoading || !state.productName}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLoading || !state.productName
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : `${themeConfig.lightBg} ${themeConfig.primaryText} ${themeConfig.lightBgHover} shadow-xs`
            }`}
          >
            {isLoading ? (
              <RotateCw size={14} className={`animate-spin ${themeConfig.primaryText}`} />
            ) : (
              <Sparkles size={14} className={themeConfig.primaryText} />
            )}
            <span>{items.length > 0 ? 'Buat Ulang Daftar' : 'Buat Daftar Pengecekan'}</span>
          </button>

          {/* Progress Indicator */}
          <div className={`flex items-center gap-2 px-3.5 py-2 ${themeConfig.badgeBg} rounded-xl border border-slate-200/60`}>
            <span className={`text-xs font-bold ${themeConfig.primaryText}`}>
              {completedCount} / {items.length} Dites
            </span>
            <div className="w-20 sm:w-24 h-2 bg-slate-200 rounded-full overflow-hidden ml-1">
              <div
                className={`h-full ${themeConfig.progressBg} transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading && items.length === 0 ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
          <div className={`w-16 h-16 ${themeConfig.badgeBg} rounded-full flex items-center justify-center animate-pulse`}>
            <Clock size={32} className={themeConfig.primaryText} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sedang Menyusun Daftar Pengecekan...</h3>
            <p className="text-sm text-slate-500 max-w-md mt-1">
              AI sedang membaca ide kamu untuk membuat daftar 50 langkah pengetesan aplikasi secara komprehensif.
            </p>
          </div>
          <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className={`h-full ${themeConfig.progressBg} animate-progress`} style={{ width: '40%' }} />
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <ListChecks size={32} className="text-slate-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daftar Pengecekan Belum Ada</h3>
            <p className="text-sm text-slate-500 max-w-md mt-1">
              Klik tombol "Buat Daftar Pengecekan" di atas agar AI bisa membuatkan panduan tes khusus
              untuk aplikasimu.
            </p>
          </div>
          <button
            onClick={handleGenerateChecklist}
            disabled={!state.productName}
            className={`mt-2 flex items-center gap-2 px-5 py-2.5 ${themeConfig.primaryBg} font-bold rounded-xl text-sm shadow-md ${themeConfig.shadowClass} transition-all cursor-pointer disabled:opacity-50`}
          >
            <Sparkles size={16} />
            <span>Buat 50 Checklist Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-4 py-4 w-12 text-center">No</th>
                <th className="px-4 py-4 w-44">Bagian & Fitur</th>
                <th className="px-6 py-4 w-80">Cara Mengetes (Langkah-langkah)</th>
                <th className="px-6 py-4 w-80">Perintah Perbaikan (Salin & Kirim ke AI)</th>
                <th className="px-4 py-4 w-28 text-center">Sudah Jalan?</th>
                <th className="px-4 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`group transition-colors hover:bg-slate-50/70 ${
                    item.completed ? 'bg-emerald-50/25' : ''
                  }`}
                >
                  {/* Number */}
                  <td className="px-4 py-4 text-xs font-mono text-slate-400 text-center">
                    {index + 1}
                  </td>

                  {/* Category & Feature */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-[10px] font-bold ${themeConfig.primaryText} uppercase tracking-wider`}>
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {item.feature}
                      </span>
                    </div>
                  </td>

                  {/* Testing Question */}
                  <td className="px-6 py-4">
                    <p
                      className={`text-xs leading-relaxed ${
                        item.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                      }`}
                    >
                      {item.question}
                    </p>
                  </td>

                  {/* Suggestion Fix Prompt */}
                  <td className="px-6 py-4">
                    <div className="relative group/prompt">
                      <div className="flex items-start justify-between gap-2 p-2.5 bg-slate-100/80 rounded-lg border border-slate-200 group-hover/prompt:border-slate-300 group-hover/prompt:bg-white transition-all">
                        <p className="text-xs text-slate-600 font-mono line-clamp-2 select-all">
                          {item.suggestion}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopySuggestion(item.suggestion, index)}
                          className={`p-1 rounded-md text-slate-400 hover:${themeConfig.primaryText} ${themeConfig.lightBgHover} transition-colors shrink-0 cursor-pointer`}
                          title="Salin perintah ini"
                        >
                          {copiedIndex === index ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Completed Checkbox */}
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(item.id)}
                      className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                      title={item.completed ? 'Tandai belum' : 'Tandai selesai'}
                    >
                      {item.completed ? (
                        <CheckCircle2 size={18} className="stroke-[2.5]" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                  </td>

                  {/* Editable Notes */}
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder="Tulis catatan..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-slate-400 focus:bg-white bg-transparent outline-none transition-all placeholder:text-slate-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
