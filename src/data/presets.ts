import { FormState, StepInfo, User } from '../types';

export const INITIAL_FORM_STATE: FormState = {
  productName: '',
  productType: '',
  targetUsers: '',
  industry: '',
  primaryMarket: '',
  teamSize: '',
  mission: '',
  problem: '',
  valueProposition: '',
  coreModules: '',
  designStyle: '',
  designReference: '',
  primaryColorStyle: '',
  secondaryColorStyle: '',
  metrics: '',
  language: 'Bahasa Indonesia',
  currency: 'IDR',
  fileContext: ''
};

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin Utama', email: 'admin@prdgen.com', password: 'admin', role: 'admin' },
  { id: '2', name: 'User Biasa', email: 'user@prdgen.com', password: 'user', role: 'user' }
];

export const STEPS: StepInfo[] = [
  { id: 1, title: 'Ide Dasar', description: 'Basic Idea' },
  { id: 2, title: 'Masalah & Solusi', description: 'Problem & Solution' },
  { id: 3, title: 'Fitur & Tampilan', description: 'Features & UI' },
  { id: 4, title: 'Data & Target', description: 'Data & Metrics' },
  { id: 5, title: 'File Context (Opsional)', description: 'Upload Context' }
];

export const PRESET_TEMPLATES: { name: string; tag: string; data: Partial<FormState> }[] = [
  {
    name: 'TokoKita',
    tag: 'E-Commerce UMKM',
    data: {
      productName: 'TokoKita',
      productType: 'Web App E-Commerce',
      targetUsers: 'Pelanggan ritel, pemilik toko UMKM, admin kasir',
      industry: 'Retail & E-Commerce',
      primaryMarket: 'Indonesia',
      teamSize: '5-20 orang',
      mission: 'Memberdayakan pedagang lokal untuk menjual produk secara online dengan sistem kasir dan inventaris terintegrasi.',
      problem: 'Pencatatan stok manual sering selisih dan pembeli kesulitan mengecek ketersediaan produk secara langsung.',
      valueProposition: 'Katalog belanja instan dengan checkout WhatsApp otomatis, live stock sync, dan dashboard rekap penjualan.',
      coreModules: 'Katalog Produk & Kategori, Keranjang & Checkout, Dashboard Penjualan, Manajemen Stok Produk, Manajemen Pelanggan',
      designStyle: 'Modern, Bersih, Ceria & Terpercaya',
      designReference: 'Tokopedia, Shopify, Gumroad',
      primaryColorStyle: 'Hijau Emerald (#10B981)',
      secondaryColorStyle: 'Kuning Amber (#F59E0B)',
      metrics: 'Total Penjualan Harian, Rata-rata Nilai Keranjang (AOV), Jumlah Produk Terjual, Tingkat Konversi Checkout',
      language: 'Bahasa Indonesia',
      currency: 'IDR'
    }
  },
  {
    name: 'KasirPintar POS',
    tag: 'Point of Sale Retail',
    data: {
      productName: 'KasirPintar POS',
      productType: 'SaaS Dashboard Point-of-Sale',
      targetUsers: 'Kasir toko, supervisor outlet, manajer operasional',
      industry: 'F&B & Retail POS',
      primaryMarket: 'Indonesia',
      teamSize: '10-50 staf',
      mission: 'Mempercepat antrian transaksi kasir dan menyajikan laporan laba-rugi realtime di setiap cabang.',
      problem: 'Proses kasir lama saat jam sibuk dan pemilik tidak bisa memantau penjualan dari jauh secara realtime.',
      valueProposition: 'Antarmuka kasir layar sentuh ultra-cepat, cetak struk thermal, QRIS dinamis, dan laporan multi-cabang.',
      coreModules: 'Kasir POS Cepat, Scan Barcode, Multi-payment (Cash & QRIS), Laporan Harian Kasir, Inventaris Bahan Baku',
      designStyle: 'Minimalis, High-Contrast, Ergonomis untuk Layar Sentuh',
      designReference: 'Square POS, Moka POS, Stripe Terminal',
      primaryColorStyle: 'Biru Indigo (#4F46E5)',
      secondaryColorStyle: 'Slate Gray (#64748B)',
      metrics: 'Omzet per Shift, Kecepatan Rata-rata Transaksi (detik), Item Terlaris, Margin Keuntungan',
      language: 'Bahasa Indonesia',
      currency: 'IDR'
    }
  },
  {
    name: 'KlinikSehat Medika',
    tag: 'Sistem Rekam Medis & Jadwal',
    data: {
      productName: 'KlinikSehat Medika',
      productType: 'Web Portal Manajemen Klinik',
      targetUsers: 'Dokter, perawat, resepsionis, dan pasien',
      industry: 'Kesehatan & Medis',
      primaryMarket: 'Indonesia',
      teamSize: '20-100 staf',
      mission: 'Digitalisasi antrian klinik dan rekam medis pasien sesuai standar rekam medis elektronik.',
      problem: 'Antrian pasien menumpuk di lobi dan riwayat diagnosis terdahulu masih tersimpan di lemari berkas fisik.',
      valueProposition: 'Pendaftaran online mandiri dengan nomor antrian live di TV lobi dan rekam medis digital terenkripsi.',
      coreModules: 'Antrian Pasien Realtime, Rekam Medis Elektronik (RME), Jadwal Praktik Dokter, Resep Obat Digital & Kasir Farmasi',
      designStyle: 'Klinis, Bersih, Tenang, Aksesibel',
      designReference: 'Halodoc, Epic EMR, OneMedical',
      primaryColorStyle: 'Teal Medis (#0D9488)',
      secondaryColorStyle: 'Biru Langit (#0EA5E9)',
      metrics: 'Waktu Tunggu Pasien, Kepuasan Pasien, Jumlah Kunjungan Harian, Efisiensi Waktu Konsultasi',
      language: 'Bahasa Indonesia',
      currency: 'IDR'
    }
  }
];
