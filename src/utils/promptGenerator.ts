import { FormState } from '../types';

export function generatePromptText(state: FormState): string {
  const isApp =
    !state.productType ||
    /app|web|aplikasi|sistem|software|platform|dashboard|bot/i.test(state.productType);

  const fileContextSnippet = state.fileContext
    ? `\n\nFILE CONTEXT (ADDITIONAL)\n${state.fileContext}`
    : '';

  if (isApp) {
    return `You are an expert Full-Stack Developer, UI/UX Designer, and Startup Product Architect.

Your task is to build a complete, functional web application based on the specifications below.
Please write the complete code, ensure best practices, and make it ready to run. Do NOT just generate a document or PRD; your output must be the actual application code.

Focus on clarity, modularity, and modern design so that the app is production-ready.

PRODUCT INFORMATION
Product Name: ${state.productName || ''}
Product Type: ${state.productType || ''}
Target Users: ${state.targetUsers || ''}
Industry: ${state.industry || ''}
Primary Market: ${state.primaryMarket || ''}
Primary Language: ${state.language || 'Bahasa Indonesia'}
Currency (if applicable): ${state.currency || 'IDR'}
Team Size Target: ${state.teamSize || ''}

CORE PRODUCT GOAL
Mission: ${state.mission || ''}
Primary Problem Being Solved: ${state.problem || ''}
Main Value Proposition: ${state.valueProposition || ''}

PRODUCT FEATURES
Core Modules: ${state.coreModules || ''}

UI STYLE
Design Style: ${state.designStyle || ''}
Primary Color Style: ${state.primaryColorStyle || ''}
Secondary Color Style: ${state.secondaryColorStyle || ''}
Design Reference (optional): ${state.designReference || ''}

ANALYTICS METRICS
Key Business Metrics: ${state.metrics || ''}

TECHNICAL SPECIFICATION (WAJIB DI BAGIAN PALING ATAS)
Gunakan stack berikut:
Framework: Next.js (atau Vite + React SPA)
UI Framework: TailwindCSS
Component Library: shadcn/ui
Database & Backend: Firebase (Firestore & Authentication)

Deployment Config (CRITICAL):
Buat file vercel.json di root untuk menangani SPA routing agar tidak error 404 saat refresh:
\`\`\`json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
\`\`\`

Tambahkan juga:
Arsitektur layout (sidebar + topbar dashboard layout)
Responsive breakpoints Tailwind
Component-based architecture
API-based data fetching
Dark mode support
Modern SaaS dashboard pattern

REQUIRED APP STRUCTURE & FEATURES
Please ensure the application implements the following:

Navigation Structure
- Sidebar
- Topbar
- Content grid

Screen Structure
For each screen, build:
- clear purpose and layout
- key components
- interactive user actions

User Workflows
Implement step-by-step flows such as:
- create data
- edit data
- filter data
- view detail
- delete data

Data & Filtering Logic
Implement functional UI for:
- search
- filter dropdown
- sorting
- date range
- pagination
- status filtering

UI Design System
Apply the following styles:
- spacing system: consistent Tailwind spacing
- border radius: consistent
- card style: clean with subtle shadows
- table style: modern, scrollable
- form style: clear labels, validation states

Color System
Implement:
- primary color usage
- secondary accent colors
- neutral grayscale
- status colors (success, warning, error, info)

Component System
Build and use reusable UI components such as:
Table, Card, Modal, Dropdown, Tabs, Button, Input, Select, Badge, Tooltip, Pagination, Filter bar, Date picker, Chart components

Chart & Analytics Guidelines
Display analytics using:
- bar chart
- line chart
- donut chart
- KPI cards
Ensure visual hierarchy for metrics.

Responsive Behavior
Ensure layout adapts for:
- Desktop
- Tablet (e.g., Sidebar collapses)
- Mobile (e.g., Tables become scrollable, single column)

Dark Mode System
Implement:
- background color shift
- text color adjustment
- card contrast
- chart color adaptation

OUTPUT FORMAT
Please provide the complete, modular code for this application. Start with the main layout and routing, then implement the core pages and components. Use realistic dummy data to populate the UI so it looks complete and functional immediately.

CRITICAL IMPLEMENTATION RULES (MANDATORY)
To ensure the application is fully functional and not just a "UI shell", you MUST follow these rules:
1. NO UI PLACEHOLDERS: Every button, form, and interaction MUST work. Do not leave empty onClick handlers, console.log("todo"), or non-functional UI elements.
2. FULL CRUD STATE MANAGEMENT: Implement fully working local state management (using React Context, Zustand, or complex useState). If I add a new item via a form, it MUST appear in the table/list. If I edit or delete an item, it MUST update the UI immediately.
3. MUTABLE DUMMY DATA: Initialize the state with rich, realistic dummy data so the app isn't empty, but ensure this data is mutable (can be edited/deleted by the user).
4. COMPLETE NAVIGATION: All sidebar/topbar links must actually navigate to the respective views/components and render the correct content.
5. DO NOT CUT CORNERS: Write the complete logic. If the code is too long to generate in one go, implement the absolute core modules first with 100% working logic rather than 10 modules with 0% logic.${fileContextSnippet}`;
  } else {
    return `Anda adalah seorang Ahli Profesional dan Konsultan Senior di bidang ${state.industry || '[INDUSTRI]'}.

Tugas utama Anda adalah membuat **${state.productType || '[JENIS OUTPUT]'}** yang lengkap, terstruktur, dan berkualitas tinggi berdasarkan spesifikasi di bawah ini.

Mohon buat hasil akhirnya secara utuh dan siap digunakan. Jika ini adalah dokumen, tuliskan isi dokumennya. Jika ini adalah aplikasi/kode, tuliskan kodenya. Jika ini laporan keuangan, buatkan struktur dan isi laporannya. Sesuaikan format output dengan jenis yang diminta.

---
# PRODUCT INFORMATION
Product Name: ${state.productName || '[NAMA PROYEK]'}
Product Type: ${state.productType || '[JENIS OUTPUT]'}
Target Users: ${state.targetUsers || '[TARGET PENGGUNA]'}
Industry: ${state.industry || '[INDUSTRI]'}
Primary Market: ${state.primaryMarket || '[FOKUS PASAR]'}
Primary Language: ${state.language || '[BAHASA]'}
Currency (if applicable): ${state.currency || '[MATA UANG]'}
Team Size Target: ${state.teamSize || '[SKALA/UKURAN]'}

---
# CORE PRODUCT GOAL
Mission: ${state.mission || '[TUJUAN UTAMA]'}
Primary Problem Being Solved: ${state.problem || '[MASALAH]'}
Main Value Proposition: ${state.valueProposition || '[KEUNGGULAN]'}

---
# PRODUCT FEATURES
Core Modules: ${state.coreModules || '[KOMPONEN WAJIB]'}

---
# UI STYLE
Design Style: ${state.designStyle || '[GAYA]'}
Primary Color Style: ${state.primaryColorStyle || '[WARNA UTAMA]'}
Secondary Color Style: ${state.secondaryColorStyle || '[WARNA PENDUKUNG]'}
Design Reference (optional): ${state.designReference || '[REFERENSI]'}

---
# ANALYTICS METRICS
Key Business Metrics: ${state.metrics || '[METRIK/DATA PENTING]'}

---
# TECHNICAL SPECIFICATION
Database & Backend: Firebase (Firestore & Authentication)

---
# OUTPUT FORMAT
The PRD must be formatted as structured sections suitable for Notion.
Use clear headings like:
- Product Overview
- Core Features
- Screen Structure
Avoid JSON unless specifically requested.

---
# ADDITIONAL REQUIREMENTS
The PRD must be:
- scalable
- realistic for startups
- easy for developers to implement
- easy for designers to follow
- easy for AI builders to generate apps from

The final document should feel like it was written by an experienced product manager at a modern SaaS startup.

---
# INSTRUKSI TAMBAHAN (MANDATORY)
1. **Kesesuaian Format:** Pastikan format output sesuai dengan "${state.productType || '[JENIS OUTPUT]'}". Gunakan struktur yang logis (misal: Bab/Sub-bab untuk dokumen, komponen/halaman untuk UI/App, tabel untuk laporan keuangan).
2. **Kelengkapan:** Jangan hanya memberikan kerangka (outline). Isi setiap bagian dengan konten yang relevan, detail, dan realistis.
3. **Kualitas Profesional:** Gunakan gaya bahasa "${state.designStyle || 'profesional dan jelas'}" yang sesuai untuk audiens "${state.targetUsers || 'target pembaca'}".
4. **Siap Pakai:** Hasil akhir harus bisa langsung digunakan, dibaca, atau diimplementasikan oleh pengguna tanpa perlu banyak revisi.${state.fileContext ? `\n\n---# FILE CONTEXT (ADDITIONAL)\n${state.fileContext}` : ''}`;
  }
}
