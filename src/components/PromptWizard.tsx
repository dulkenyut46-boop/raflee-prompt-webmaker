import React, { useState } from 'react';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { FormState, StepInfo } from '../types';
import { STEPS, PRESET_TEMPLATES } from '../data/presets';
import { useTheme } from '../context/ThemeContext';

interface PromptWizardProps {
  state: FormState;
  onChange: (patch: Partial<FormState>) => void;
  onGenerate: () => void;
  onEdit: () => void;
  isGenerated: boolean;
}

export const PromptWizard: React.FC<PromptWizardProps> = ({
  state,
  onChange,
  onGenerate,
  onEdit,
  isGenerated
}) => {
  const { themeConfig } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState('');

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  // Preset Template Loader
  const handleApplyPreset = (presetData: Partial<FormState>) => {
    onChange(presetData);
    setErrorMessage('');
  };

  // File Upload Parser
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();
    setIsProcessingFile(true);
    setFileError('');

    try {
      if (extension === 'csv') {
        const text = await file.text();
        const firstLine = text.split('\n')[0] || '';
        onChange({
          fileContext: `Extracted from ${fileName}: Headers: ${firstLine.trim()}`
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        let extractedInfo = `Extracted from ${fileName}:`;

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (json.length > 0) {
            const headers = (json[0] as string[]) || [];
            extractedInfo += ` - Sheet "${sheetName}": Headers: ${headers.join(', ')}`;
          }
        });

        onChange({ fileContext: extractedInfo.trim() });
      } else if (extension === 'pdf') {
        onChange({
          fileContext: `File ${fileName} uploaded. (Informasi dari PDF akan ditambahkan ke referensi konteks data.)`
        });
      } else {
        setFileError('Format file tidak didukung. Harap upload file .xlsx, .xls, .csv, atau .pdf.');
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setFileError('Gagal membaca file. Pastikan file valid.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleClearFile = () => {
    onChange({ fileContext: '' });
    setFileError('');
  };

  // Next & Previous Handlers
  const handleNext = () => {
    if (currentStep === STEPS.length) {
      // Validate at least product name
      if (!state.productName.trim()) {
        setErrorMessage('Nama proyek / produk wajib diisi pada Langkah 1.');
        setCurrentStep(1);
        return;
      }

      setErrorMessage('');
      onGenerate();

      // Trigger pleasant subtle confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback if blocked
      }
    } else {
      setErrorMessage('');
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // If already generated, render the Success Summary Card
  if (isGenerated) {
    return (
      <div className="flex flex-col min-h-[440px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden items-center justify-center p-8 sm:p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm shadow-emerald-200"
        >
          <Check size={40} className="stroke-[2.5]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Prompt Siap Digunakan!</h2>
        <p className="text-slate-500 mb-8 max-w-xs text-sm leading-relaxed">
          Prompt web app Anda telah berhasil disusun. Silakan salin atau download hasilnya di
          panel sebelah kanan untuk di-paste ke AI kesayangan Anda.
        </p>
        <button
          onClick={onEdit}
          className={`inline-flex items-center gap-2 px-5 py-2.5 ${themeConfig.lightBg} font-bold rounded-xl text-sm transition-all cursor-pointer`}
        >
          <RefreshCw size={16} />
          <span>Edit Kembali</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header & Wizard Progress */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((stepItem: StepInfo) => (
            <div
              key={stepItem.id}
              className="flex flex-col items-center flex-1 cursor-pointer"
              onClick={() => setCurrentStep(stepItem.id)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep >= stepItem.id
                    ? `${themeConfig.primaryBg} shadow-sm ${themeConfig.shadowClass}`
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep > stepItem.id ? <Check size={16} /> : stepItem.id}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium hidden sm:block ${
                  currentStep >= stepItem.id ? themeConfig.primaryText : 'text-slate-400'
                }`}
              >
                {stepItem.title}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar line */}
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${themeConfig.progressBg}`}
            initial={false}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Preset Quick Fill Pills */}
      <div className={`px-8 pt-6 pb-2 border-b border-slate-100 ${themeConfig.badgeBg} bg-opacity-30 flex flex-wrap items-center gap-2`}>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${themeConfig.primaryText} mr-1`}>
          <Sparkles size={14} />
          <span>Contoh Cepat:</span>
        </div>
        {PRESET_TEMPLATES.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleApplyPreset(preset.data)}
            className={`text-xs px-2.5 py-1 bg-white ${themeConfig.lightBgHover} text-slate-700 border border-slate-200 rounded-lg font-medium transition-all shadow-xs cursor-pointer`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Wizard Form Body */}
      <div className="p-8">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Step 1: Ide Dasar */}
            {currentStep === 1 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Ide Dasar</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Apa nama proyek/dokumen ini?
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={state.productName}
                      onChange={handleInputChange}
                      placeholder="Contoh: TokoKita, Laporan Keuangan Q1, Artikel Blog"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Bentuk/jenis outputnya seperti apa?
                    </label>
                    <input
                      type="text"
                      name="productType"
                      value={state.productType}
                      onChange={handleInputChange}
                      placeholder="Misal: Web App, Laporan Tahunan, Naskah Video"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Siapa target pengguna/pembacanya?
                    </label>
                    <input
                      type="text"
                      name="targetUsers"
                      value={state.targetUsers}
                      onChange={handleInputChange}
                      placeholder="Misal: Kasir, Manajemen, Investor, Publik"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Terkait bidang/industri apa?
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={state.industry}
                        onChange={handleInputChange}
                        placeholder="Misal: Retail, Keuangan, Edukasi"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Fokus pasar/konteks wilayah?
                      </label>
                      <input
                        type="text"
                        name="primaryMarket"
                        value={state.primaryMarket}
                        onChange={handleInputChange}
                        placeholder="Misal: Indonesia, Internal Perusahaan"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Skala/Ukuran target (opsional)?
                    </label>
                    <input
                      type="text"
                      name="teamSize"
                      value={state.teamSize}
                      onChange={handleInputChange}
                      placeholder="Misal: 10-50 orang, 100 halaman"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Masalah & Solusi */}
            {currentStep === 2 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Masalah & Solusi</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Apa tujuan utama dari proyek/dokumen ini?
                    </label>
                    <textarea
                      name="mission"
                      value={state.mission}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Visi atau hasil akhir yang diharapkan..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Masalah apa yang ingin diselesaikan?
                    </label>
                    <textarea
                      name="problem"
                      value={state.problem}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Keresahan/kebutuhan apa yang mendasari ini?"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Apa nilai tambah/keunggulan utamanya?
                    </label>
                    <textarea
                      name="valueProposition"
                      value={state.valueProposition}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Kenapa ini penting atau lebih baik dari yang sudah ada?"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Fitur & Tampilan */}
            {currentStep === 3 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Fitur & Tampilan</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Bagian/Komponen utama apa saja yang wajib ada?
                    </label>
                    <textarea
                      name="coreModules"
                      value={state.coreModules}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Misal: Login & Dashboard, atau Bab 1 & Bab 2, atau Tabel Pemasukan"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Gaya bahasa/desain yang diinginkan?
                    </label>
                    <input
                      type="text"
                      name="designStyle"
                      value={state.designStyle}
                      onChange={handleInputChange}
                      placeholder="Misal: Modern, Formal, Santai, Profesional"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Ada referensi/contoh yang disukai?
                    </label>
                    <input
                      type="text"
                      name="designReference"
                      value={state.designReference}
                      onChange={handleInputChange}
                      placeholder="Misal: Gojek, Laporan Tahunan BCA, Artikel Medium"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Warna utama?
                      </label>
                      <input
                        type="text"
                        name="primaryColorStyle"
                        value={state.primaryColorStyle}
                        onChange={handleInputChange}
                        placeholder="Misal: Biru BCA, Hijau Gojek"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Warna pendukung/aksen?
                      </label>
                      <input
                        type="text"
                        name="secondaryColorStyle"
                        value={state.secondaryColorStyle}
                        onChange={handleInputChange}
                        placeholder="Misal: Kuning, Abu-abu, Putih"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Data & Target */}
            {currentStep === 4 && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Data & Target</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Metrik/Data apa yang paling penting disorot?
                    </label>
                    <textarea
                      name="metrics"
                      value={state.metrics}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Misal: Total omzet, Laba rugi, Jumlah pengunjung"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Bahasa utama:
                      </label>
                      <select
                        name="language"
                        value={state.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm bg-white"
                      >
                        <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Mata uang:
                      </label>
                      <input
                        type="text"
                        name="currency"
                        value={state.currency}
                        onChange={handleInputChange}
                        placeholder="IDR, USD"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Smart File Context */}
            {currentStep === 5 && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Smart File Context</h2>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    OPSIONAL
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Dropzone area */}
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors group cursor-pointer relative bg-white">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".xlsx,.xls,.csv,.pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      disabled={isProcessingFile}
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        {isProcessingFile ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                        ) : (
                          <UploadCloud className="text-indigo-600" size={24} />
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {isProcessingFile ? 'Memproses file...' : 'Klik atau seret file ke sini'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Mendukung .xlsx, .csv, .pdf</p>
                    </div>
                  </div>

                  {fileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm"
                    >
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                      <p>{fileError}</p>
                    </motion.div>
                  )}

                  {state.fileContext && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-2 ${themeConfig.primaryText}`}>
                          <FileSpreadsheet size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            File Context Terdeteksi
                          </span>
                        </div>
                        <button
                          onClick={handleClearFile}
                          className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 italic line-clamp-3">
                        {state.fileContext}
                      </p>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>Tips:</strong> Upload file Excel stok atau PDF manual bisnis Anda.
                      Sistem akan mengekstrak struktur datanya untuk memperkaya prompt Anda.
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Step Actions */}
      <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            currentStep === 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${themeConfig.primaryBg} shadow-lg ${themeConfig.shadowClass} cursor-pointer`}
        >
          <span>{currentStep === STEPS.length ? 'Selesai' : 'Lanjut'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
