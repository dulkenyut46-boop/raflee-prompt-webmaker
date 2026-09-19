import React, { useState, useEffect, useMemo } from 'react';
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
  Clock,
  Layers,
  Globe2,
  FolderOpen,
  Search,
  CheckCheck,
  HelpCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { FormState, ChecklistItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { generate50ChecklistItems } from '../utils/checklistGenerator';

interface ChecklistViewProps {
  state: FormState;
  onBack: () => void;
}

// Preset template untuk proyek di luar projek ini
const EXTERNAL_PROJECT_PRESETS = [
  {
    name: 'Toko Online (E-Commerce)',
    type: 'Web & Mobile E-Commerce',
    modules: 'Katalog Produk, Keranjang Belanja, Checkout Pembayaran, Lacak Pesanan, Dashboard Penjual',
    problem: 'Mempermudah penjualan produk secara online dan pembayaran otomatis'
  },
  {
    name: 'Aplikasi Kasir (POS) & Toko',
    type: 'Point of Sale (POS)',
    modules: 'Kasir Transaksi Cepat, Manajemen Stok Barang, Laporan Penjualan, Cetak Struk, Multi Kasir',
    problem: 'Mencatat transaksi penjualan toko secara instan dan memantau stok real-time'
  },
  {
    name: 'Sistem HRD & Absensi Karyawan',
    type: 'Sistem Informasi Manajemen',
    modules: 'Absensi GPS/Foto, Data Karyawan, Pengajuan Cuti/Izin, Hitung Gaji (Payroll), Penilaian Kinerja',
    problem: 'Pengelolaan data kehadiran dan administrasi karyawan secara terpusat'
  },
  {
    name: 'Website Landing Page & Portofolio',
    type: 'Company Profile / Landing Page',
    modules: 'Hero Banner, Showcase Layanan, Galeri Portofolio, Testimoni Klien, Form Kontak & WhatsApp',
    problem: 'Meningkatkan kredibilitas bisnis dan mengonversi pengunjung menjadi klien'
  },
  {
    name: 'Sistem Reservasi & Booking',
    type: 'Aplikasi Booking & Jadwal',
    modules: 'Pilihan Layanan, Kalender Booking Interaktif, Notifikasi Pengingat WhatsApp, Pembayaran DP, Review',
    problem: 'Menghindari jadwal bentrok dan memudahkan klien memesan jadwal layanan 24/7'
  },
  {
    name: 'Dashboard Manajemen Proyek & Tugas',
    type: 'SaaS Web App',
    modules: 'Kanban Board, Manajemen Task, Kolaborasi Tim, Pelacak Waktu (Timer), Ekspor Laporan',
    problem: 'Membantu tim memantau progres proyek dan tenggat waktu secara transparan'
  }
];

export const ChecklistView: React.FC<ChecklistViewProps> = ({ state, onBack }) => {
  const { themeConfig } = useTheme();

  // Mode: 'current' (proyek dari generator) atau 'external' (proyek di luar dari projek ini)
  const [projectSource, setProjectSource] = useState<'current' | 'external'>('current');

  // State khusus jika ingin mengecek proyek luar
  const [externalProjectName, setExternalProjectName] = useState(EXTERNAL_PROJECT_PRESETS[0].name);
  const [externalProjectType, setExternalProjectType] = useState(EXTERNAL_PROJECT_PRESETS[0].type);
  const [externalModules, setExternalModules] = useState(EXTERNAL_PROJECT_PRESETS[0].modules);
  const [externalProblem, setExternalProblem] = useState(EXTERNAL_PROJECT_PRESETS[0].problem);

  // Active Effective Project Info
  const effectiveProjectName = useMemo(() => {
    if (projectSource === 'external') {
      return externalProjectName.trim() || 'Proyek Eksternal';
    }
    return state.productName?.trim() || 'Aplikasi Web Saya';
  }, [projectSource, externalProjectName, state.productName]);

  const effectiveProductType = useMemo(() => {
    if (projectSource === 'external') {
      return externalProjectType.trim() || 'Web App';
    }
    return state.productType?.trim() || 'Web App';
  }, [projectSource, externalProjectType, state.productType]);

  const effectiveModules = useMemo(() => {
    if (projectSource === 'external') {
      return externalModules.trim() || 'Dashboard, Formulir, Laporan, Pengaturan';
    }
    return state.coreModules?.trim() || 'Dashboard, Formulir, Laporan, Pengaturan';
  }, [projectSource, externalModules, state.coreModules]);

  const effectiveProblem = useMemo(() => {
    if (projectSource === 'external') {
      return externalProblem.trim() || 'kebutuhan pengguna sehari-hari';
    }
    return state.problem?.trim() || 'kebutuhan pengguna sehari-hari';
  }, [projectSource, externalProblem, state.problem]);

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Local storage cache key per project
  const storageKey = `checklist_${effectiveProjectName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()}`;

  // Load existing checklist from localStorage on source or project change
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      } catch (err) {
        console.warn('Error reading saved checklist:', err);
      }
    }
    
    // Auto-generate if empty and ready
    handleGenerateChecklist(false);
  }, [effectiveProjectName, projectSource]);

  // Generate checklist with resilient multi-tier fallback (server AI -> client smart generator)
  const handleGenerateChecklist = async (forceRefresh: boolean = true) => {
    setIsLoading(true);

    const payload = {
      productName: effectiveProjectName,
      productType: effectiveProductType,
      industry: state.industry || 'Umum',
      targetUsers: state.targetUsers || 'Pengguna / Pengunjung',
      coreModules: effectiveModules,
      valueProposition: state.valueProposition || 'Solusi efisien dan mudah digunakan',
      problem: effectiveProblem,
      language: state.language || 'Bahasa Indonesia',
      currency: state.currency || 'IDR'
    };

    let generated: ChecklistItem[] | null = null;

    try {
      // Set a 4.5 second timeout to prevent waiting if external AI is delayed
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch('/api/generate-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          generated = data.items;
        }
      }
    } catch (err) {
      console.warn('Network or AI service notice, using instant smart client generator:', err);
    }

    // Multi-tier Fallback: If server AI response wasn't received, generate locally instantly
    if (!generated || generated.length === 0) {
      generated = generate50ChecklistItems(payload);
    }

    setItems(generated);
    localStorage.setItem(storageKey, JSON.stringify(generated));
    setIsLoading(false);

    if (forceRefresh) {
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }
  };

  // Toggle item completion
  const handleToggleComplete = (id: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        if (nextCompleted) {
          try {
            confetti({
              particleCount: 15,
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

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    if (items.length === 0) return;

    const dataRows = items.map((item, index) => ({
      No: index + 1,
      Kategori: item.category,
      Fitur: item.feature,
      'Cara Mengetes': item.question,
      'Perintah Perbaikan (Kirim ke AI)': item.suggestion,
      Status: item.completed ? 'Selesai' : 'Belum',
      Catatan: item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Checklist 50');

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 26 },
      { wch: 48 },
      { wch: 48 },
      { wch: 12 },
      { wch: 28 }
    ];

    XLSX.writeFile(
      workbook,
      `Checklist_50_${effectiveProjectName.replace(/\s+/g, '_')}.xlsx`
    );
  };

  // Select external project preset
  const handleSelectPreset = (preset: (typeof EXTERNAL_PROJECT_PRESETS)[0]) => {
    setExternalProjectName(preset.name);
    setExternalProjectType(preset.type);
    setExternalModules(preset.modules);
    setExternalProblem(preset.problem);
  };

  // Categories list for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const q = searchFilter.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.feature.toLowerCase().includes(q) ||
        item.question.toLowerCase().includes(q) ||
        item.suggestion.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [items, categoryFilter, searchFilter]);

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Project Selector: Proyek Saat Ini vs Di Luar Projek Ini */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
            <ListChecks size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Target Evaluasi Proyek
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Tepat 50 Item Lengkap
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{effectiveProjectName}</span>
              <span className="text-xs font-normal text-slate-400">({effectiveProductType})</span>
            </h3>
          </div>
        </div>

        {/* Toggle Mode: Proyek Generator vs Di Luar Projek Ini */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 shrink-0">
          <button
            type="button"
            onClick={() => setProjectSource('current')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              projectSource === 'current'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen size={14} />
            <span>Proyek Generator Ini</span>
          </button>

          <button
            type="button"
            onClick={() => setProjectSource('external')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              projectSource === 'external'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 size={14} />
            <span>Di Luar Dari Projek Ini</span>
          </button>
        </div>
      </div>

      {/* External Project Setup Panel (Muncul jika memilih 'Di Luar Dari Projek Ini') */}
      {projectSource === 'external' && (
        <div className="p-5 bg-amber-50/60 border-b border-amber-200/80 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Globe2 size={14} className="text-amber-700" />
                <span>Pilih Atau Tulis Proyek Di Luar Projek Ini yang Ingin Dites</span>
              </p>
              <p className="text-[11px] text-amber-800">
                Pilih template cepat atau sesuaikan nama proyek lain yang ingin Anda uji menggunakan 50 item checklist:
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleGenerateChecklist(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Terapkan & Buat 50 Checklist</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {EXTERNAL_PROJECT_PRESETS.map((preset) => {
              const isSelected = externalProjectName === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/70'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          {/* Custom External Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Proyek Luar
              </label>
              <input
                type="text"
                value={externalProjectName}
                onChange={(e) => setExternalProjectName(e.target.value)}
                placeholder="Contoh: Aplikasi Booking Barber"
                className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Jenis / Platform
              </label>
              <input
                type="text"
                value={externalProjectType}
                onChange={(e) => setExternalProjectType(e.target.value)}
                placeholder="Contoh: Web App / Mobile App"
                className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Bagian / Modul Utama yang Dites
              </label>
              <input
                type="text"
                value={externalModules}
                onChange={(e) => setExternalModules(e.target.value)}
                placeholder="Contoh: Login, Menu, Pembayaran, Review"
                className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg outline-none font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Header & Action Controls */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:${themeConfig.primaryText} ${themeConfig.lightBgHover} transition-all mr-1 shadow-xs cursor-pointer`}
            title="Kembali ke Generator"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              50 Checklist Evaluasi — {effectiveProjectName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Panduan 50 langkah mudah untuk menguji kelayakan, tombol, dan fungsionalitas aplikasi.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export to Excel */}
          <button
            onClick={handleExportExcel}
            disabled={items.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            onClick={() => handleGenerateChecklist(true)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : `${themeConfig.primaryBg} shadow-xs`
            }`}
          >
            {isLoading ? (
              <RotateCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>{items.length > 0 ? 'Buat Ulang 50 Daftar' : 'Buat 50 Checklist Sekarang'}</span>
          </button>

          {/* Progress Indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 ${themeConfig.badgeBg} rounded-xl border border-slate-200/60`}>
            <span className={`text-xs font-bold ${themeConfig.primaryText}`}>
              {completedCount} / {items.length} Dites
            </span>
            <div className="w-16 sm:w-20 h-2 bg-slate-200 rounded-full overflow-hidden ml-1">
              <div
                className={`h-full ${themeConfig.progressBg} transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      {items.length > 0 && (
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Cari bagian, pertanyaan tes, atau perintah..."
              className="bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-400 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua (50)
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading && items.length === 0 ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
          <div className={`w-16 h-16 ${themeConfig.badgeBg} rounded-full flex items-center justify-center animate-pulse`}>
            <Clock size={32} className={themeConfig.primaryText} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sedang Menyusun 50 Checklist...</h3>
            <p className="text-sm text-slate-500 max-w-md mt-1">
              Menyiapkan daftar 50 item pengetesan komprehensif untuk {effectiveProjectName}.
            </p>
          </div>
          <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className={`h-full ${themeConfig.progressBg} animate-progress`} style={{ width: '60%' }} />
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
              Klik tombol di bawah untuk membuatkan panduan 50 langkah tes instan khusus untuk {effectiveProjectName}.
            </p>
          </div>
          <button
            onClick={() => handleGenerateChecklist(true)}
            className={`mt-2 flex items-center gap-2 px-5 py-2.5 ${themeConfig.primaryBg} font-bold rounded-xl text-sm shadow-md ${themeConfig.shadowClass} transition-all cursor-pointer`}
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
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`group transition-colors hover:bg-slate-50/70 ${
                    item.completed ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {/* Number */}
                  <td className="px-4 py-4 text-xs font-mono text-slate-400 text-center">
                    {item.id}
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
