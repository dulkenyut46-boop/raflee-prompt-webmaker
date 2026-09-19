import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Safe directory resolution compatible with both tsx dev and esbuild CJS bundle
const rootDir = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Checklist Generation Endpoint using Gemini API
  app.post('/api/generate-checklist', async (req: Request, res: Response) => {
    const {
      productName,
      productType,
      industry,
      targetUsers,
      coreModules,
      valueProposition,
      problem,
      language = 'Bahasa Indonesia',
      currency = 'IDR'
    } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Nama produk harus diisi terlebih dahulu.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Prompt for Gemini
    const prompt = `Buatkan daftar pengecekan (checklist) yang sangat mudah dipahami oleh orang awam untuk mengevaluasi/mengetes hasil dari proyek ini berdasarkan detail berikut:
Nama Proyek/Dokumen: ${productName}
Jenis Output: ${productType || 'Web App'}
Industri: ${industry || 'Umum'}
Target Pengguna/Pembaca: ${targetUsers || 'Pengguna'}
Bagian/Komponen Utama: ${coreModules || 'Dashboard, Login, Settings'}
Nilai Tambah (Value Proposition): ${valueProposition || 'Solusi efisien'}
Masalah yang Diselesaikan: ${problem || 'Mempermudah pekerjaan'}
Bahasa: ${language}
Mata Uang: ${currency}

Persyaratan:
1. Buat tepat 50 item pengecekan berkualitas tinggi dan komprehensif.
2. Kelompokkan ke dalam kategori yang mudah dimengerti (misal: "Navigasi & Tampilan", "Autentikasi", "Fitur Utama", "Validasi Data", "Performa & Responsif", "Alur Transaksi/Ekspor", "Keamanan", dll sesuai konteks).
3. Setiap item harus memiliki:
   - id: angka unik berurutan 1 sampai 50
   - category: string kategori
   - feature: nama fitur spesifik
   - question: cara mengetes dengan bahasa sehari-hari ramah pemula
   - suggestion: perintah/prompt perbaikan yang siap dicopy-paste ke AI builder/developer jika ada error atau kekurangan
4. Pastikan bahasa yang digunakan sangat ramah untuk pemula (awam-friendly), hindari istilah teknis yang terlalu rumit.
5. Sesuaikan konteks pengecekan dengan jenis output "${productType || 'Web App'}".
6. Gunakan bahasa ${language}.
7. Kembalikan HANYA array JSON objek sesuai schema.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  feature: { type: Type.STRING },
                  question: { type: Type.STRING },
                  suggestion: { type: Type.STRING }
                },
                required: ['id', 'category', 'feature', 'question', 'suggestion']
              }
            }
          }
        });

        const text = response.text || '[]';
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const items = parsed.map((item, idx) => ({
            id: item.id || idx + 1,
            category: item.category || 'Umum',
            feature: item.feature || `Fitur ${idx + 1}`,
            question: item.question || 'Periksa fungsi ini.',
            suggestion: item.suggestion || 'Perbaiki fungsi ini agar berfungsi dengan baik.',
            completed: false,
            notes: ''
          }));
          return res.json({ items });
        }
      } catch (err) {
        console.error('Gemini API Error, falling back to smart generator:', err);
      }
    }

    // High quality contextual fallback generator ensuring 50 items are always provided
    const defaultCategories = [
      { name: 'Tampilan & Responsif', icon: 'layout' },
      { name: 'Autentikasi & Akun', icon: 'auth' },
      { name: 'Alur Fitur Utama', icon: 'core' },
      { name: 'Manajemen Data & CRUD', icon: 'data' },
      { name: 'Pencarian & Filter', icon: 'search' },
      { name: 'Formulir & Validasi', icon: 'forms' },
      { name: 'Notifikasi & Feedback', icon: 'feedback' },
      { name: 'Performa & Kecepatan', icon: 'perf' },
      { name: 'Ekspor & Laporan', icon: 'export' },
      { name: 'Penanganan Kesalahan', icon: 'error' }
    ];

    const generatedItems = [];
    const modulesList = (coreModules || 'Dashboard, Formulir Data, Laporan, Pengaturan')
      .split(/[,;\n]/)
      .map((s: string) => s.trim())
      .filter(Boolean);

    for (let i = 1; i <= 50; i++) {
      const catObj = defaultCategories[(i - 1) % defaultCategories.length];
      const targetModule = modulesList[(i - 1) % modulesList.length] || productName;
      
      let featureName = `${targetModule} - Bagian ${Math.ceil(i / defaultCategories.length)}`;
      let testQuestion = `Coba buka dan uji ${featureName} pada ${productName}. Apakah tampilannya rapi dan tombol-tombolnya merespons dengan cepat?`;
      let fixPrompt = `Tolong perbaiki dan sempurnakan modul ${featureName} pada aplikasi ${productName}. Pastikan UI terlihat modern, tidak ada lag, dan data tersimpan dengan benar.`;

      if (catObj.name === 'Tampilan & Responsif') {
        featureName = `Desain Responsif ${targetModule}`;
        testQuestion = `Coba buka halaman ${targetModule} di ukuran layar ponsel dan laptop. Apakah tata letak elemen tetap rapi dan tidak terpotong?`;
        fixPrompt = `Tolong buat halaman ${targetModule} sepenuhnya responsif di layar mobile dan tablet menggunakan Tailwind CSS.`;
      } else if (catObj.name === 'Autentikasi & Akun') {
        featureName = `Akses Pengguna & Hak Akses`;
        testQuestion = `Coba lakukan login dan verifikasi apakah pengguna (${targetUsers}) dapat mengakses modul ${targetModule} dengan aman?`;
        fixPrompt = `Tolong pastikan alur autentikasi dan otorisasi untuk pengguna "${targetUsers}" berjalan mulus dengan proteksi rute yang aman.`;
      } else if (catObj.name === 'Alur Fitur Utama') {
        featureName = `Alur Kerja Inti: ${targetModule}`;
        testQuestion = `Lakukan simulasi alur lengkap untuk menyelesaikan masalah: "${problem || 'tugas utama'}". Apakah semua langkah berjalan tanpa kendala?`;
        fixPrompt = `Tolong perbaiki alur utama pada ${targetModule} agar langsung menyelesaikan masalah "${problem || 'kebutuhan pengguna'}" dengan langkah yang intuitif.`;
      } else if (catObj.name === 'Manajemen Data & CRUD') {
        featureName = `Tambah, Edit, & Hapus di ${targetModule}`;
        testQuestion = `Coba tambahkan data baru di ${targetModule}, edit salah satu isinya, lalu hapus. Apakah daftar data langsung terupdate tanpa perlu refresh manual?`;
        fixPrompt = `Tolong implementasikan state management CRUD yang reaktif pada ${targetModule} agar penambahan, edit, dan hapus langsung memperbarui tampilan seketika.`;
      } else if (catObj.name === 'Pencarian & Filter') {
        featureName = `Pencarian & Filter ${targetModule}`;
        testQuestion = `Ketikkan kata kunci di kolom pencarian ${targetModule}. Apakah hasil yang cocok langsung tersaring secara instan?`;
        fixPrompt = `Tambahkan fitur filter dan instant search pada ${targetModule} dengan debounce agar pencarian sangat cepat dan akurat.`;
      } else if (catObj.name === 'Formulir & Validasi') {
        featureName = `Validasi Input ${targetModule}`;
        testQuestion = `Coba kosongkan kolom wajib atau masukkan data tidak valid pada ${targetModule}. Apakah muncul pesan peringatan yang jelas dalam ${language}?`;
        fixPrompt = `Tolong tambahkan validasi form yang jelas pada ${targetModule} lengkap dengan pesan error berwarna merah yang ramah pengguna.`;
      } else if (catObj.name === 'Notifikasi & Feedback') {
        featureName = `Pemberitahuan & Toast ${targetModule}`;
        testQuestion = `Setelah menekan tombol simpan atau aksi penting, apakah muncul notifikasi/toast sukses yang elegan?`;
        fixPrompt = `Tolong buatkan komponen toast notification sukses dan gagal yang modern saat aksi selesai dieksekusi di ${targetModule}.`;
      } else if (catObj.name === 'Performa & Kecepatan') {
        featureName = `Kecepatan Muat ${targetModule}`;
        testQuestion = `Periksa waktu transisi saat membuka menu ${targetModule}. Apakah transisi terasa instan dan halus?`;
        fixPrompt = `Tolong optimalkan performa dan lazy loading komponen pada ${targetModule} agar aplikasi terasa sangat cepat dan ringan.`;
      } else if (catObj.name === 'Ekspor & Laporan') {
        featureName = `Ekspor Data / Ringkasan ${targetModule}`;
        testQuestion = `Coba uji tombol ekspor atau ringkasan metrik (${currency}). Apakah format file atau angka yang dihasilkan sudah benar?`;
        fixPrompt = `Tolong lengkapi fitur ekspor dan ringkasan metrik keuangan/kinerja dalam mata uang ${currency} dengan format yang rapi.`;
      } else if (catObj.name === 'Penanganan Kesalahan') {
        featureName = `Pencegahan Crash ${targetModule}`;
        testQuestion = `Coba masukkan karakter simbol acak atau uji saat data kosong. Apakah aplikasi menampilkan tampilan ramah (empty state) tanpa layar blank?`;
        fixPrompt = `Tolong pasang empty state yang informatif dan error boundary pada ${targetModule} agar aplikasi tidak pernah crash saat data kosong.`;
      }

      generatedItems.push({
        id: i,
        category: catObj.name,
        feature: featureName,
        question: testQuestion,
        suggestion: fixPrompt,
        completed: false,
        notes: ''
      });
    }

    return res.json({ items: generatedItems });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prompt Web Maker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
