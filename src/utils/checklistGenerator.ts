import { ChecklistItem, FormState } from '../types';

export interface ChecklistGeneratorParams {
  productName?: string;
  productType?: string;
  industry?: string;
  targetUsers?: string;
  coreModules?: string;
  problem?: string;
  valueProposition?: string;
  language?: string;
  currency?: string;
}

export function generate50ChecklistItems(params: ChecklistGeneratorParams): ChecklistItem[] {
  const name = params.productName?.trim() || 'Aplikasi Web';
  const type = params.productType?.trim() || 'Aplikasi Web';
  const users = params.targetUsers?.trim() || 'Pengguna / Pengunjung';
  const lang = params.language?.trim() || 'Bahasa Indonesia';
  const curr = params.currency?.trim() || 'IDR';
  const prob = params.problem?.trim() || 'kebutuhan pengguna sehari-hari';

  // Extract modules
  const rawModules = params.coreModules?.trim() || 'Dashboard, Formulir Input, Data Master, Laporan, Pengaturan Akun';
  const modulesList = rawModules
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  
  if (modulesList.length === 0) {
    modulesList.push('Halaman Utama', 'Formulir', 'Daftar Data', 'Pengaturan');
  }

  const getModule = (index: number) => modulesList[index % modulesList.length];

  const categoryTemplates = [
    // 1. Tampilan & Desain Responsif (1-5)
    {
      category: 'Tampilan & Responsif',
      items: [
        {
          feature: `Responsivitas Layar HP & Tablet (${name})`,
          question: `Buka ${name} di browser ponsel (atau inspect element mobile). Apakah semua tata letak vertikal rapi, teks tidak saling tumpang tindih, dan tidak ada horizontal scrollbar yang bocor?`,
          suggestion: `Tolong perbaiki responsive layout pada ${name} menggunakan utility responsive Tailwind (sm:, md:, lg:) agar tampilan di layar smartphone tidak terpotong dan tidak ada overflow horizontal.`
        },
        {
          feature: `Ketajaman Tipografi & Kontras Warna`,
          question: `Periksa kontras warna tulisan terhadap warna latar belakang pada halaman utama ${name}. Apakah teks hitam/abu-abu mudah dibaca di bawah pencahayaan ruangan normal?`,
          suggestion: `Tolong sesuaikan tingkat kontras teks pada ${name} agar memenuhi standar WCAG AA (rasio minimal 4.5:1), hindari teks abu-abu pudar di atas background terang.`
        },
        {
          feature: `Ukuran Tombol & Target Sentuh (Touch Target)`,
          question: `Coba tekan setiap tombol aksi di smartphone. Apakah ukuran tombol minimal 44x44px sehingga mudah ditekan jari tanpa salah memencet tombol lain di sebelahnya?`,
          suggestion: `Tolong perbesar touch target seluruh tombol interaktif dan ikon pada ${name} minimal 44x44px dengan padding yang nyaman untuk pengguna mobile.`
        },
        {
          feature: `Tampilan Mode Gelap / Terang (Theming)`,
          question: `Ganti tema aplikasi antara terang dan gelap (jika tersedia). Apakah seluruh latar belakang, border, dan teks berubah secara serasi tanpa ada bagian yang 'blank' putih silau?`,
          suggestion: `Tolong sinkronkan penerapan dark mode pada seluruh komponen ${name} agar warna teks dan background konsisten di setiap kartu.`
        },
        {
          feature: `Konsistensi Ruang (Margin & Padding)`,
          question: `Periksa jarak antar kartu dan kolom di layar desktop. Apakah jarak antar elemen serasi, konsisten (8px, 16px, 24px) dan tidak ada elemen yang menempel terlalu mepet ke tepi layar?`,
          suggestion: `Tolong rapikan spacing (margin, padding, gap) pada antarmuka ${name} menggunakan grid/flex berjarak teratur agar layout terlihat profesional.`
        }
      ]
    },

    // 2. Navigasi & Struktur Menu (6-10)
    {
      category: 'Navigasi & Menu',
      items: [
        {
          feature: `Navigasi Menu Utama (${getModule(0)})`,
          question: `Klik menu navigasi untuk berpindah ke modul ${getModule(0)}. Apakah halaman langsung berpindah tanpa error 404 dan menu yang sedang aktif memiliki penanda visual (highlight)?`,
          suggestion: `Tolong perbaiki active state pada navbar/sidebar ${name} saat membuka modul ${getModule(0)} agar pengguna tahu posisi halaman yang sedang dibuka.`
        },
        {
          feature: `Menu Hamburger di Layar Mobile`,
          question: `Buka aplikasi di smartphone lalu klik ikon menu hamburger tiga garis. Apakah laci menu (drawer) terbuka dengan mulus dan bisa ditutup kembali dengan menekan area luar?`,
          suggestion: `Tolong buat transisi animasi buka-tutup mobile menu drawer pada ${name} yang halus dan dapat ditutup ketika pengguna mengetuk backdrop/overlay.`
        },
        {
          feature: `Breadcrumbs / Tombol Kembali (Back Navigation)`,
          question: `Masuk ke halaman detail sub-modul, lalu tekan tombol panah kembali atau browser back. Apakah Anda kembali ke halaman sebelumnya tanpa me-reset data yang sedang dikerjakan?`,
          suggestion: `Tolong tambahkan navigasi breadcrumb dan pastikan routing browser back button pada ${name} mengembalikan posisi halaman sebelumnya secara konsisten.`
        },
        {
          feature: `Tautan Logo ke Beranda (Home Link)`,
          question: `Klik logo atau nama aplikasi ${name} di pojok kiri atas dari halaman mana saja. Apakah langsung mengarahkan Anda kembali ke beranda/dashboard utama?`,
          suggestion: `Tolong tautkan logo di header ${name} agar selalu mengarahkan pengguna kembali ke halaman utama secara instan saat diklik.`
        },
        {
          feature: `Pencegahan Broken Link (Tautan Mati)`,
          question: `Periksa seluruh tautan di header, menu samping, dan footer. Apakah ada link yang jika diklik tidak menghasilkan apa-apa atau mengarah ke halaman kosong?`,
          suggestion: `Tolong pastikan setiap tombol navigasi dan tautan di ${name} memiliki handler onClick atau rute router yang valid, hindari href="#" tanpa aksi.`
        }
      ]
    },

    // 3. Autentikasi & Akun Pengguna (11-15)
    {
      category: 'Autentikasi & Akun',
      items: [
        {
          feature: `Formulir Masuk / Login (${users})`,
          question: `Coba masuk dengan email & password yang terdaftar. Apakah proses masuk instan, menampilkan indikator loading saat memverifikasi, dan langsung mengarahkan ke dashboard?`,
          suggestion: `Tolong optimalkan alur login pada ${name} dengan state loading indikator tombol dan redirect otomatis ke halaman utama setelah login berhasil.`
        },
        {
          feature: `Pesan Kesalahan Login Tidak Valid`,
          question: `Masukkan password yang salah atau email yang belum terdaftar. Apakah muncul pesan kesalahan yang jelas dan sopan tanpa membuat aplikasi hang/freeze?`,
          suggestion: `Tolong buatkan pesan feedback kesalahan login yang jelas pada ${name}, misalnya 'Email atau kata sandi tidak cocok. Silakan coba lagi.'`
        },
        {
          feature: `Pemberian Hak Akses (Role Permission)`,
          question: `Uji akses pengguna biasa vs admin. Apakah halaman sensitif (seperti konfigurasi sistem atau manajemen data akun) terlindungi dan tidak bisa dibuka sembarang orang?`,
          suggestion: `Tolong perkuat role-based access control (RBAC) pada ${name} agar pengguna non-admin diblokir secara otomatis dari menu manajemen sensitif.`
        },
        {
          feature: `Pengubahan Profil & Ganti Kata Sandi`,
          question: `Buka pengaturan profil Anda di pojok kanan atas, coba ubah nama dan kata sandi baru. Apakah perubahan langsung tersimpan dan berlaku untuk sesi login berikutnya?`,
          suggestion: `Tolong lengkapi fitur update profile dan reset password di modal profil ${name} agar pengguna dapat memperbarui identitas mereka kapan saja.`
        },
        {
          feature: `Alur Keluar Akun (Logout Aman)`,
          question: `Tekan tombol 'Keluar' (Logout). Apakah sesi Anda langsung terhapus, diarahkan ke halaman login, dan tombol 'Back' browser tidak menampilkan data pribadi Anda lagi?`,
          suggestion: `Tolong pastikan fungsi logout pada ${name} membersihkan state/token sesi saat ini dan mengalihkan halaman ke tampilan login secara aman.`
        }
      ]
    },

    // 4. Alur Kerja & Fitur Utama (16-20)
    {
      category: 'Alur Fitur Utama',
      items: [
        {
          feature: `Solusi Masalah Utama: ${prob}`,
          question: `Lakukan alur utama dari awal sampai selesai untuk mengatasi '${prob}'. Apakah alur ini terasa mudah dan tidak membutuhkan langkah berbelit-belit?`,
          suggestion: `Tolong sederhanakan langkah pengguna pada alur kerja utama ${name} agar masalah '${prob}' dapat diselesaikan hanya dalam 2-3 langkah praktis.`
        },
        {
          feature: `Alur Kerja Modul ${getModule(1)}`,
          question: `Gunakan fitur pada modul ${getModule(1)}. Apakah seluruh tombol fungsi menghasilkan output yang tepat sesuai dengan jenis ${type}?`,
          suggestion: `Tolong perbaiki fungsionalitas logika pada modul ${getModule(1)} di ${name} agar menghasilkan kalkulasi dan output data yang akurat.`
        },
        {
          feature: `Status Kosong Awal (Empty State Handling)`,
          question: `Buka modul ${getModule(1)} saat belum ada data sama sekali. Apakah muncul ilustrasi ramah dan tombol panduan untuk mulai membuat data pertama kali?`,
          suggestion: `Tolong tambahkan empty state visual yang informatif dan tombol call-to-action (CTA) saat daftar data ${getModule(1)} pada ${name} masih kosong.`
        },
        {
          feature: `Umpan Balik Sukses Aksi (Success Toast)`,
          question: `Selesaikan satu tugas utama di ${name}. Apakah aplikasi memunculkan notifikasi atau pesan konfirmasi berhasil yang menarik di layar?`,
          suggestion: `Tolong tambahkan toast notification atau feedback visual centang hijau saat pengguna berhasil menyelesaikan aksi pada ${name}.`
        },
        {
          feature: `Penyimpanan Data Berkelanjutan (Data Persistence)`,
          question: `Setelah mengisi data di ${name}, refresh browser (tekan F5). Apakah data yang baru saja Anda kerjakan tetap ada dan tidak hilang seketika?`,
          suggestion: `Tolong simpan state data ${name} ke local persistence (localStorage / database) agar data pengguna tidak hilang saat halaman di-refresh.`
        }
      ]
    },

    // 5. Manajemen Data & CRUD (21-25)
    {
      category: 'Manajemen Data & CRUD',
      items: [
        {
          feature: `Penambahan Data Baru di ${getModule(2)}`,
          question: `Isi formulir tambah data baru di ${getModule(2)} lalu simpan. Apakah item baru langsung muncul di baris paling atas tabel tanpa perlu refresh halaman?`,
          suggestion: `Tolong implementasikan state management reaktif pada penambahan data di ${getModule(2)} ${name} agar tabel langsung memperbarui tampilannya.`
        },
        {
          feature: `Pengeditan Data yang Sudah Ada`,
          question: `Klik ikon edit (pensil) pada salah satu data di ${getModule(2)}, ubah sebagian teks lalu simpan. Apakah perubahan langsung tercermin secara akurat?`,
          suggestion: `Tolong buatkan modal atau inline-editor untuk mengubah data di modul ${getModule(2)} pada ${name} dengan validasi form sebelum disimpan.`
        },
        {
          feature: `Dialog Konfirmasi Penghapusan Data`,
          question: `Tekan tombol hapus (ikon tempat sampah) pada sebuah data. Apakah muncul dialog konfirmasi pencegah kecelakaan ('Yakin ingin menghapus?') sebelum data benar-benar dihapus?`,
          suggestion: `Tolong tambahkan modal konfirmasi penghapusan dengan tombol Batal dan Hapus pada ${name} guna mencegah penghapusan data secara tidak sengaja.`
        },
        {
          feature: `Pencegahan Data Duplikat`,
          question: `Coba masukkan data dengan nomor/ID atau nama yang persis sama. Apakah sistem memberikan peringatan bahwa data tersebut sudah terdaftar?`,
          suggestion: `Tolong tambahkan pengecekan validasi duplikasi data unik pada ${name} sebelum data baru disimpan ke koleksi.`
        },
        {
          feature: `Ketahanan Data Saat Banyak Item (Pagination / Infinite Scroll)`,
          question: `Jika ada lebih dari 20 item data di modul ${getModule(2)}, apakah daftar membagi halaman (pagination) atau menyediakan scroll rapi tanpa membuat layar browser lambat?`,
          suggestion: `Tolong implementasikan pagination halaman (10 per halaman) atau scroll list yang ringan pada tabel data modul ${getModule(2)} di ${name}.`
        }
      ]
    },

    // 6. Formulir & Validasi Input (26-30)
    {
      category: 'Formulir & Validasi',
      items: [
        {
          feature: `Peringatan Kolom Wajib (Required Fields)`,
          question: `Coba tekan tombol 'Simpan' atau 'Kirim' saat kolom-kolom penting masih kosong. Apakah muncul garis merah dan peringatan jelas bahwa kolom tersebut wajib diisi?`,
          suggestion: `Tolong terapkan validasi 'field wajib diisi' pada seluruh formulir input ${name} dengan indikator border merah dan pesan bantuan di bawah kolom input.`
        },
        {
          feature: `Validasi Format Email & Nomor HP`,
          question: `Ketikkan format email tidak wajar (misal: 'nama@') atau nomor telepon bersimbol aneh. Apakah sistem mendeteksi dan meminta format yang benar?`,
          suggestion: `Tolong tambahkan regex validasi format email dan nomor telepon standar Indonesia (08...) pada form input ${name}.`
        },
        {
          feature: `Format Angka & Mata Uang (${curr})`,
          question: `Masukkan nilai harga atau angka keuangan. Apakah angka otomatis diformat dengan tanda titik ribuan (misal: Rp 150.000) agar mudah dibaca?`,
          suggestion: `Tolong tambahkan formatting otomatis pemisah ribuan (Intl.NumberFormat dalam mata uang ${curr}) pada input dan tampilan nominal angka di ${name}.`
        },
        {
          feature: `Pembersihan Spasi Kosong (Auto Trim Input)`,
          question: `Coba ketikkan kata dengan spasi berlebih di awal atau akhir kata. Apakah sistem secara otomatis merapikan (trim) teks tersebut saat disimpan?`,
          suggestion: `Tolong tambahkan fungsi .trim() pada seluruh pengolahan form input di ${name} sebelum data divalidasi dan disimpan.`
        },
        {
          feature: `Tombol Reset / Batalkan Input`,
          question: `Ketik data di formulir lalu klik tombol 'Batal'. Apakah kolom input kembali bersih atau modal tertutup tanpa mengubah data yang lama?`,
          suggestion: `Tolong pastikan tombol Batal pada formulir ${name} me-reset state input ke nilai awal tanpa meninggalkan sisa ketikan sementara.`
        }
      ]
    },

    // 7. Pencarian, Filter & Sorting (31-35)
    {
      category: 'Pencarian & Filter',
      items: [
        {
          feature: `Pencarian Instan (Instant Search) di ${getModule(0)}`,
          question: `Ketikkan beberapa huruf nama data di kolom pencarian. Apakah hasil pencarian menyaring item yang cocok secara seketika dalam hitungan milidetik?`,
          suggestion: `Tolong tambahkan fitur client-side search filter reaktif dengan debounce pada modul ${getModule(0)} di ${name} agar pencarian terasa cepat.`
        },
        {
          feature: `Pencarian Huruf Besar / Kecil (Case Insensitive)`,
          question: `Coba cari dengan huruf KAPITAL dan huruf kecil. Apakah hasil yang muncul tetap sama tanpa terpengaruh huruf besar atau kecil?`,
          suggestion: `Tolong pastikan algoritma pencarian teks pada ${name} menggunakan .toLowerCase() agar pencarian tidak sensitif terhadap huruf besar/kecil.`
        },
        {
          feature: `Filter Kategori / Status`,
          question: `Pilih filter berdasarkan status (misal: Selesai / Belum, atau Kategori Tertentu). Apakah hanya data yang sesuai dengan filter yang ditampilkan?`,
          suggestion: `Tolong sediakan dropdown atau pill button filter kategori/status data pada tabel ${name} agar pengguna mudah mengelompokkan data.`
        },
        {
          feature: `Pengurutan Data (Sorting Berdasarkan Waktu / Nama)`,
          question: `Klik opsi urutkan data (Terbaru, Terlama, A-Z). Apakah susunan item langsung berubah urutannya secara tepat?`,
          suggestion: `Tolong tambahkan opsi sorting (Terbaru ke Terlama, Abjad A-Z) pada daftar data ${name} dengan icon panah indikator urutan.`
        },
        {
          feature: `Pesan 'Data Tidak Ditemukan' Saat Hasil Nihil`,
          question: `Ketikkan kata kunci acak yang pasti tidak ada datanya di pencarian. Apakah muncul pesan bersahabat seperti 'Tidak ada hasil untuk pencarian ini'?`,
          suggestion: `Tolong tambahkan tampilan 'Hasil Pencarian Kosong' dengan saran kata kunci alternatif pada daftar data ${name}.`
        }
      ]
    },

    // 8. Notifikasi, Feedback & Dialog (36-40)
    {
      category: 'Notifikasi & Feedback',
      items: [
        {
          feature: `Durasi Notifikasi Toast yang Ideal`,
          question: `Ketika notifikasi toast muncul di layar, apakah notifikasi tersebut hilang otomatis setelah 3-4 detik dan menyediakan tombol tutup manual (X)?`,
          suggestion: `Tolong atur timeout toast notification pada ${name} sekitar 3500ms serta sertakan ikon silang (X) agar pengguna bisa menutupnya secara manual.`
        },
        {
          feature: `Status Loading Tombol (Disabled on Submit)`,
          question: `Klik tombol simpan atau eksekusi. Apakah tombol otomatis nonaktif (disabled) dan menampilkan animasi mutar (spinner) agar pengguna tidak klik ganda (double-click)?`,
          suggestion: `Tolong pasang status disabled dan loading spinner pada tombol submit di ${name} selama proses penyimpanan data berlangsung.`
        },
        {
          feature: `Modal Dialog & Penutupan via Tombol Escape`,
          question: `Buka jendela modal (pop-up) apa saja di aplikasi, lalu tekan tombol 'ESC' di keyboard Anda. Apakah modal langsung tertutup?`,
          suggestion: `Tolong tambahkan event listener tombol 'Escape' (key === 'Escape') pada seluruh komponen modal di ${name} untuk meningkatkan aksesibilitas.`
        },
        {
          feature: `Fokus Keyboard pada Input Pertama (Auto-Focus)`,
          question: `Saat modal formulir dibuka, apakah kursor keyboard langsung aktif di kolom input pertama tanpa harus diklik manual terlebih dahulu?`,
          suggestion: `Tolong tambahkan atribut autoFocus pada input pertama di setiap form/modal ${name} agar pengguna bisa langsung mengetik cepat.`
        },
        {
          feature: `Salin Data ke Clipboard Berhasil`,
          question: `Klik tombol salin/copy pada teks atau prompt. Apakah muncul indikator 'Tersalin!' atau centang hijau yang meyakinkan pengguna bahwa teks sudah disalin?`,
          suggestion: `Tolong tambahkan feedback visual tooltip atau teks 'Tersalin!' selama 2 detik saat tombol copy di ${name} ditekan.`
        }
      ]
    },

    // 9. Kecepatan, Performa & Transisi (41-45)
    {
      category: 'Performa & Kecepatan',
      items: [
        {
          feature: `Kecepatan Muat Awal (Initial Page Load)`,
          question: `Buka aplikasi di tab penyamaran (incognito). Apakah aplikasi terbuka dalam waktu kurang dari 2 detik tanpa ada jeda layar putih yang lama?`,
          suggestion: `Tolong optimalkan bundle size dan hilangkan dependency yang tidak terpakai pada ${name} agar waktu muat awal aplikasi sangat instan.`
        },
        {
          feature: `Kelancaran Animasi & Transisi (60 FPS)`,
          question: `Perhatikan animasi saat beralih tab atau membuka accordion. Apakah animasi berjalan mulus tanpa patah-patah (stuttering)?`,
          suggestion: `Tolong gunakan CSS transitions berbasis transform & opacity yang diakselerasi hardware pada komponen ${name} agar animasi berjalan 60 FPS.`
        },
        {
          feature: `Ukuran Aset Gambar & Ikon Ringan`,
          question: `Periksa logo dan gambar di aplikasi. Apakah semua gambar termuat tajam dan berukuran ringan (format WebP/SVG) sehingga hemat kuota internet?`,
          suggestion: `Tolong pastikan semua ikon dan gambar pada ${name} menggunakan format SVG atau WebP terkompresi tanpa membebani bandwidth jaringan pengguna.`
        },
        {
          feature: `Bebas dari Pesan Error Konsol Merah (Console Error-Free)`,
          question: `Buka Developer Tools (tekan F12) lalu klik tab Console. Lakukan interaksi di aplikasi. Apakah konsol bersih dari pesan error merah (unhandled exceptions)?`,
          suggestion: `Tolong periksa dan hilangkan semua peringatan (warnings) dan error merah di console browser pada ${name}.`
        },
        {
          feature: `Penggunaan Memori yang Efisien (No Memory Leaks)`,
          question: `Gunakan aplikasi selama beberapa menit dan buka-tutup beberapa menu. Apakah aplikasi tetap terasa responsif dan browser tidak semakin berat?`,
          suggestion: `Tolong pastikan semua useEffect timer, interval, dan event listener pada komponen ${name} memiliki cleanup function agar tidak terjadi memory leak.`
        }
      ]
    },

    // 10. Keamanan, Penanganan Error & Ekspor (46-50)
    {
      category: 'Keamanan & Ekspor',
      items: [
        {
          feature: `Ekspor Data ke File Excel / Dokumen (${curr})`,
          question: `Coba klik tombol 'Export Excel' atau 'Download Dokumen'. Apakah file berhasil terunduh dengan ekstensi yang tepat dan data di dalamnya rapi?`,
          suggestion: `Tolong pastikan fitur export spreadsheet/file pada ${name} menyertakan header kolom yang jelas dan format data angka ${curr} yang rapi.`
        },
        {
          feature: `Ketahanan Input Simbol Khusus (Pencegahan XSS / Injection)`,
          question: `Coba masukkan teks yang mengandung tag HTML seperti <b>Tes</b> atau tanda petik satu/dua. Apakah sistem menampilkan teks murni tanpa merusak tampilan layout?`,
          suggestion: `Tolong pastikan sanitasi string input pada ${name} aktif sehingga karakter HTML tidak dieksekusi sebagai script berbahaya.`
        },
        {
          feature: `Penanganan Koneksi Internet Terputus (Offline Resilience)`,
          question: `Matikan koneksi internet sebentar lalu gunakan aplikasi. Apakah aplikasi tetap bisa dibuka dan menampilkan pesan ramah tanpa crash total?`,
          suggestion: `Tolong tambahkan graceful offline notification pada ${name} jika koneksi internet pengguna terputus saat mengakses fitur jaringan.`
        },
        {
          feature: `Keamanan Penyimpanan Data Sensitif`,
          question: `Periksa data yang disimpan di browser. Apakah kata sandi atau kunci otorisasi pribadi tidak ditampilkan dalam teks terbuka di log publik?`,
          suggestion: `Tolong pastikan informasi credential rahasia di ${name} tidak pernah dicatat ke console.log atau diekspos ke antarmuka umum.`
        },
        {
          feature: `Kompatibilitas Lintas Peramban (Chrome, Edge, Safari, Firefox)`,
          question: `Uji membuka ${name} di minimal dua peramban web berbeda (misal Chrome dan Safari/Firefox). Apakah semua fungsi dan tampilan bekerja secara identik?`,
          suggestion: `Tolong pastikan CSS dan fungsi JavaScript pada ${name} kompatibel secara konsisten di semua modern browser utama (Chrome, Safari, Firefox, Edge).`
        }
      ]
    }
  ];

  let idCounter = 1;
  const allItems: ChecklistItem[] = [];

  for (const cat of categoryTemplates) {
    for (const item of cat.items) {
      allItems.push({
        id: idCounter++,
        category: cat.category,
        feature: item.feature,
        question: item.question,
        suggestion: item.suggestion,
        completed: false,
        notes: ''
      });
    }
  }

  // Ensure exactly 50 items
  return allItems.slice(0, 50);
}
