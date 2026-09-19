import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { generate50ChecklistItems } from './src/utils/checklistGenerator';

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

  // Checklist Generation Endpoint using Gemini API with resilient fallback
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
    } = req.body || {};

    const effectiveProductName = productName?.trim() || 'Aplikasi Web';
    const effectiveProductType = productType?.trim() || 'Web App';
    const effectiveIndustry = industry?.trim() || 'Umum';
    const effectiveTargetUsers = targetUsers?.trim() || 'Pengguna / Pengunjung';
    const effectiveCoreModules = coreModules?.trim() || 'Dashboard, Login, Formulir Data, Laporan, Pengaturan';
    const effectiveValueProposition = valueProposition?.trim() || 'Solusi efisien dan mudah digunakan';
    const effectiveProblem = problem?.trim() || 'Mempermudah pekerjaan dan pengelolaan data';

    const apiKey = process.env.GEMINI_API_KEY;

    // Prompt for Gemini
    const prompt = `Buatkan daftar pengecekan (checklist) yang sangat mudah dipahami oleh orang awam untuk mengevaluasi/mengetes hasil dari proyek ini berdasarkan detail berikut:
Nama Proyek/Dokumen: ${effectiveProductName}
Jenis Output: ${effectiveProductType}
Industri: ${effectiveIndustry}
Target Pengguna/Pembaca: ${effectiveTargetUsers}
Bagian/Komponen Utama: ${effectiveCoreModules}
Nilai Tambah (Value Proposition): ${effectiveValueProposition}
Masalah yang Diselesaikan: ${effectiveProblem}
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
5. Sesuaikan konteks pengecekan dengan jenis output "${effectiveProductType}".
6. Gunakan bahasa ${language}.
7. Kembalikan HANYA array JSON objek sesuai schema.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
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

        // Fast 3.5s timeout: if remote API is delayed, overloaded (503), or times out, immediately fall back
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 3500)
        );

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const text = response?.text || '[]';
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          const items = parsed.slice(0, 50).map((item, idx) => ({
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
      } catch {
        // Silently hand over to our zero-latency smart generator
      }
    }

    // Contextual 50-item generator ensuring seamless instant response without errors
    const generatedItems = generate50ChecklistItems({
      productName: effectiveProductName,
      productType: effectiveProductType,
      industry: effectiveIndustry,
      targetUsers: effectiveTargetUsers,
      coreModules: effectiveCoreModules,
      valueProposition: effectiveValueProposition,
      problem: effectiveProblem,
      language,
      currency
    });

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
