import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Lock, Key, Eye, EyeOff, Wifi,
  Smartphone, UserCheck, MessageSquareWarning, Footprints, CreditCard,
  BookOpen, Video, Gamepad2, Trophy, User, Home, Play, CheckCircle2,
  XCircle, ArrowRight, ArrowLeft, RotateCcw, Award, Zap, Sparkles, Search,
  ChevronRight, AlertTriangle, Check, Terminal, Flame, Layers, BarChart3,
  Clock, Menu, X, ExternalLink, Tv, Compass, DoorOpen, HelpCircle,
  Calendar, FileCheck, Printer, Target, Mail, Link2, AlertOctagon, Info
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

// ============================================================================
// 1. INITIAL STATE & GAMIFICATION BADGES
// ============================================================================
const INITIAL_USER_STATE = {
  id: '',
  hasOnboarded: false,
  name: '',
  avatar: '🛡️',
  xp: 0,
  completedModules: [],
  moduleQuizPassed: [],
  watchedVideos: [],
  videoQuizPassed: [],
  completedPhishingSim: [],
  escapeRoomProgress: {
    unlockedLevel: 1,
    completedLevels: [],
    bestTimes: {}
  },
  dailyChallengeCompletedDates: [],
  preTestScore: null,
  postTestScore: null,
  lastAssessmentBreakdown: null,
  certificateNumber: null,
  certificateDate: null,
  history: []
};

const ACHIEVEMENT_BADGES = [
  {
    id: 'cyber-beginner',
    name: 'Cyber Beginner',
    icon: '🌱',
    description: 'Menyelesaikan modul pembelajaran pertama atau memulai perjalanan keamanan digital.',
    check: (u) => u.completedModules.length >= 1 || u.xp >= 50
  },
  {
    id: 'password-guardian',
    name: 'Password Guardian',
    icon: '🔐',
    description: 'Menguasai modul Password Security dan lolos Level 1 Cyber Escape Room.',
    check: (u) => u.completedModules.includes(2) && u.escapeRoomProgress.completedLevels.includes(1)
  },
  {
    id: 'phishing-detective',
    name: 'Phishing Detective',
    icon: '🕵️',
    description: 'Menyelesaikan minimal 4 kasus di Phishing Simulator dan modul Phishing.',
    check: (u) => u.completedModules.includes(3) && u.completedPhishingSim.length >= 4
  },
  {
    id: 'privacy-protector',
    name: 'Privacy Protector',
    icon: '🛡️',
    description: 'Menyelesaikan modul Keamanan Media Sosial & Perlindungan Data Pribadi.',
    check: (u) => u.completedModules.includes(5) && u.completedModules.includes(6)
  },
  {
    id: 'escape-master',
    name: 'Escape Room Master',
    icon: '🗝️',
    description: 'Berhasil keluar dari seluruh 5 ruangan di Cyber Escape Room.',
    check: (u) => u.escapeRoomProgress.completedLevels.length >= 5
  },
  {
    id: 'cyber-expert',
    name: 'Cyber Expert',
    icon: '👑',
    description: 'Menyelesaikan seluruh 11 modul pembelajaran dan meraih skor evaluasi ≥ 80%.',
    check: (u) => u.completedModules.length >= 11 && (u.postTestScore ?? 0) >= 80
  }
];

// ============================================================================
// 2. 11 LEARNING MODULES (BEGINNER, INTERMEDIATE, ADVANCED)
// ============================================================================
const LEARNING_MODULES = [
  {
    id: 1,
    level: 'Beginner',
    category: 'Safe Browsing',
    title: 'Pengenalan Digital Security',
    duration: '5 Menit',
    icon: Shield,
    color: 'from-cyan-500 to-blue-600',
    description: 'Memahami fondasi keamanan siber, mengapa pelajar menjadi sasaran empuk peretas, dan prinsip dasar melindungi diri.',
    objectives: [
      'Menjelaskan pengertian Digital Security dalam kehidupan sehari-hari.',
      'Mengidentifikasi 3 pilar keamanan informasi (CIA Triad).',
      'Menerapkan kebiasaan aman dasar saat memakai ponsel dan laptop.'
    ],
    sections: [
      {
        heading: 'Apa Itu Digital Security?',
        body: 'Digital Security (Keamanan Digital) adalah rangkaian langkah perlindungan untuk menjaga identitas, akun online, perangkat, dan data pribadi dari pencurian maupun penyalahgunaan di internet.'
      },
      {
        heading: 'Mengapa Siswa SMP & SMA Sering Diincar?',
        body: 'Pelajar aktif memakai media sosial, game online, dan e-wallet setiap hari. Pelaku kejahatan siber sering menargetkan akun pelajar untuk mencuri item game, membajak akun WhatsApp/Instagram, lalu menipu kontak teman korban.'
      },
      {
        heading: 'Tiga Pilar Keamanan (CIA Triad)',
        body: '1) Confidentiality (Kerahasiaan): data hanya boleh diakses pemiliknya. 2) Integrity (Keutuhan): data tidak diubah pihak tak berwenang. 3) Availability (Ketersediaan): sistem selalu siap digunakan saat dibutuhkan.'
      }
    ],
    caseExample: 'Kasus Nyata: Akun Instagram seorang siswa SMA diambil alih setelah login di situs generator followers gratis. Pelaku kemudian mengirim DM pinjam uang kepada teman-teman sekelasnya.',
    keyTakeaways: [
      'Perlakukan data pribadi seperti kunci rumah: jangan dibagikan sembarangan.',
      'Selalu perbarui aplikasi dan sistem operasi untuk menambal celah keamanan.',
      'Waspadai tawaran gratis yang terdengar terlalu menggiurkan.'
    ],
    miniQuiz: {
      question: 'Pilar keamanan informasi yang memastikan data pribadi hanya dapat diakses oleh pihak yang berhak disebut...',
      options: ['Availability', 'Confidentiality (Kerahasiaan)', 'Publicity'],
      answer: 1,
      explanation: 'Confidentiality berarti menjaga kerahasiaan informasi agar tidak jatuh ke tangan orang yang tidak berwenang.'
    }
  },
  {
    id: 2,
    level: 'Beginner',
    category: 'Password Security',
    title: 'Password Security',
    duration: '6 Menit',
    icon: Key,
    color: 'from-emerald-500 to-teal-600',
    description: 'Cara menyusun kata sandi kuat menggunakan teknik passphrase dan mengamankannya dengan Password Manager.',
    objectives: [
      'Mengenali kelemahan kata sandi pendek dan pola tanggal lahir.',
      'Menerapkan rumus Passphrase minimal 12 karakter.',
      'Memahami pentingnya membedakan kata sandi antar akun penting.'
    ],
    sections: [
      {
        heading: 'Mengapa Password Umum Mudah Dibobol?',
        body: 'Komputer modern dapat menebak jutaan kombinasi per detik (serangan Brute-Force). Kata sandi seperti "12345678", nama hewan peliharaan, atau tanggal lahir dapat ditembus dalam hitungan detik.'
      },
      {
        heading: 'Teknik Passphrase Anti-Bobol',
        body: 'Gunakan kalimat unik minimal 12–16 karakter yang memadukan huruf besar, huruf kecil, angka, dan simbol. Contoh: "KucingOren#MakanBakso2026!" sangat kuat sekaligus mudah diingat.'
      },
      {
        heading: 'Hindari Daur Ulang Password',
        body: 'Jika satu situs game mengalami kebocoran data (data breach) dan kamu memakai password yang sama untuk email utama, peretas otomatis bisa menguasai seluruh akunmu.'
      }
    ],
    caseExample: 'Kasus Nyata: Peretas mencoba daftar kombinasi password yang bocor dari forum game ke akun email siswa (serangan Credential Stuffing) dan berhasil masuk karena sandinya sama.',
    keyTakeaways: [
      'Gunakan minimal 12 karakter kombinasi huruf kapital, huruf kecil, angka, dan simbol.',
      'Bedakan password email utama dengan akun hiburan atau game.',
      'Gunakan fitur Password Manager bawaan browser atau aplikasi terpercaya.'
    ],
    miniQuiz: {
      question: 'Manakah contoh kata sandi yang paling tahan terhadap serangan tebakan otomatis?',
      options: ['Andi2010', 'qwerty12345', 'SepedaBiru#KeSekolah2026!'],
      answer: 2,
      explanation: 'Passphrase panjang dengan campuran huruf besar, kecil, angka, dan simbol membutuhkan waktu ratusan tahun untuk ditebak.'
    }
  },
  {
    id: 3,
    level: 'Beginner',
    category: 'Phishing',
    title: 'Phishing & Social Engineering',
    duration: '7 Menit',
    icon: ShieldAlert,
    color: 'from-rose-500 to-orange-600',
    description: 'Membongkar trik manipulasi psikologis, tautan login palsu, dan modus file berbahaya berkedok kurir atau hadiah.',
    objectives: [
      'Membedakan pesan asli dengan upaya phishing.',
      'Mengenali taktik urgensi palsu dalam Social Engineering.',
      'Memeriksa keaslian domain tautan sebelum mengklik.'
    ],
    sections: [
      {
        heading: 'Apa Itu Social Engineering & Phishing?',
        body: 'Social Engineering adalah teknik memanipulasi emosi manusia (rasa panik, takut, atau tergiur hadiah) agar korban menyerahkan data rahasia secara sukarela. Phishing adalah penyamaran lewat pesan, email, atau situs tiruan.'
      },
      {
        heading: 'Modus Phishing Populer di Kalangan Pelajar',
        body: 'Waspadai DM peringatan hak cipta palsu di Instagram, link klaim skin/diamond game gratis, serta pesan WhatsApp berisi file berakhiran ".apk" berkedok undangan atau resi paket.'
      },
      {
        heading: 'Cara Mengecek Domain Palsu',
        body: 'Perhatikan alamat situs dengan teliti! Situs tiruan sering memakai ejaan mirip (typosquatting) seperti "instagran-verify.com" atau akhiran domain mencurigakan seperti ".xyz" dan ".top".'
      }
    ],
    caseExample: 'Kasus Nyata: Pesan WhatsApp dari nomor tak dikenal mengirim file "Surat_Tilang.apk". Saat diinstal, aplikasi meminta izin membaca SMS sehingga kode OTP bank korban dicuri.',
    keyTakeaways: [
      'Jangan pernah menginstal file .APK yang dikirim melalui chat pribadi.',
      'Periksa ejaan alamat URL di browser sebelum memasukkan akun dan sandi.',
      'Pihak resmi tidak pernah meminta password atau kode OTP melalui tautan chat.'
    ],
    miniQuiz: {
      question: 'Tanda paling jelas dari tautan situs phishing adalah...',
      options: [
        'Menggunakan ikon gembok HTTPS',
        'Ejaan domain dipelesetkan (misal paypa1-login.xyz) dan mendesak segera mengisi sandi',
        'Memiliki tampilan warna gelap'
      ],
      answer: 1,
      explanation: 'Pelaku phishing sering memelesetkan huruf domain resmi dan menciptakan rasa panik agar korban terburu-buru.'
    }
  },
  {
    id: 4,
    level: 'Intermediate',
    category: 'Safe Browsing',
    title: 'Malware & Virus Komputer',
    duration: '6 Menit',
    icon: Terminal,
    color: 'from-amber-500 to-red-600',
    description: 'Mengenal ancaman Trojan, Ransomware, dan Spyware yang bersembunyi di aplikasi bajakan maupun ekstensi ilegal.',
    objectives: [
      'Membedakan cara kerja Trojan, Spyware, dan Ransomware.',
      'Menghindari sumber unduhan berisiko tinggi (crack/cheat).',
      'Mengevaluasi izin akses aplikasi pada ponsel.'
    ],
    sections: [
      {
        heading: 'Jenis Malware yang Sering Menyerang',
        body: 'Trojan menyamar sebagai aplikasi normal (seperti mod/cheat game); Spyware diam-diam merekam aktivitas dan ketikan keyboard; Ransomware mengunci seluruh file dan meminta tebusan.'
      },
      {
        heading: 'Jalur Masuk Malware',
        body: 'Software bajakan (crack), situs streaming ilegal penuh pop-up palsu, dan aplikasi di luar toko resmi merupakan sumber utama infeksi malware pada laptop dan HP pelajar.'
      },
      {
        heading: 'Pencegahan Efektif',
        body: 'Unduh aplikasi hanya dari Google Play Store, Apple App Store, atau situs resmi pengembang. Aktifkan Windows Defender / Google Play Protect dan rutin cadangkan tugas sekolah ke cloud.'
      }
    ],
    caseExample: 'Kasus Nyata: Seorang siswa mengunduh program "Cheat Auto-Headshot.exe" dan mematikan antivirus sesuai instruksi video. Akibatnya seluruh file tugas di laptopnya terkunci Ransomware.',
    keyTakeaways: [
      'Hindari software bajakan (crack) dan alat cheat game online.',
      'Periksa izin aplikasi: aplikasi kalkulator tidak membutuhkan akses SMS atau kontak.',
      'Cadangkan (backup) file penting secara berkala.'
    ],
    miniQuiz: {
      question: 'Jenis malware yang menyamar sebagai aplikasi bermanfaat atau game gratis untuk menyusup ke perangkat adalah...',
      options: ['Firewall', 'Trojan Horse', 'Authenticator'],
      answer: 1,
      explanation: 'Seperti kisah kuda Troya, Trojan menyamar sebagai file atau aplikasi yang tampak berguna.'
    }
  },
  {
    id: 5,
    level: 'Beginner',
    category: 'Online Privacy',
    title: 'Keamanan Media Sosial',
    duration: '5 Menit',
    icon: UserCheck,
    color: 'from-purple-500 to-indigo-600',
    description: 'Mengatur privasi akun Instagram, TikTok, dan WhatsApp agar terlindung dari pembajakan dan penguntitan digital.',
    objectives: [
      'Mengurangi risiko oversharing informasi pribadi di media sosial.',
      'Mengonfigurasi pengaturan privasi akun remaja dengan tepat.',
      'Mendeteksi tanda-tanda pembajakan akun teman.'
    ],
    sections: [
      {
        heading: 'Bahaya Oversharing',
        body: 'Mengunggah foto seragam dengan nama sekolah terlihat jelas, kartu pelajar, tiket perjalanan, atau lokasi rumah secara langsung memudahkan orang asing melacakmu.'
      },
      {
        heading: 'Pengaturan Privasi yang Disarankan',
        body: 'Gunakan Private Account untuk membatasi pengikut, sembunyikan status online dan foto profil WhatsApp dari orang tak dikenal, serta matikan geotagging otomatis saat memposting foto.'
      },
      {
        heading: 'Waspada Akun Teman yang Dibajak',
        body: 'Jika akun teman tiba-tiba meminjam uang atau meminta kode verifikasi SMS, konfirmasi melalui panggilan telepon biasa sebelum merespons.'
      }
    ],
    caseExample: 'Kasus Nyata: Foto kartu pelajar yang diunggah ke Story digunakan pelaku penipuan untuk menyamar sebagai siswa tersebut saat menipu anggota grup hobi.',
    keyTakeaways: [
      'Jangan unggah kartu identitas, tiket perjalanan, atau lokasi rumah secara publik.',
      'Aktifkan PIN Verifikasi Dua Langkah 6 digit pada WhatsApp.',
      'Cek menu Perangkat Tertaut (Linked Devices) secara berkala.'
    ],
    miniQuiz: {
      question: 'Mengapa mengunggah foto tiket pesawat atau kartu pelajar ke media sosial publik berbahaya?',
      options: [
        'Membuat kualitas kamera menurun',
        'Menampilkan data pribadi sensitif (nama lengkap, jadwal, NISN/kode booking) yang dapat disalahgunakan',
        'Menghabiskan ruang penyimpanan ponsel'
      ],
      answer: 1,
      explanation: 'Informasi pada kartu identitas dan tiket dapat dipakai untuk pencurian identitas maupun pelacakan lokasi.'
    }
  },
  {
    id: 6,
    level: 'Intermediate',
    category: 'Online Privacy',
    title: 'Privasi & Perlindungan Data Pribadi',
    duration: '6 Menit',
    icon: Lock,
    color: 'from-blue-500 to-indigo-600',
    description: 'Memahami klasifikasi data pribadi sensitif, perlindungan hukum di Indonesia, dan prinsip minimasi data.',
    objectives: [
      'Membedakan data pribadi umum dan data pribadi spesifik/sensitif.',
      'Menerapkan prinsip minimasi data saat mengisi formulir online.',
      'Menghindari kuis media sosial yang memanen data pribadi.'
    ],
    sections: [
      {
        heading: 'Data Umum vs Data Spesifik',
        body: 'Data umum meliputi nama lengkap dan jenis kelamin. Data spesifik meliputi NIK, data biometrik (sidik jari/wajah), rekam medis, dan data keuangan yang wajib dilindungi ekstra ketat.'
      },
      {
        heading: 'Perlindungan Data di Indonesia',
        body: 'Indonesia memiliki Undang-Undang Perlindungan Data Pribadi (UU PDP) yang mengatur bahwa pengumpulan data pengguna harus mendapat persetujuan yang jelas dan sah.'
      },
      {
        heading: 'Prinsip Minimasi Data',
        body: 'Berikan hanya data yang benar-benar diperlukan. Jika sebuah kuis hiburan meminta tanggal lahir lengkap, nama ibu kandung, atau foto selfie KTP, segera tutup halaman tersebut.'
      }
    ],
    caseExample: 'Kasus Nyata: Kuis online bertema "Cek Karaktermu Berdasarkan Tanggal Lahir & Nama Hewan Pertama" digunakan untuk menebak jawaban pertanyaan keamanan (Security Questions) akun pengguna.',
    keyTakeaways: [
      'NIK, Kartu Pelajar, dan foto selfie memegang identitas tidak boleh dikirim ke pihak tak resmi.',
      'Pisahkan alamat email untuk akun penting dengan email untuk pendaftaran game/hiburan.',
      'Tinjau izin aplikasi sebelum menekan tombol "Izinkan Semua".'
    ],
    miniQuiz: {
      question: 'Manakah yang termasuk kategori Data Pribadi Spesifik/Sensitif?',
      options: ['Warna kesukaan', 'Data biometrik (sidik jari/wajah) dan NIK', 'Judul film favorit'],
      answer: 1,
      explanation: 'Data biometrik dan nomor identitas kependudukan bersifat unik dan tidak dapat diganti jika bocor.'
    }
  },
  {
    id: 7,
    level: 'Intermediate',
    category: 'Safe Browsing',
    title: 'Keamanan Jaringan & Wi-Fi',
    duration: '5 Menit',
    icon: Wifi,
    color: 'from-teal-500 to-cyan-600',
    description: 'Mengenali risiko penyadapan pada Wi-Fi publik gratis dan cara menjaga koneksi internet tetap terenkripsi.',
    objectives: [
      'Memahami ancaman Man-in-the-Middle dan Evil Twin pada Wi-Fi terbuka.',
      'Membedakan koneksi HTTP biasa dengan HTTPS terenkripsi.',
      'Menerapkan aturan aman saat mengakses internet di tempat umum.'
    ],
    sections: [
      {
        heading: 'Risiko Wi-Fi Publik Tanpa Password',
        body: 'Pada jaringan Wi-Fi terbuka di kafe, mal, atau stasiun, data yang dikirim tanpa enkripsi dapat diintip pengguna lain dalam jaringan yang sama melalui serangan Man-in-the-Middle.'
      },
      {
        heading: 'Hotspot Palsu (Evil Twin)',
        body: 'Peretas dapat membuat hotspot gratis bernama mirip lokasi asli, misalnya "Free_WiFi_Kafe", untuk mencegat seluruh lalu lintas internet perangkat yang terhubung.'
      },
      {
        heading: 'Kebiasaan Aman di Tempat Umum',
        body: 'Pastikan alamat web diawali HTTPS (ikon gembok), nonaktifkan fitur auto-connect Wi-Fi, dan gunakan paket data seluler saat membuka e-wallet atau mobile banking.'
      }
    ],
    caseExample: 'Kasus Nyata: Di bandara, muncul dua jaringan Wi-Fi gratis dengan nama hampir identik. Salah satunya merupakan hotspot jebakan untuk mencuri kredensial login email pengunjung.',
    keyTakeaways: [
      'Hindari transaksi keuangan atau login akun penting saat memakai Wi-Fi publik gratis.',
      'Pastikan browser menampilkan ikon gembok HTTPS.',
      'Matikan fitur sambung otomatis ke Wi-Fi terbuka di pengaturan ponsel.'
    ],
    miniQuiz: {
      question: 'Apa langkah paling bijak jika perlu melakukan pembayaran e-wallet saat berada di kafe?',
      options: [
        'Menggunakan Wi-Fi gratis kafe tanpa password',
        'Beralih sementara ke paket data seluler pribadi',
        'Meminjam hotspot orang asing di meja sebelah'
      ],
      answer: 1,
      explanation: 'Jaringan seluler pribadi jauh lebih aman dan terenkripsi dibanding Wi-Fi publik bersama.'
    }
  },
  {
    id: 8,
    level: 'Intermediate',
    category: 'Password Security',
    title: 'Two-Factor Authentication (2FA)',
    duration: '5 Menit',
    icon: Smartphone,
    color: 'from-violet-500 to-purple-600',
    description: 'Menambahkan lapisan kunci kedua dengan Authenticator dan menjaga kerahasiaan mutlak kode OTP.',
    objectives: [
      'Menjelaskan cara kerja autentikasi dua faktor (2FA).',
      'Membandingkan keamanan SMS OTP dengan aplikasi Authenticator.',
      'Memahami bahwa kode OTP tidak boleh dibagikan kepada siapa pun.'
    ],
    sections: [
      {
        heading: 'Mengapa Password Saja Tidak Cukup?',
        body: '2FA menambahkan verifikasi kedua setelah password: selain sesuatu yang kamu tahu (kata sandi), sistem meminta bukti sesuatu yang kamu miliki (ponsel atau kode Authenticator).'
      },
      {
        heading: 'Pilihan Metode 2FA',
        body: 'Aplikasi seperti Google Authenticator atau Microsoft Authenticator menghasilkan kode 6 digit baru setiap 30 detik secara offline, sehingga lebih aman daripada SMS OTP yang rawan disadap.'
      },
      {
        heading: 'Aturan Emas Kode OTP',
        body: 'Kode OTP adalah kunci masuk akunmu. Tidak ada petugas bank, admin media sosial, maupun kurir paket yang berhak meminta 6 digit kode OTP tersebut.'
      }
    ],
    caseExample: 'Kasus Nyata: Meskipun password email siswa sempat bocor dari situs lama, peretas gagal masuk karena akun tersebut sudah mengaktifkan aplikasi Google Authenticator.',
    keyTakeaways: [
      'Aktifkan 2FA di Email utama, Instagram, TikTok, WhatsApp, dan akun game.',
      'Simpan Backup Codes di tempat aman untuk keadaan darurat.',
      'Jangan pernah menyebutkan atau meneruskan kode OTP kepada siapa pun.'
    ],
    miniQuiz: {
      question: 'Jika seseorang menelepon mengaku dari pihak aplikasi dan meminta 6 digit kode SMS OTP yang baru masuk ke HP-mu, kamu harus...',
      options: [
        'Menyebutkannya agar akun segera diverifikasi',
        'Menolak tegas, menutup telepon, dan tidak membagikan kode OTP tersebut',
        'Mengirimkannya lewat chat saja'
      ],
      answer: 1,
      explanation: 'Kode OTP bersifat mutlak rahasia; membagikannya berarti menyerahkan kendali akun kepada penipu.'
    }
  },
  {
    id: 9,
    level: 'Beginner',
    category: 'Digital Footprint',
    title: 'Cyberbullying & Etika Digital',
    duration: '5 Menit',
    icon: MessageSquareWarning,
    color: 'from-pink-500 to-rose-600',
    description: 'Membangun empati di ruang digital, langkah menghadapi perundungan siber, dan melawan penyebaran hoaks.',
    objectives: [
      'Mengidentifikasi berbagai bentuk cyberbullying di media sosial dan game.',
      'Melakukan langkah tepat (simpan bukti, blokir, lapor) saat menghadapi perundungan.',
      'Menerapkan prinsip saring sebelum sharing untuk mencegah hoaks.'
    ],
    sections: [
      {
        heading: 'Bentuk-Bentuk Cyberbullying',
        body: 'Perundungan siber meliputi komentar menghina fisik, menyebar rumor atau foto memalukan tanpa izin, mengucilkan teman di grup chat, hingga ancaman pesan pribadi.'
      },
      {
        heading: 'Langkah Menghadapi Cyberbullying',
        body: 'Jangan terpancing membalas dengan kata kasar. Ambil tangkapan layar (screenshot) sebagai bukti, blokir akun pelaku, gunakan fitur Report platform, dan ceritakan kepada orang tua atau guru BK.'
      },
      {
        heading: 'Etika Digital & Anti-Hoaks',
        body: 'Gunakan prinsip THINK sebelum memposting: apakah unggahan ini True (Benar), Helpful (Bermanfaat), Inspiring (Menginspirasi), Necessary (Perlu), dan Kind (Santun)?'
      }
    ],
    caseExample: 'Kasus Nyata: Seorang siswa menyebarkan kabar bohong tentang penutupan sekolah di grup chat kelas. Setelah dicek di situs resmi sekolah, berita tersebut ternyata hoaks lama.',
    keyTakeaways: [
      'Ingat bahwa setiap akun di internet dikendalikan manusia dengan perasaan nyata.',
      'Simpan bukti screenshot sebelum memblokir pelaku cyberbullying.',
      'Verifikasi kebenaran berita melalui sumber resmi sebelum meneruskannya.'
    ],
    miniQuiz: {
      question: 'Langkah pertama yang paling tepat saat menerima komentar perundungan (cyberbullying) adalah...',
      options: [
        'Membalas dengan hinaan yang lebih keras',
        'Mengambil screenshot sebagai bukti, memblokir pelaku, dan melapor kepada orang dewasa/guru',
        'Menyebarkan nomor telepon pelaku ke publik'
      ],
      answer: 1,
      explanation: 'Dokumentasi bukti dan pelaporan resmi menghentikan perundungan tanpa menyeretmu ke pelanggaran baru.'
    }
  },
  {
    id: 10,
    level: 'Advanced',
    category: 'Digital Footprint',
    title: 'Digital Footprint (Jejak Digital)',
    duration: '5 Menit',
    icon: Footprints,
    color: 'from-amber-500 to-orange-600',
    description: 'Memahami sifat permanen jejak digital aktif maupun pasif serta dampaknya bagi masa depan pendidikan dan karier.',
    objectives: [
      'Membedakan jejak digital aktif dan jejak digital pasif.',
      'Mengevaluasi dampak unggahan masa sekolah terhadap reputasi masa depan.',
      'Membangun portofolio jejak digital positif sejak dini.'
    ],
    sections: [
      {
        heading: 'Jejak Digital Aktif vs Pasif',
        body: 'Jejak aktif adalah data yang sengaja kita unggah (foto, komentar, status). Jejak pasif adalah rekaman otomatis seperti alamat IP, riwayat pencarian, dan cookies situs web.'
      },
      {
        heading: 'Mengapa Jejak Digital Sulit Dihapus?',
        body: 'Konten yang sudah diunggah ke internet dapat disimpan, di-screenshot, atau diarsipkan orang lain dalam hitungan detik meskipun postingan aslinya sudah dihapus.'
      },
      {
        heading: 'Membangun Reputasi Positif',
        body: 'Banyak panitia beasiswa, universitas, dan perusahaan meninjau profil publik kandidatnya. Bagikan karya, prestasi lomba, tulisan bermanfaat, dan hobi positifmu!'
      }
    ],
    caseExample: 'Kasus Nyata: Seorang pelamar beasiswa gagal pada tahap akhir karena panitia menemukan komentar ujaran kebencian yang pernah ia tulis di akun publiknya dua tahun sebelumnya.',
    keyTakeaways: [
      'Berpikirlah dua kali sebelum menulis komentar di kolom publik.',
      'Lakukan pencarian namamu sendiri di mesin pencari untuk mengecek informasi publikmu.',
      'Gunakan media sosial untuk menampilkan karya dan prestasi positif.'
    ],
    miniQuiz: {
      question: 'Contoh dari Jejak Digital Pasif adalah...',
      options: [
        'Mengunggah foto liburan ke Instagram',
        'Riwayat pencarian dan cookies yang direkam otomatis oleh situs web',
        'Menulis komentar di video YouTube'
      ],
      answer: 1,
      explanation: 'Jejak digital pasif terekam secara otomatis di latar belakang tanpa kita unggah secara manual.'
    }
  },
  {
    id: 11,
    level: 'Advanced',
    category: 'Safe Browsing',
    title: 'Keamanan Transaksi Online',
    duration: '6 Menit',
    icon: CreditCard,
    color: 'from-emerald-500 to-cyan-600',
    description: 'Panduan berbelanja online, top-up game, dan bertransaksi menggunakan e-wallet serta QRIS secara aman.',
    objectives: [
      'Memanfaatkan sistem rekening bersama (escrow) pada marketplace resmi.',
      'Memverifikasi keaslian kode QRIS sebelum memasukkan PIN.',
      'Mendeteksi modus bukti transfer editan dalam jual beli online.'
    ],
    sections: [
      {
        heading: 'Belanja & Top-Up Game Aman',
        body: 'Selalu lakukan transaksi di dalam platform resmi yang menahan dana hingga barang diterima. Jangan tergiur ajakan transfer langsung ke rekening pribadi demi diskon tidak wajar.'
      },
      {
        heading: 'Keamanan E-Wallet & QRIS',
        body: 'Gunakan PIN unik yang tidak mudah ditebak (hindari 123456 atau tanggal lahir), aktifkan kunci biometrik, dan periksa nama penerima yang tampil saat memindai kode QRIS.'
      },
      {
        heading: 'Waspada Bukti Transfer Palsu',
        body: 'Jika menjual barang online, jangan hanya mempercayai gambar struk dari pembeli. Pastikan saldo benar-benar bertambah di riwayat mutasi aplikasi bank/e-wallet milikmu.'
      }
    ],
    caseExample: 'Kasus Nyata: Pembeli mengirim gambar bukti transfer editan dan mendesak penjual segera mengirim barang lewat ojek online. Setelah dicek di aplikasi bank, dana ternyata tidak pernah masuk.',
    keyTakeaways: [
      'Jangan pernah berpindah transaksi ke luar sistem resmi marketplace.',
      'Periksa nama merchant QRIS dan nominal sebelum menekan tombol bayar.',
      'Rahasiakan PIN e-wallet, kode CVV kartu, dan kode OTP transaksi.'
    ],
    miniQuiz: {
      question: 'Saat menjual barang online dan pembeli mengirim gambar struk transfer, langkah wajib sebelum mengirim barang adalah...',
      options: [
        'Langsung mengirim barang karena struk terlihat rapi',
        'Mengecek mutasi saldo masuk langsung di aplikasi perbankan/e-wallet pribadi',
        'Memberikan PIN akun agar pembeli mengecek sendiri'
      ],
      answer: 1,
      explanation: 'Gambar bukti transfer sangat mudah diedit; verifikasi mutasi di aplikasi resmi adalah satu-satunya bukti sah.'
    }
  }
];

// ============================================================================
// 3. CURATED EDUCATIONAL YOUTUBE VIDEOS + POST-VIDEO QUIZ
// ============================================================================
const EDUCATIONAL_VIDEOS = [
  {
    id: 'vid-1',
    moduleId: 1,
    difficulty: 'Beginner',
    topicCategory: 'Pengenalan Digital Security',
    title: 'Yuk Mengenal Apa Itu Keamanan Siber (Cyber Security)',
    channel: 'Rakhman dNet',
    duration: '10:59',
    youtubeId: 'IvBfxSJWx6A',
    youtubeUrl: 'https://www.youtube.com/watch?v=IvBfxSJWx6A',
    description: 'Penjelasan lengkap mengenai dasar-dasar cybersecurity, jenis ancaman di internet, dan langkah awal melindungi identitas digital pelajar.',
    quiz: {
      question: 'Apa tujuan utama mempelajari Digital Security sejak bangku sekolah?',
      options: [
        'Agar bisa meretas akun teman',
        'Melindungi identitas, akun, perangkat, dan data pribadi dari ancaman siber',
        'Supaya kuota internet tidak pernah habis'
      ],
      answer: 1
    }
  },
  {
    id: 'vid-2',
    moduleId: 2,
    difficulty: 'Beginner',
    topicCategory: 'Password Security',
    title: 'VISIDI #9: Cara Bikin Password yang Aman!',
    channel: 'Museum Sandi BSSN',
    duration: '03:28',
    youtubeId: 'hOp_OlheoMg',
    youtubeUrl: 'https://www.youtube.com/watch?v=hOp_OlheoMg',
    description: 'Panduan resmi dari Museum Sandi BSSN tentang cara menyusun kata sandi kuat yang sulit dibobol peretas namun tetap mudah diingat.',
    quiz: {
      question: 'Faktor apa yang paling berpengaruh membuat password sulit ditembus komputer peretas?',
      options: [
        'Panjang karakter (minimal 12+ karakter) dan keragaman kombinasi huruf, angka, simbol',
        'Menggunakan nama depan sendiri',
        'Memakai sandi yang sama di semua akun'
      ],
      answer: 0
    }
  },
  {
    id: 'vid-3',
    moduleId: 3,
    difficulty: 'Beginner',
    topicCategory: 'Phishing & Social Engineering',
    title: 'Phishing di Dunia Digital - Video Pembelajaran Informatika',
    channel: 'Syamsiah Firdaus',
    duration: '01:47',
    youtubeId: 'sp8g-rK_I8Y',
    youtubeUrl: 'https://www.youtube.com/watch?v=sp8g-rK_I8Y',
    description: 'Mengenal ciri-ciri tautan jebakan phishing, pesan penipuan, dan trik manipulasi psikologis yang sering menargetkan pelajar.',
    quiz: {
      question: 'Pelaku phishing biasanya memanipulasi korban dengan cara...',
      options: [
        'Menciptakan rasa panik, urgensi palsu, atau iming-iming hadiah besar',
        'Mengirim surat resmi melalui pos sekolah',
        'Memperbaiki perangkat korban secara gratis'
      ],
      answer: 0
    }
  },
  {
    id: 'vid-4',
    moduleId: 4,
    difficulty: 'Intermediate',
    topicCategory: 'Malware & Virus Komputer',
    title: 'Semua Jenis Cyber Attack & Malware Dijelaskan Secara Ringkas',
    channel: 'Sekilat Info',
    duration: '11:45',
    youtubeId: '3wPRo5nw82U',
    youtubeUrl: 'https://www.youtube.com/watch?v=3wPRo5nw82U',
    description: 'Memahami cara kerja virus, Trojan, Spyware, Ransomware, dan serangan siber lain yang sering menyusup lewat aplikasi ilegal.',
    quiz: {
      question: 'Malware yang mengunci seluruh file di komputer dan meminta uang tebusan disebut...',
      options: ['Ransomware', 'Adware', 'Cookies'],
      answer: 0
    }
  },
  {
    id: 'vid-5',
    moduleId: 5,
    difficulty: 'Beginner',
    topicCategory: 'Keamanan Media Sosial',
    title: 'Mengenal Empat Pilar Utama Literasi & Keamanan Digital',
    channel: 'kejarcita',
    duration: '05:56',
    youtubeId: 'ThCcmEbBLc8',
    youtubeUrl: 'https://www.youtube.com/watch?v=ThCcmEbBLc8',
    description: 'Panduan literasi dan keamanan bermedia sosial agar pelajar terhindar dari pembajakan akun dan bahaya oversharing.',
    quiz: {
      question: 'Kebiasaan membagikan informasi pribadi secara berlebihan di media sosial disebut...',
      options: ['Encryption', 'Oversharing', 'Backup'],
      answer: 1
    }
  },
  {
    id: 'vid-6',
    moduleId: 6,
    difficulty: 'Intermediate',
    topicCategory: 'Privasi & Perlindungan Data',
    title: 'Siberkreasi Talks: Menjaga Digital Safety & Data Pribadi',
    channel: 'Siberkreasi',
    duration: '05:28',
    youtubeId: 'KC6YkzVZSsk',
    youtubeUrl: 'https://www.youtube.com/watch?v=KC6YkzVZSsk',
    description: 'Edukasi dari gerakan nasional literasi digital Siberkreasi mengenai perlindungan data sensitif dan privasi akun.',
    quiz: {
      question: 'Apa yang harus dilakukan jika sebuah situs kuis hiburan meminta tanggal lahir lengkap dan foto kartu identitas?',
      options: [
        'Mengisinya agar mendapat hasil kuis',
        'Segera menutup halaman dan tidak memberikan data tersebut',
        'Membagikan tautannya ke grup keluarga'
      ],
      answer: 1
    }
  },
  {
    id: 'vid-7',
    moduleId: 7,
    difficulty: 'Intermediate',
    topicCategory: 'Keamanan Jaringan & Wi-Fi',
    title: 'Bahaya Menggunakan Wi-Fi Gratis di Tempat Umum',
    channel: 'CNN Indonesia',
    duration: '01:32',
    youtubeId: 'H4pB51pLhAA',
    youtubeUrl: 'https://www.youtube.com/watch?v=H4pB51pLhAA',
    description: 'Liputan edukasi mengenai risiko penyadapan data pada Wi-Fi publik terbuka dan langkah aman saat berselancar di tempat umum.',
    quiz: {
      question: 'Protokol situs web yang menandakan komunikasi data terenkripsi dengan aman adalah...',
      options: ['HTTP://', 'HTTPS:// (dengan ikon gembok)', 'FTP://'],
      answer: 1
    }
  },
  {
    id: 'vid-8',
    moduleId: 8,
    difficulty: 'Intermediate',
    topicCategory: 'Two-Factor Authentication (2FA)',
    title: 'Fitur 2FA (Two Factor Authentication) & Menjaga Kode OTP',
    channel: 'BaTii Kemenkeu',
    duration: '01:45',
    youtubeId: 'VcPcvj7DCXU',
    youtubeUrl: 'https://www.youtube.com/watch?v=VcPcvj7DCXU',
    description: 'Penjelasan singkat dan jelas tentang cara kerja lapisan keamanan ganda (2FA) untuk melindungi akun dari pembobolan.',
    quiz: {
      question: 'Mengapa aplikasi Authenticator lebih direkomendasikan daripada SMS OTP?',
      options: [
        'Karena kode Authenticator dihasilkan secara lokal di perangkat dan tidak mudah disadap lewat jaringan seluler',
        'Karena aplikasi Authenticator tidak butuh baterai',
        'Karena kode Authenticator berlaku selama 1 tahun'
      ],
      answer: 0
    }
  },
  {
    id: 'vid-9',
    moduleId: 9,
    difficulty: 'Beginner',
    topicCategory: 'Cyberbullying & Etika Digital',
    title: 'Cyberbullying & Dampak Sosial Informatika di Sekolah',
    channel: 'Cakap Informatika',
    duration: '07:55',
    youtubeId: 'G6wm9RITPA0',
    youtubeUrl: 'https://www.youtube.com/watch?v=G6wm9RITPA0',
    description: 'Materi Informatika SMP/SMA mengenai pencegahan cyberbullying, menyimpan bukti digital, dan membangun etika internet yang sehat.',
    quiz: {
      question: 'Dalam etika digital THINK, huruf "T" sebelum memposting sesuatu berarti...',
      options: ['Trendy (Populer)', 'True (Benar / Terverifikasi)', 'Tagged (Ditandai)'],
      answer: 1
    }
  },
  {
    id: 'vid-10',
    moduleId: 10,
    difficulty: 'Advanced',
    topicCategory: 'Digital Footprint',
    title: 'Bahaya Jejak Digital & Cara Mengelola Aktivitas Online',
    channel: 'Cyber Academy Indonesia',
    duration: '01:28',
    youtubeId: 'WDCfHSMdEaY',
    youtubeUrl: 'https://www.youtube.com/watch?v=WDCfHSMdEaY',
    description: 'Memahami bagaimana setiap unggahan dan komentar meninggalkan rekam jejak digital jangka panjang.',
    quiz: {
      question: 'Mengapa unggahan di internet tetap berisiko meski sudah dihapus beberapa menit kemudian?',
      options: [
        'Karena orang lain bisa saja sudah mengambil tangkapan layar (screenshot) atau menyimpannya',
        'Karena tombol hapus tidak pernah berfungsi',
        'Karena ponsel menyimpan semua video di kartu SIM'
      ],
      answer: 0
    }
  },
  {
    id: 'vid-11',
    moduleId: 11,
    difficulty: 'Advanced',
    topicCategory: 'Keamanan Transaksi Online',
    title: 'Jangan Tertipu! Perbedaan QRIS Bayar & Transaksi Digital Aman',
    channel: 'Yucata id',
    duration: '04:13',
    youtubeId: 'd2qtoY69984',
    youtubeUrl: 'https://www.youtube.com/watch?v=d2qtoY69984',
    description: 'Panduan menghindari modus penipuan transaksi QRIS, bukti transfer palsu, dan pencurian saldo e-wallet.',
    quiz: {
      question: 'Apa yang wajib diperiksa sebelum memasukkan PIN saat membayar menggunakan QRIS?',
      options: [
        'Nama merchant/penerima dan nominal pembayaran yang tampil di layar',
        'Warna bingkai poster QRIS',
        'Jenis font pada struk kertas'
      ],
      answer: 0
    }
  }
];

// ============================================================================
// 4. INTERACTIVE PHISHING SIMULATOR DATASET
// ============================================================================
const PHISHING_SIMULATIONS = [
  {
    id: 'sim-1',
    type: 'Email Resmi Peringatan Keamanan',
    sender: 'no-reply@accounts.google.com',
    subject: 'Peringatan keamanan: Login baru pada perangkat Windows',
    timestamp: 'Hari ini, 09:14 WIB',
    body: 'Halo, Akun Google Anda baru saja digunakan untuk masuk pada perangkat Windows baru di Jakarta. Jika ini adalah Anda, tidak ada tindakan yang diperlukan. Jika bukan Anda, buka aplikasi Google atau kunjungi myaccount.google.com secara langsung untuk memeriksa aktivitas keamanan.',
    linkPreview: 'myaccount.google.com (Domain Resmi Google)',
    isPhishing: false,
    xp: 35,
    explanation: 'Pesan ini AMAN (Asli). Alamat pengirim menggunakan domain resmi @accounts.google.com dan mengarahkan pengguna membuka halaman keamanan resmi tanpa meminta password lewat formulir mencurigakan.',
    indicators: [
      'Domain pengirim asli (@accounts.google.com).',
      'Tidak meminta kata sandi, PIN, atau kode OTP.',
      'Tidak menciptakan ancaman blokir dalam hitungan menit.'
    ],
    prevention: 'Tetap biasakan membuka pengaturan akun langsung melalui aplikasi resmi alih-alih mengklik tautan dari email.'
  },
  {
    id: 'sim-2',
    type: 'Pesan Penipuan Hadiah Kuota',
    sender: 'admin-promo@kuota-pelajar-gratis.xyz',
    subject: 'SELAMAT! Nomor Kamu Terpilih Mendapat Bantuan Kuota 50GB!',
    timestamp: 'Hari ini, 11:42 WIB',
    body: 'Selamat! Kamu terpilih sebagai penerima kuota belajar 50GB gratis. Segera klaim sebelum hangus dalam 15 menit dengan mengisi Nama Lengkap, NIK KTP, dan 6 digit kode OTP yang dikirim ke SMS kamu pada formulir di bawah ini.',
    linkPreview: 'http://klaim-kuota50gb-pelajar.xyz/form (Simulasi Aman - Nonaktif)',
    isPhishing: true,
    xp: 40,
    explanation: 'Pesan ini BERBAHAYA (Phishing Hadiah Palsu). Pelaku memancing korban dengan hadiah kuota besar agar menyerahkan NIK dan kode OTP SMS.',
    indicators: [
      'Menggunakan domain tidak resmi berakhiran ".xyz" dan protokol HTTP tanpa enkripsi.',
      'Meminta data sensitif (NIK) dan kode rahasia OTP.',
      'Memakai batas waktu mendesak (15 menit) agar korban panik.'
    ],
    prevention: 'Abaikan tawaran hadiah gratis dari pengirim tidak dikenal dan jangan pernah memberikan kode OTP kepada siapa pun.'
  },
  {
    id: 'sim-3',
    type: 'Pesan Pencurian Akun Media Sosial',
    sender: 'ig-copyright-support@verify-meta-help.top',
    subject: 'PERINGATAN HAK CIPTA: Akun Instagram Anda Akan Dihapus Permanen',
    timestamp: 'Kemarin, 20:05 WIB',
    body: 'Kami mendeteksi pelanggaran hak cipta pada unggahan Anda. Akun Anda dijadwalkan untuk dihapus dalam 12 jam. Jika Anda merasa ini kesalahan, ajukan banding sekarang dengan memasukkan username dan password akun Anda.',
    linkPreview: 'http://instagran-appeal-center.top/login (Simulasi Aman - Nonaktif)',
    isPhishing: true,
    xp: 40,
    explanation: 'Pesan ini BERBAHAYA (Phishing Pencurian Akun). Perhatikan ejaan URL "instagran" (huruf m diganti n) dan domain ".top".',
    indicators: [
      'Typosquatting pada URL ("instagran" bukan "instagram").',
      'Mengancam penghapusan akun dalam waktu singkat.',
      'Instagram asli memiliki menu "Email dari Instagram" di dalam aplikasi untuk mengecek keaslian pesan.'
    ],
    prevention: 'Selalu cek keaslian notifikasi Instagram langsung lewat Pengaturan > Keamanan > Email dari Instagram di aplikasi resmi.'
  },
  {
    id: 'sim-4',
    type: 'Pesan Palsu Mengatasnamakan Kurir / Lembaga',
    sender: '+62 812-XXXX-9910 (Nomor Tidak Dikenal)',
    subject: 'Lampiran WhatsApp: Resi_Pengiriman_Paket.apk (4.8 MB)',
    timestamp: 'Hari ini, 14:10 WIB',
    body: 'Permisi kak, paket atas nama kakak tertahan di gudang ekspedisi karena alamat kurang jelas. Silakan unduh dan instal aplikasi cek resi terlampir untuk konfirmasi alamat pengiriman.',
    linkPreview: 'Lampiran File: Resi_Pengiriman_Paket.apk (Simulasi Aman - Nonaktif)',
    isPhishing: true,
    xp: 45,
    explanation: 'Pesan ini BERBAHAYA (Malware Phishing APK). Kurir ekspedisi resmi tidak pernah mengirim file instalasi aplikasi (.apk) melalui chat WhatsApp.',
    indicators: [
      'Lampiran berformat ".apk" (installer aplikasi Android).',
      'Jika diinstal, aplikasi berbahaya ini meminta izin membaca SMS untuk mencuri kode OTP mobile banking/e-wallet.',
      'Dikirim dari nomor pribadi tanpa centang verifikasi resmi.'
    ],
    prevention: 'Jangan pernah mengunduh atau menginstal file .apk dari chat. Cek resi paket hanya melalui situs atau aplikasi resmi ekspedisi.'
  },
  {
    id: 'sim-5',
    type: 'Email Informasi Resmi Portal Pendidikan',
    sender: 'informasi@kemdikbud.go.id',
    subject: 'Jadwal Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK)',
    timestamp: '2 hari lalu',
    body: 'Yth. Bapak/Ibu Guru dan Peserta Didik, Informasi jadwal dan panduan teknis pelaksanaan Asesmen Nasional dapat diakses melalui laman resmi portal pendidikan atau koordinasi dengan proktor sekolah masing-masing.',
    linkPreview: 'https://anbk.kemdikbud.go.id (Domain Resmi Pemerintah .go.id)',
    isPhishing: false,
    xp: 35,
    explanation: 'Pesan ini AMAN (Asli). Pengirim menggunakan domain resmi pemerintah Indonesia (.go.id) yang terverifikasi dan tidak meminta informasi rahasia pribadi.',
    indicators: [
      'Domain resmi pemerintah ".go.id".',
      'Tidak meminta password, PIN, maupun kode OTP.',
      'Mengarahkan koordinasi melalui pihak sekolah resmi.'
    ],
    prevention: 'Selalu pastikan situs lembaga pemerintah Indonesia berakhiran ".go.id" dan lembaga pendidikan berakhiran ".sch.id" atau ".ac.id".'
  },
  {
    id: 'sim-6',
    type: 'Link Mencurigakan Top-Up Diamond Gratis',
    sender: 'GamerBot_Official (Komentar Video)',
    subject: 'Generator 10.000 Diamond Gratis Tanpa Top-Up!',
    timestamp: 'Hari ini, 16:30 WIB',
    body: 'Mau 10.000 Diamond gratis khusus hari ini? Cukup klik tautan di bawah, pilih jumlah diamond, lalu login menggunakan email dan kata sandi akun game utama kamu!',
    linkPreview: 'http://free-diamond-mlbb-ff2026.xyz (Simulasi Aman - Nonaktif)',
    isPhishing: true,
    xp: 40,
    explanation: 'Pesan ini BERBAHAYA (Phishing Akun Game). Tidak ada situs generator yang bisa menambahkan diamond secara gratis; formulir login tersebut dibuat untuk mencuri akun gamemu.',
    indicators: [
      'Menjanjikan item berbayar dalam jumlah besar secara gratis.',
      'Meminta username dan password akun game.',
      'Menggunakan domain tidak resmi ".xyz".'
    ],
    prevention: 'Lakukan pembelian item atau top-up game hanya melalui toko resmi di dalam aplikasi game atau mitra pembayaran terpercaya.'
  }
];

// ============================================================================
// 5. 5-LEVEL CYBER ESCAPE ROOM DATASET
// ============================================================================
const ESCAPE_ROOM_LEVELS = [
  {
    level: 1,
    roomName: 'Ruang 1: Brankas Kata Sandi (Password Security)',
    xp: 50,
    story: 'Pintu ruang server terkunci oleh sistem keamanan biometrik lama. Untuk membukanya, kamu harus menentukan konfigurasi kata sandi utama yang memenuhi standar keamanan tingkat tinggi.',
    puzzle: 'Terminal menampilkan 4 kandidat Master Password. Pilih satu-satunya kata sandi yang lolos seluruh aturan: minimal 12 karakter, tidak mengandung tanggal lahir, serta memiliki huruf besar, kecil, angka, dan simbol.',
    hint: 'Periksa panjang karakter setiap pilihan dan hindari pola berurutan seperti "1234" atau tahun lahir sederhana.',
    options: [
      'AdminServer2026',
      'P@ssw0rd123',
      'NagaBiru#TerbangTinggi2026!',
      '12345678901234'
    ],
    answer: 2,
    successExplanation: 'Brankas terbuka! "NagaBiru#TerbangTinggi2026!" memiliki 26 karakter dengan campuran lengkap huruf kapital, kecil, angka, dan simbol.'
  },
  {
    level: 2,
    roomName: 'Ruang 2: Gerbang Radar Phishing (Phishing Detection)',
    xp: 60,
    story: 'Alarm berbunyi! Sebuah email masuk mencoba menyusup ke jaringan sekolah untuk mencuri kredensial kepala laboratorium.',
    puzzle: 'Periksa header email berikut: Pengirim: "it-support@sekolah-nusantara.sch.id" | Tautan tombol login mengarah ke: "http://login-sekolah-nusantara.security-check.xyz". Apa tindakan tepat untuk membuka kunci pintu berikutnya?',
    hint: 'Bandingkan alamat pengirim yang tampak resmi dengan alamat tujuan tautan (link destination) yang sebenarnya.',
    options: [
      'Mengklik tautan tersebut karena nama pengirimnya memakai .sch.id',
      'Memblokir email dan melaporkan tautan karena domain tujuan aslinya adalah ".xyz" palsu',
      'Membalas email dengan menuliskan password admin laboratorium'
    ],
    answer: 1,
    successExplanation: 'Radar Phishing berhasil mencegat serangan! Peretas memalsukan nama tampilan pengirim (Email Spoofing), tetapi URL tujuan aslinya mengarah ke domain ".xyz".'
  },
  {
    level: 3,
    roomName: 'Ruang 3: Lab Manipulasi Psikologis (Social Engineering)',
    xp: 70,
    story: 'Telepon darurat di ruang kontrol berdering. Seseorang mengaku sebagai teknisi pusat meminta bantuanmu untuk memulihkan sistem.',
    puzzle: 'Penelepon berkata: "Halo Dek, saya dari tim pusat. Sistem sedang error, tolong sebutkan 6 digit kode OTP yang baru masuk ke SMS kamu supaya akun lab tidak terblokir!" Bagaimana responmu?',
    hint: 'Ingat aturan mutlak mengenai kode OTP (One-Time Password).',
    options: [
      'Menyebutkan kode OTP dengan cepat agar sistem tidak terblokir',
      'Menyebutkan 3 angka pertama saja untuk menguji penelepon',
      'Menolak memberikan kode OTP, menutup panggilan, dan melapor ke guru pembina'
    ],
    answer: 2,
    successExplanation: 'Manipulasi digagalkan! Tim teknis resmi tidak pernah meminta kode OTP pengguna melalui telepon maupun pesan.'
  },
  {
    level: 4,
    roomName: 'Ruang 4: Kubah Privasi Data (Privacy Protection)',
    xp: 80,
    story: 'Kamu menemukan tablet petugas yang tertinggal dengan layar formulir pendaftaran acara sekolah terbuka.',
    puzzle: 'Formulir acara ekstrakurikuler tersebut meminta: Nama Lengkap, Kelas, NISN, NIK KTP, Nama Ibu Kandung, dan Foto Selfie memegang Kartu Pelajar. Data mana saja yang SEHARUSNYA tidak diminta untuk sekadar pendaftaran ekstrakurikuler?',
    hint: 'Terapkan prinsip minimasi data: pendaftaran kegiatan sekolah tidak memerlukan identitas kependudukan sensitif.',
    options: [
      'Nama Lengkap dan Kelas',
      'NIK KTP, Nama Ibu Kandung, dan Foto Selfie Kartu Pelajar',
      'Pilihan ekstrakurikuler yang diminati'
    ],
    answer: 1,
    successExplanation: 'Kubah Privasi aman! Mengumpulkan NIK, nama ibu kandung, dan foto selfie identitas tanpa dasar yang sah melanggar prinsip minimasi data dan rawan penyalahgunaan.'
  },
  {
    level: 5,
    roomName: 'Ruang 5: Menara Jejak Digital (Digital Footprint)',
    xp: 100,
    story: 'Satu pintu terakhir menuju kebebasan! Sistem meminta audit unggahan media sosial sebelum membuka gerbang keluar.',
    puzzle: 'Seorang siswa hendak memposting foto tiket pesawat lengkap dengan kode booking (PNR) dan jadwal keberangkatan ke akun publiknya. Mengapa unggahan ini harus dibatalkan?',
    hint: 'Kode booking pada tiket penerbangan dapat digunakan orang lain untuk mengakses data penumpang.',
    options: [
      'Karena kode booking dan barcode tiket dapat dipindai pihak tidak bertanggung jawab untuk mengakses atau mengubah data perjalanan',
      'Karena foto tiket pesawat melanggar hak cipta kamera',
      'Karena unggahan tersebut akan menghapus seluruh kontak ponsel'
    ],
    answer: 0,
    successExplanation: 'SELAMAT! Kamu berhasil menyelesaikan seluruh 5 ruangan Cyber Escape Room dan membuktikan ketangguhan analisis keamanan sibermu!'
  }
];

// ============================================================================
// 6. COMPREHENSIVE QUIZ & CYBER SAFETY SCORE QUESTIONS
// ============================================================================
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    category: 'Password Security',
    moduleId: 2,
    question: 'Manakah kombinasi kata sandi yang paling aman untuk melindungi akun email utamamu?',
    options: [
      '1234567890',
      'Rizky2010',
      'SepedaBiru#MenujuSekolah2026!',
      'passwordku'
    ],
    answer: 2,
    explanation: 'Passphrase panjang (>12 karakter) dengan campuran huruf besar, kecil, angka, dan simbol jauh lebih kebal terhadap serangan brute-force.'
  },
  {
    id: 2,
    category: 'Phishing',
    moduleId: 3,
    question: 'Tindakan paling tepat saat menerima pesan WhatsApp berisi file "Undangan_Resmi.apk" dari nomor tak dikenal adalah...',
    options: [
      'Menginstal file tersebut untuk melihat isi undangan',
      'Mengabaikan, tidak mengunduh/menginstal, dan memblokir nomor pengirim',
      'Meneruskannya ke grup kelas agar teman lain mencoba',
      'Membalas pesan dengan mengirimkan foto KTP'
    ],
    answer: 1,
    explanation: 'File .apk dari luar toko resmi sering disisipi malware pencuri SMS OTP perbankan dan data kontak.'
  },
  {
    id: 3,
    category: 'Social Engineering',
    moduleId: 8,
    question: 'Seseorang mengaku sebagai admin hadiah game meminta 6 digit kode OTP yang masuk ke SMS kamu. Apa yang harus dilakukan?',
    options: [
      'Memberikan kode OTP agar hadiah segera cair',
      'Menolak tegas karena kode OTP adalah kunci rahasia untuk mengambil alih akunmu',
      'Memberikan kode OTP setelah mengganti foto profil',
      'Mengirimkan password akun game sekalian'
    ],
    answer: 1,
    explanation: 'Kode OTP bersifat mutlak rahasia dan tidak boleh dibagikan kepada siapa pun dengan alasan apa pun.'
  },
  {
    id: 4,
    category: 'Safe Browsing',
    moduleId: 7,
    question: 'Mengapa transaksi keuangan sebaiknya tidak dilakukan saat terhubung ke Wi-Fi publik gratis tanpa kata sandi?',
    options: [
      'Karena layar ponsel menjadi lebih redup',
      'Karena jaringan terbuka rentan terhadap penyadapan data (Man-in-the-Middle) oleh peretas di jaringan yang sama',
      'Karena aplikasi mobile banking akan terhapus otomatis',
      'Karena baterai ponsel cepat penuh'
    ],
    answer: 1,
    explanation: 'Wi-Fi publik tanpa enkripsi memungkinkan pihak lain di jaringan yang sama mengintip lalu lintas data yang tidak aman.'
  },
  {
    id: 5,
    category: 'Online Privacy',
    moduleId: 6,
    question: 'Manakah kebiasaan yang mencerminkan perlindungan privasi data pribadi yang baik di media sosial?',
    options: [
      'Mengunggah foto kartu pelajar dan alamat rumah secara publik',
      'Mengatur akun menjadi Private, menyembunyikan informasi sensitif, dan memeriksa izin aplikasi',
      'Mengisi seluruh formulir kuis online yang meminta NIK dan nama ibu kandung',
      'Membagikan lokasi rumah secara real-time setiap hari'
    ],
    answer: 1,
    explanation: 'Membatasi visibilitas profil dan tidak membagikan data sensitif melindungi diri dari pencurian identitas dan pelacakan.'
  },
  {
    id: 6,
    category: 'Digital Footprint',
    moduleId: 10,
    question: 'Apa pernyataan yang paling benar mengenai Jejak Digital (Digital Footprint)?',
    options: [
      'Semua unggahan dan komentar langsung hilang permanen dari internet begitu tombol hapus ditekan',
      'Aktivitas online meninggalkan rekam jejak jangka panjang yang dapat memengaruhi reputasi pendidikan maupun karier di masa depan',
      'Jejak digital hanya dimiliki oleh pembuat aplikasi',
      'Jejak digital adalah jumlah langkah kaki pada smartwatch'
    ],
    answer: 1,
    explanation: 'Konten di internet mudah di-screenshot atau diarsipkan orang lain, sehingga membangun jejak digital positif sejak sekolah sangat penting.'
  },
  {
    id: 7,
    category: 'Safe Browsing',
    moduleId: 4,
    question: 'Apa risiko utama mengunduh program "cheat game" atau software bajakan (crack) dari situs tidak resmi?',
    options: [
      'Kecepatan internet menjadi dua kali lipat',
      'Perangkat berisiko tinggi terinfeksi Trojan, Spyware, atau Ransomware yang mencuri data dan mengunci file',
      'Kapasitas hardisk bertambah besar',
      'Garansi laptop diperpanjang otomatis'
    ],
    answer: 1,
    explanation: 'Peretas sering menyisipkan malware berbahaya ke dalam file crack dan cheat game gratis.'
  },
  {
    id: 8,
    category: 'Digital Footprint',
    moduleId: 9,
    question: 'Jika kamu melihat atau mengalami cyberbullying di media sosial, langkah terbaik adalah...',
    options: [
      'Membalas dengan komentar penghinaan yang lebih kasar',
      'Mengambil screenshot sebagai bukti, memblokir akun pelaku, dan melapor ke platform serta orang tua/guru',
      'Menyebarkan alamat rumah pelaku ke internet',
      'Menghapus seluruh tugas sekolah di komputer'
    ],
    answer: 1,
    explanation: 'Menyimpan bukti tangkapan layar membantu proses pelaporan resmi tanpa memicu eskalasi konflik.'
  }
];

// ============================================================================
// 7. DAILY CYBER CHALLENGE DATASET (ROTATES BY REAL CALENDAR DATE)
// ============================================================================
const DAILY_CHALLENGES = [
  {
    id: 'dc-1',
    question: 'Kamu menemukan jaringan Wi-Fi gratis bernama "Kafe_Free_WiFi_5G" tanpa password, sementara kasir kafe menyebutkan nama Wi-Fi resmi kafe memiliki password. Manakah yang aman digunakan?',
    options: [
      'Gunakan "Kafe_Free_WiFi_5G" karena tidak perlu repot mengetik password',
      'Gunakan Wi-Fi resmi ber-password dari kasir kafe, atau gunakan paket data seluler pribadi',
      'Sambungkan ke keduanya secara bergantian'
    ],
    answer: 1,
    xp: 45,
    explanation: 'Wi-Fi terbuka dengan nama mirip tempat umum sering kali merupakan jebakan Evil Twin untuk menyadap data pengguna.'
  },
  {
    id: 'dc-2',
    question: 'Sebuah tautan bertuliskan "https://www.instagram-security-badge.xyz/claim" menawarkan centang biru gratis. Apakah tautan ini aman?',
    options: [
      'Aman karena diawali huruf https://',
      'Berbahaya! Domain aslinya adalah "instagram-security-badge.xyz", bukan milik resmi instagram.com',
      'Aman jika dibuka lewat mode penyamaran (Incognito)'
    ],
    answer: 1,
    xp: 45,
    explanation: 'HTTPS hanya mengenkripsi koneksi ke server tujuan; jika server tujuannya adalah situs penipu (.xyz), data yang kamu ketik tetap masuk ke tangan peretas!'
  },
  {
    id: 'dc-3',
    question: 'Teman sekelasmu mengirim DM: "Tolong fotoin kartu pelajar kamu dong, aku mau lihat nomor NISN-nya buat contoh tugas." Apakah aman mengirimkan foto kartu pelajar lewat chat?',
    options: [
      'Tidak disarankan mengirim foto kartu identitas utuh; konfirmasi langsung ke temanmu dan tutup/sensor informasi sensitif yang tidak diperlukan',
      'Langsung kirim foto bagian depan dan belakang kartu pelajar ke grup kelas',
      'Unggah foto kartu pelajar di kolom komentar publik'
    ],
    answer: 0,
    xp: 45,
    explanation: 'Kartu identitas berisi data pribadi penting yang dapat disalahgunakan jika tersebar atau jika akun temanmu sedang dibajak.'
  },
  {
    id: 'dc-4',
    question: 'Manakah password yang lebih aman untuk akun utama: "Budi12345" atau "ManggaHarum#Manis2026!"?',
    options: [
      '"Budi12345" karena singkat dan cepat diketik',
      '"ManggaHarum#Manis2026!" karena panjang (22 karakter) dan memadukan huruf besar, kecil, angka, serta simbol',
      'Keduanya sama-sama kuat'
    ],
    answer: 1,
    xp: 45,
    explanation: 'Panjang karakter dan kombinasi simbol membuat passphrase "ManggaHarum#Manis2026!" ribuan kali lebih sulit ditembus.'
  }
];

// ============================================================================
// 8. MAIN APPLICATION COMPONENT
// ============================================================================
const STORAGE_USER_KEY = 'cyberguard_user_v2';
const STORAGE_LB_KEY = 'cyberguard_local_lb_v2';

function readPersistentJSON(key, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback if localStorage is blocked in sandboxed preview
  }
  try {
    const sessRaw = window.sessionStorage.getItem(key);
    if (sessRaw) return JSON.parse(sessRaw);
  } catch {
    // Fallback if sessionStorage is blocked
  }
  try {
    if (window.name && window.name.startsWith('__DS_STATE__:')) {
      const bundle = JSON.parse(window.name.slice('__DS_STATE__:'.length));
      if (bundle && key in bundle) return bundle[key];
    }
  } catch {
    // Ignore parse error
  }
  return fallbackValue;
}

function writePersistentJSON(key, value) {
  const serialized = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, serialized);
  } catch {
    // Ignore if blocked
  }
  try {
    window.sessionStorage.setItem(key, serialized);
  } catch {
    // Ignore if blocked
  }
  try {
    let bundle = {};
    if (window.name && window.name.startsWith('__DS_STATE__:')) {
      bundle = JSON.parse(window.name.slice('__DS_STATE__:'.length)) || {};
    }
    bundle[key] = value;
    window.name = '__DS_STATE__:' + JSON.stringify(bundle);
  } catch {
    // Ignore if blocked
  }
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = readPersistentJSON(STORAGE_USER_KEY, null);
    if (saved && typeof saved === 'object') {
      const validName = typeof saved.name === 'string' ? saved.name.trim() : '';
      return {
        ...INITIAL_USER_STATE,
        ...saved,
        id: saved.id || (validName ? `usr_${validName.toLowerCase()}` : ''),
        name: validName,
        hasOnboarded: Boolean(validName.length >= 2),
        escapeRoomProgress: {
          ...INITIAL_USER_STATE.escapeRoomProgress,
          ...(saved.escapeRoomProgress || {})
        }
      };
    }
    return INITIAL_USER_STATE;
  });

  const [localLeaderboard, setLocalLeaderboard] = useState(() => {
    const savedLb = readPersistentJSON(STORAGE_LB_KEY, []);
    return Array.isArray(savedLb) ? savedLb : [];
  });

  // Welcome Onboarding States
  const [welcomeName, setWelcomeName] = useState('');
  const [welcomeAvatar, setWelcomeAvatar] = useState('🛡️');
  const [welcomeError, setWelcomeError] = useState('');

  // Navigation & Drawer States
  const [activeTab, setActiveTab] = useState('home'); // home, modules, videos, simulator, escaperoom, quiz, daily, achievements, progress
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Module States
  const [moduleLevelFilter, setModuleLevelFilter] = useState('ALL'); // ALL, Beginner, Intermediate, Advanced
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleSubTab, setModuleSubTab] = useState('read'); // read, video, quiz
  const [moduleQuizChoice, setModuleQuizChoice] = useState(null);

  // Video Learning States
  const [selectedVideoId, setSelectedVideoId] = useState(EDUCATIONAL_VIDEOS[0].id);
  const [videoSearch, setVideoSearch] = useState('');
  const [videoDiffFilter, setVideoDiffFilter] = useState('ALL');
  const [videoQuizChoice, setVideoQuizChoice] = useState(null);
  const [videoLoadWarning, setVideoLoadWarning] = useState(false);

  // Phishing Simulator States
  const [simIndex, setSimIndex] = useState(0);
  const [simAnswer, setSimAnswer] = useState(null); // true (phishing) | false (safe)
  const [simSessionScore, setSimSessionScore] = useState(0);

  // Cyber Escape Room States
  const [escapeLevel, setEscapeLevel] = useState(1);
  const [escapeChoice, setEscapeChoice] = useState(null);
  const [escapeShowHint, setEscapeShowHint] = useState(false);
  const [escapeSeconds, setEscapeSeconds] = useState(0);
  const [escapeRunning, setEscapeRunning] = useState(false);

  // Quiz & Assessment States
  const [quizType, setQuizType] = useState(null); // null, 'pre', 'post'
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizTimerEnabled, setQuizTimerEnabled] = useState(false);
  const [quizSecondsLeft, setQuizSecondsLeft] = useState(240);
  const [quizDone, setQuizDone] = useState(false);

  // Daily Challenge States
  const [dailyChoice, setDailyChoice] = useState(null);

  // Profile Edit State
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  // Today's deterministic Daily Challenge
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const todayChallenge = DAILY_CHALLENGES[dayNumber % DAILY_CHALLENGES.length];
  const isTodayChallengeDone = (user.dailyChallengeCompletedDates || []).includes(todayKey);

  // Certificate Eligibility Check (All 11 modules completed + Evaluation score >= 80%)
  const bestEvalScore = Math.max(user.postTestScore ?? 0, user.preTestScore ?? 0);
  const isCertificateEligible = user.completedModules.length >= 11 && bestEvalScore >= 80;

  // Auto-issue Certificate once eligible
  useEffect(() => {
    if (isCertificateEligible && !user.certificateNumber) {
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const certNum = `DS-${new Date().getFullYear()}-${randomCode}`;
      const certDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setUser((prev) => ({
        ...prev,
        certificateNumber: certNum,
        certificateDate: certDate
      }));
    }
  }, [isCertificateEligible, user.certificateNumber]);

  // Escape Room Timer
  useEffect(() => {
    if (!escapeRunning || activeTab !== 'escaperoom') return;
    const timer = setInterval(() => {
      setEscapeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [escapeRunning, activeTab]);

  // Optional Quiz Timer
  useEffect(() => {
    if (!quizType || quizDone || !quizTimerEnabled) return;
    if (quizSecondsLeft <= 0) {
      finalizeAssessment();
      return;
    }
    const timer = setInterval(() => {
      setQuizSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizType, quizDone, quizTimerEnabled, quizSecondsLeft]);

  // Persist User & Sync Real Local Leaderboard
  useEffect(() => {
    writePersistentJSON(STORAGE_USER_KEY, user);

    if (user.hasOnboarded && user.name && user.name.trim()) {
      const userId = user.id || `usr_${user.name.trim().toLowerCase()}`;
      const entry = {
        id: userId,
        name: user.name.trim(),
        avatar: user.avatar,
        xp: user.xp,
        modulesCount: user.completedModules.length,
        videosCount: user.watchedVideos.length,
        escapeCount: user.escapeRoomProgress.completedLevels.length,
        updatedAt: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };

      setLocalLeaderboard((prev) => {
        const others = prev.filter((item) => item.id !== userId);
        const sorted = [...others, entry].sort((a, b) => b.xp - a.xp);
        writePersistentJSON(STORAGE_LB_KEY, sorted);
        return sorted;
      });
    }
  }, [user]);

  const triggerToast = (title, subtitle) => {
    setToast({ title, subtitle });
    setTimeout(() => setToast(null), 3200);
  };

  const addXP = (amount, activityTitle, category = 'general') => {
    if (amount <= 0) return;
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      history: [
        {
          id: Date.now() + Math.random(),
          title: activityTitle,
          xp: amount,
          category,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.history.slice(0, 24)
      ]
    }));
    triggerToast(`+${amount} XP Diperoleh!`, activityTitle);
  };

  const handleStartSession = (e) => {
    e.preventDefault();
    const trimmed = welcomeName.trim();
    if (trimmed.length < 2) {
      setWelcomeError('Masukkan nama panggilan minimal 2 karakter untuk memulai.');
      return;
    }
    const existing = localLeaderboard.find(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );
    const nextUser = {
      ...INITIAL_USER_STATE,
      ...(existing ? user : {}),
      id: existing ? existing.id : `usr_${trimmed.toLowerCase().replace(/\s+/g, '_')}`,
      hasOnboarded: true,
      name: trimmed,
      avatar: welcomeAvatar,
      xp: existing ? existing.xp : 0
    };
    writePersistentJSON(STORAGE_USER_KEY, nextUser);
    setUser(nextUser);
    setWelcomeError('');
  };

  const handleSwitchLearner = () => {
    setWelcomeName('');
    setWelcomeAvatar('🛡️');
    setWelcomeError('');
    const switchedUser = { ...user, hasOnboarded: false, name: '' };
    writePersistentJSON(STORAGE_USER_KEY, switchedUser);
    setUser(switchedUser);
  };

  const handleCompleteModule = (mod) => {
    if (user.completedModules.includes(mod.id)) return;
    setUser((prev) => ({
      ...prev,
      completedModules: [...prev.completedModules, mod.id]
    }));
    addXP(50, `Selesai Modul #${mod.id}: ${mod.title}`, 'module');
  };

  const handleMarkVideoWatched = (video) => {
    if (user.watchedVideos.includes(video.id)) return;
    setUser((prev) => ({
      ...prev,
      watchedVideos: [...prev.watchedVideos, video.id]
    }));
    addXP(25, `Menonton Video: ${video.topicCategory}`, 'video');
  };

  const finalizeAssessment = () => {
    const correctCount = ASSESSMENT_QUESTIONS.filter(
      (q) => quizAnswers[q.id] === q.answer
    ).length;
    const pct = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);

    // Compute per-category breakdown for Cyber Safety Score
    const categories = ['Password Security', 'Phishing', 'Online Privacy', 'Social Engineering', 'Digital Footprint', 'Safe Browsing'];
    const breakdown = categories.map((cat) => {
      const catQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.category === cat);
      const catCorrect = catQuestions.filter((q) => quizAnswers[q.id] === q.answer).length;
      const score = catQuestions.length > 0 ? Math.round((catCorrect / catQuestions.length) * 100) : 0;
      const missedModules = catQuestions
        .filter((q) => quizAnswers[q.id] !== q.answer)
        .map((q) => q.moduleId);
      return { category: cat, score, missedModules };
    });

    const isPost = quizType === 'post';
    setUser((prev) => ({
      ...prev,
      preTestScore: !isPost ? pct : prev.preTestScore,
      postTestScore: isPost ? pct : prev.postTestScore,
      lastAssessmentBreakdown: breakdown
    }));

    addXP(isPost ? 100 : 40, `Selesai ${isPost ? 'Evaluasi Akhir' : 'Tes Awal'} (${pct}%)`, 'quiz');
    setQuizDone(true);
  };

  // Sidebar & Mobile Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', subtitle: 'Beranda Utama', icon: Home },
    { id: 'modules', label: 'Learning Modules', subtitle: `${user.completedModules.length}/11 Modul`, icon: BookOpen },
    { id: 'videos', label: 'Video Learning', subtitle: `${user.watchedVideos.length}/11 Video`, icon: Video },
    { id: 'simulator', label: 'Cyber Simulator', subtitle: 'Deteksi Phishing', icon: ShieldAlert },
    { id: 'escaperoom', label: 'Escape Room', subtitle: `${user.escapeRoomProgress.completedLevels.length}/5 Ruangan`, icon: DoorOpen },
    { id: 'quiz', label: 'Quiz & Assessment', subtitle: 'Cyber Safety Score', icon: BarChart3 },
    { id: 'daily', label: 'Daily Challenge', subtitle: isTodayChallengeDone ? 'Selesai Hari Ini' : 'Tantangan Aktif', icon: Calendar },
    { id: 'achievements', label: 'Achievements', subtitle: 'Badge & Peringkat', icon: Trophy },
    { id: 'progress', label: 'My Progress', subtitle: 'Progres & Sertifikat', icon: Award }
  ];

  const unlockedBadgesCount = ACHIEVEMENT_BADGES.filter((b) => b.check(user)).length;

  // ==========================================================================
  // ONBOARDING NICKNAME GATE
  // ==========================================================================
  if (!user.hasOnboarded) {
    return (
      <div className="min-h-screen bg-[#060B19] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-7 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                Platform Edukasi Keamanan Siber
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                DIGITAL SECURITY
              </h1>
              <p className="text-xs text-slate-400 mt-1">Learn, Explore & Protect</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Masukkan nama panggilanmu untuk menyimpan progres belajar, XP, dan sertifikat kelulusan di perangkat ini.
            </p>
          </div>

          <form onSubmit={handleStartSession} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Pilih Avatar Agen
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['🛡️', '🕵️', '🔐', '🦊', '🚀', '👾'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setWelcomeAvatar(emoji)}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center border transition ${
                      welcomeAvatar === emoji
                        ? 'bg-cyan-500/20 border-cyan-400 scale-105'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Nama Panggilan Siswa
              </label>
              <input
                id="nickname-input"
                type="text"
                autoFocus
                maxLength={28}
                value={welcomeName}
                onChange={(e) => {
                  setWelcomeName(e.target.value);
                  if (welcomeError) setWelcomeError('');
                }}
                placeholder="Contoh: Nabila Putri, Rizky Pratama..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white text-sm font-semibold placeholder-slate-500 focus:outline-none transition"
              />
              {welcomeError && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {welcomeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition"
            >
              Masuk ke Platform <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {localLeaderboard.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Lanjutkan Profil di Perangkat Ini
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {localLeaderboard.slice(0, 4).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setWelcomeName(entry.name);
                      setWelcomeAvatar(entry.avatar);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition"
                  >
                    <span>{entry.avatar}</span>
                    <span className="font-semibold">{entry.name}</span>
                    <span className="text-cyan-400 font-bold">({entry.xp} XP)</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MAIN WORKSPACE LAYOUT (DESKTOP SIDEBAR + MOBILE TOPBAR)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#060B19] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col lg:flex-row">
      {/* Floating XP Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 border border-cyan-400/60 shadow-xl shadow-cyan-500/20 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-cyan-300">{toast.title}</p>
            <p className="text-xs text-slate-300">{toast.subtitle}</p>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-[#080F23] border-r border-slate-800/80 z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <button
            onClick={() => {
              setActiveTab('home');
              setSelectedModule(null);
            }}
            className="flex items-center gap-3 text-left group w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent block leading-none">
                DIGITAL SECURITY
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                Learn, Explore & Protect
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'modules') setSelectedModule(null);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/15 border border-cyan-500/40 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{item.subtitle}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile Summary */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('progress')}
            className="w-full p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 flex items-center gap-3 transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[11px] font-semibold text-cyan-400">{user.xp} XP • {unlockedBadgesCount} Badge</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#060B19]/95 backdrop-blur-xl border-b border-slate-800">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveTab('home');
              setSelectedModule(null);
            }}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent block leading-none">
                DIGITAL SECURITY
              </span>
              <span className="text-[10px] text-slate-400">Learn, Explore & Protect</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('progress')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs font-bold text-cyan-300"
            >
              <span>{user.avatar}</span>
              <span>{user.xp} XP</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="bg-[#080F23] border-b border-slate-800 px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    if (item.id !== 'modules') setSelectedModule(null);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* ================================================================
              1. HOME (BERANDA UTAMA)
          ================================================================ */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1736] to-indigo-950/90 border border-slate-800 p-6 sm:p-10 md:p-12 shadow-2xl">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
                  <div className="xl:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      DIGITAL SECURITY — Learn, Explore & Protect
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                      Master Your{' '}
                      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Digital Safety
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg font-medium text-cyan-200/90">
                      Learn to Stay Safe, Smart, and Secure in the Digital World.
                    </p>

                    <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                      Platform pembelajaran keamanan siber interaktif untuk siswa SMP & SMA. Kuasai perlindungan akun, deteksi phishing, privasi data, hingga simulasi Escape Room secara nyata.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('modules')}
                        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition"
                      >
                        Mulai Belajar <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveTab('simulator')}
                        className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-sm flex items-center gap-2 transition"
                      >
                        <ShieldAlert className="w-4 h-4" /> Jelajahi Simulasi
                      </button>
                    </div>
                  </div>

                  {/* Modern Cybersecurity Illustration & Real User Progress */}
                  <div className="xl:col-span-5">
                    <div className="rounded-2xl bg-slate-950/85 border border-slate-800 p-6 backdrop-blur-md space-y-5 shadow-xl">
                      {/* Cyber Shield SVG Visual */}
                      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center text-2xl">
                            {user.avatar}
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block">Progres Belajar Kamu</span>
                            <h3 className="text-base font-bold text-white">{user.name}</h3>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold">
                          {user.xp} XP
                        </div>
                      </div>

                      {/* Real Module Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Penyelesaian Modul Wajib</span>
                          <span className="font-bold text-cyan-300">
                            {user.completedModules.length} / {LEARNING_MODULES.length} Modul ({Math.round((user.completedModules.length / LEARNING_MODULES.length) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((user.completedModules.length / LEARNING_MODULES.length) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Authentic Platform Content Counts (No Fake User Stats) */}
                      <div className="grid grid-cols-3 gap-2.5 text-center">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-lg font-extrabold text-cyan-400">{LEARNING_MODULES.length}</div>
                          <div className="text-[11px] text-slate-400">Modul Materi</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-lg font-extrabold text-purple-400">{PHISHING_SIMULATIONS.length + ESCAPE_ROOM_LEVELS.length}</div>
                          <div className="text-[11px] text-slate-400">Tantangan</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-lg font-extrabold text-emerald-400">{EDUCATIONAL_VIDEOS.length}</div>
                          <div className="text-[11px] text-slate-400">Video Belajar</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Learning Categories Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">Kategori Pembelajaran</h2>
                    <p className="text-xs text-slate-400">Materi disusun bertahap sesuai tingkat kesulitan siswa SMP & SMA.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('modules')}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Lihat Semua Modul <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      level: 'Beginner',
                      title: 'Tingkat Dasar (Beginner)',
                      desc: 'Fondasi keamanan digital, password kuat, mengenali phishing, privasi medsos, dan etika digital.',
                      count: LEARNING_MODULES.filter((m) => m.level === 'Beginner').length,
                      done: LEARNING_MODULES.filter((m) => m.level === 'Beginner' && user.completedModules.includes(m.id)).length,
                      accent: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                    },
                    {
                      level: 'Intermediate',
                      title: 'Tingkat Menengah (Intermediate)',
                      desc: 'Perlindungan malware, privasi data pribadi, keamanan Wi-Fi publik, dan Two-Factor Authentication.',
                      count: LEARNING_MODULES.filter((m) => m.level === 'Intermediate').length,
                      done: LEARNING_MODULES.filter((m) => m.level === 'Intermediate' && user.completedModules.includes(m.id)).length,
                      accent: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300'
                    },
                    {
                      level: 'Advanced',
                      title: 'Tingkat Lanjutan (Advanced)',
                      desc: 'Manajemen jejak digital jangka panjang serta keamanan transaksi e-wallet, QRIS, dan belanja online.',
                      count: LEARNING_MODULES.filter((m) => m.level === 'Advanced').length,
                      done: LEARNING_MODULES.filter((m) => m.level === 'Advanced' && user.completedModules.includes(m.id)).length,
                      accent: 'border-purple-500/30 bg-purple-500/5 text-purple-300'
                    }
                  ].map((cat) => (
                    <button
                      key={cat.level}
                      onClick={() => {
                        setModuleLevelFilter(cat.level);
                        setSelectedModule(null);
                        setActiveTab('modules');
                      }}
                      className="text-left p-5 rounded-2xl bg-slate-900/75 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.accent}`}>
                          {cat.level} • {cat.done}/{cat.count} Selesai
                        </span>
                        <h3 className="text-base font-bold text-white">{cat.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                      </div>
                      <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        Buka Materi {cat.level} <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recommended Modules & Active Challenges Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recommended Next Modules */}
                <section className="lg:col-span-7 rounded-2xl bg-slate-900/75 border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                      <Compass className="w-5 h-5 text-cyan-400" /> Rekomendasi Materi Berikutnya
                    </h2>
                    <span className="text-xs text-slate-400">Berdasarkan progresmu</span>
                  </div>

                  <div className="space-y-3">
                    {LEARNING_MODULES.filter((m) => !user.completedModules.includes(m.id))
                      .slice(0, 3)
                      .map((mod) => {
                        const ModIcon = mod.icon;
                        return (
                          <div
                            key={mod.id}
                            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-4 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shrink-0`}>
                                <ModIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-cyan-400 uppercase">{mod.level}</span>
                                  <span className="text-[10px] text-slate-500">• {mod.duration}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white truncate">{mod.title}</h3>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedModule(mod);
                                setModuleSubTab('read');
                                setModuleQuizChoice(null);
                                setActiveTab('modules');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold shrink-0 transition"
                            >
                              Pelajari
                            </button>
                          </div>
                        );
                      })}
                    {user.completedModules.length >= LEARNING_MODULES.length && (
                      <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                        <p className="text-sm font-bold text-emerald-300">
                          Selamat! Seluruh 11 modul telah kamu selesaikan.
                        </p>
                        <button
                          onClick={() => setActiveTab('quiz')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold"
                        >
                          Ambil Evaluasi Akhir untuk Sertifikat
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Digital Security Challenges Box */}
                <section className="lg:col-span-5 rounded-2xl bg-slate-900/75 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-400" /> Tantangan Keamanan Digital
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Uji kemampuan praktismu menghadapi ancaman nyata lewat simulasi interaktif:
                    </p>

                    <div className="space-y-2.5 pt-1">
                      <button
                        onClick={() => setActiveTab('simulator')}
                        className="w-full p-3.5 rounded-xl bg-slate-950/90 hover:bg-slate-950 border border-slate-800 hover:border-rose-500/40 flex items-center justify-between text-left transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">Phishing Simulator</div>
                          <div className="text-[11px] text-slate-400">
                            {user.completedPhishingSim.length}/{PHISHING_SIMULATIONS.length} kasus dianalisis
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-rose-400" />
                      </button>

                      <button
                        onClick={() => setActiveTab('escaperoom')}
                        className="w-full p-3.5 rounded-xl bg-slate-950/90 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between text-left transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">Cyber Escape Room (5 Level)</div>
                          <div className="text-[11px] text-slate-400">
                            {user.escapeRoomProgress.completedLevels.length}/5 ruangan terbuka
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </button>

                      <button
                        onClick={() => setActiveTab('daily')}
                        className="w-full p-3.5 rounded-xl bg-slate-950/90 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between text-left transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">Daily Cyber Challenge</div>
                          <div className="text-[11px] text-cyan-400">
                            {isTodayChallengeDone ? '✓ Tantangan hari ini selesai' : 'Tersedia hari ini (+45 XP)'}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ================================================================
              2. LEARNING MODULES (11 MODULES BY DIFFICULTY + VIDEO + MINI QUIZ)
          ================================================================ */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              {!selectedModule ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-white">Learning Modules (11 Materi)</h1>
                      <p className="text-sm text-slate-400 mt-1">
                        Pilih modul berdasarkan tingkat kesulitan. Selesaikan seluruh 11 modul sebagai syarat Sertifikat Digital.
                      </p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-300">
                      Selesai: {user.completedModules.length} / {LEARNING_MODULES.length} Modul
                    </div>
                  </div>

                  {/* Difficulty Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setModuleLevelFilter(lvl)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                          moduleLevelFilter === lvl
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {lvl === 'ALL' ? `Semua Tingkat (${LEARNING_MODULES.length})` : lvl}
                      </button>
                    ))}
                  </div>

                  {/* Module Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {LEARNING_MODULES.filter(
                      (m) => moduleLevelFilter === 'ALL' || m.level === moduleLevelFilter
                    ).map((mod) => {
                      const ModIcon = mod.icon;
                      const isDone = user.completedModules.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                            isDone
                              ? 'bg-slate-900/75 border-emerald-500/40'
                              : 'bg-slate-900/75 border-slate-800 hover:border-cyan-500/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-4">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                                  mod.level === 'Beginner'
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : mod.level === 'Intermediate'
                                    ? 'bg-cyan-500/15 text-cyan-300'
                                    : 'bg-purple-500/15 text-purple-300'
                                }`}
                              >
                                #{mod.id} • {mod.level}
                              </span>
                              {isDone ? (
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" /> Selesai
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">Belum Selesai</span>
                              )}
                            </div>

                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4`}>
                              <ModIcon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-base font-bold text-white mb-2">{mod.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">{mod.description}</p>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedModule(mod);
                              setModuleSubTab('read');
                              setModuleQuizChoice(null);
                            }}
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                          >
                            Buka Materi & Latihan <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Detailed Module View */
                (() => {
                  const modVideo = EDUCATIONAL_VIDEOS.find((v) => v.moduleId === selectedModule.id);
                  const isModDone = user.completedModules.includes(selectedModule.id);

                  return (
                    <div className="max-w-4xl mx-auto space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedModule(null)}
                          className="text-xs sm:text-sm font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Modul
                        </button>

                        {/* Sub-Navigation inside Module */}
                        <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
                          <button
                            onClick={() => setModuleSubTab('read')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                              moduleSubTab === 'read' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Materi
                          </button>
                          {modVideo && (
                            <button
                              onClick={() => setModuleSubTab('video')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                                moduleSubTab === 'video' ? 'bg-purple-500 text-white' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" /> Video
                            </button>
                          )}
                          <button
                            onClick={() => setModuleSubTab('quiz')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                              moduleSubTab === 'quiz' ? 'bg-blue-500 text-white' : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" /> Kuis Pemahaman
                          </button>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
                        {/* Module Header Banner */}
                        <div className={`p-6 md:p-8 bg-gradient-to-r ${selectedModule.color}`}>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-bold bg-black/30 text-white px-3 py-1 rounded-full">
                              Modul #{selectedModule.id} • {selectedModule.level} • {selectedModule.duration}
                            </span>
                            {isModDone && (
                              <span className="text-xs font-bold bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full">
                                ✓ Selesai
                              </span>
                            )}
                          </div>
                          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{selectedModule.title}</h1>
                          <p className="text-white/90 text-sm mt-2">{selectedModule.description}</p>
                        </div>

                        {/* TAB 1: READING CONTENT */}
                        {moduleSubTab === 'read' && (
                          <div className="p-6 md:p-8 space-y-6">
                            {/* Learning Objectives */}
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                              <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                                <Target className="w-4 h-4" /> Tujuan Pembelajaran
                              </h3>
                              <ul className="space-y-1.5">
                                {selectedModule.objectives.map((obj, idx) => (
                                  <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    <span>{obj}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Explanations */}
                            {selectedModule.sections.map((sec, idx) => (
                              <div key={idx} className="space-y-2">
                                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-extrabold">
                                    {idx + 1}
                                  </span>
                                  {sec.heading}
                                </h3>
                                <p className="text-slate-300 text-sm md:text-base leading-relaxed pl-8">
                                  {sec.body}
                                </p>
                              </div>
                            ))}

                            {/* Real Case Example */}
                            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed">
                              {selectedModule.caseExample}
                            </div>

                            {/* Summary */}
                            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
                              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Rangkuman Materi
                              </h4>
                              <ul className="space-y-2">
                                {selectedModule.keyTakeaways.map((tip, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: EMBEDDED MODULE VIDEO */}
                        {moduleSubTab === 'video' && modVideo && (
                          <div className="p-6 md:p-8 space-y-5">
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                              <iframe
                                className="w-full h-full"
                                src={`https://www.youtube-nocookie.com/embed/${modVideo.youtubeId}?rel=0&modestbranding=1`}
                                title={modVideo.title}
                                referrerPolicy="strict-origin-when-cross-origin"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <h3 className="text-base font-bold text-white">{modVideo.title}</h3>
                                <p className="text-xs text-slate-400 mt-1">{modVideo.description}</p>
                              </div>
                              <a
                                href={modVideo.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-rose-400" /> Buka di YouTube
                              </a>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: MODULE COMPREHENSION MINI QUIZ */}
                        {moduleSubTab === 'quiz' && (
                          <div className="p-6 md:p-8 space-y-5">
                            <h3 className="text-base font-bold text-white">Kuis Pemahaman Modul #{selectedModule.id}</h3>
                            <p className="text-sm text-slate-200 font-medium">{selectedModule.miniQuiz.question}</p>
                            <div className="space-y-2.5">
                              {selectedModule.miniQuiz.options.map((opt, idx) => {
                                let style = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200';
                                if (moduleQuizChoice !== null) {
                                  if (idx === selectedModule.miniQuiz.answer) style = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                                  else if (idx === moduleQuizChoice) style = 'bg-rose-500/20 border-rose-400 text-rose-200';
                                }
                                return (
                                  <button
                                    key={idx}
                                    disabled={moduleQuizChoice !== null}
                                    onClick={() => {
                                      setModuleQuizChoice(idx);
                                      if (idx === selectedModule.miniQuiz.answer && !user.moduleQuizPassed.includes(selectedModule.id)) {
                                        setUser((prev) => ({
                                          ...prev,
                                          moduleQuizPassed: [...prev.moduleQuizPassed, selectedModule.id]
                                        }));
                                        addXP(20, `Lolos Kuis Modul #${selectedModule.id}`, 'quiz');
                                      }
                                    }}
                                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition ${style}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {moduleQuizChoice !== null && (
                              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs sm:text-sm text-slate-300">
                                <span className="font-bold text-cyan-400 block mb-1">Pembahasan:</span>
                                {selectedModule.miniQuiz.explanation}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Module Action Footer */}
                        <div className="px-6 md:px-8 py-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <button
                            onClick={() => handleCompleteModule(selectedModule)}
                            disabled={isModDone}
                            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                              isModDone
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                            }`}
                          >
                            {isModDone ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Modul Sudah Ditandai Selesai
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Tandai Selesai (+50 XP)
                              </>
                            )}
                          </button>

                          {selectedModule.id < LEARNING_MODULES.length && (
                            <button
                              onClick={() => {
                                const next = LEARNING_MODULES.find((m) => m.id === selectedModule.id + 1);
                                if (next) {
                                  setSelectedModule(next);
                                  setModuleSubTab('read');
                                  setModuleQuizChoice(null);
                                }
                              }}
                              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
                            >
                              Modul Berikutnya <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* ================================================================
              3. VIDEO LEARNING (EMBEDDED YOUTUBE + POST-VIDEO QUIZ)
          ================================================================ */}
          {activeTab === 'videos' && (() => {
            const activeVideo = EDUCATIONAL_VIDEOS.find((v) => v.id === selectedVideoId) || EDUCATIONAL_VIDEOS[0];
            const isVideoWatched = user.watchedVideos.includes(activeVideo.id);
            const isVideoQuizDone = user.videoQuizPassed.includes(activeVideo.id);
            const supportModule = LEARNING_MODULES.find((m) => m.id === activeVideo.moduleId);

            const filteredVideos = EDUCATIONAL_VIDEOS.filter((v) => {
              const matchSearch =
                v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
                v.topicCategory.toLowerCase().includes(videoSearch.toLowerCase()) ||
                v.description.toLowerCase().includes(videoSearch.toLowerCase());
              const matchDiff = videoDiffFilter === 'ALL' || v.difficulty === videoDiffFilter;
              return matchSearch && matchDiff;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">Video Learning</h1>
                    <p className="text-sm text-slate-400 mt-1">
                      Tonton penjelasan visual setiap topik keamanan digital, tandai selesai secara mandiri, dan kerjakan kuis singkatnya.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-purple-300">
                    Ditonton: {user.watchedVideos.length} / {EDUCATIONAL_VIDEOS.length} Video
                  </div>
                </div>

                {/* Main Embedded Player Card */}
                <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-1 xl:grid-cols-12">
                    <div className="xl:col-span-8 bg-black flex flex-col">
                      <div className="relative w-full aspect-video">
                        <iframe
                          key={activeVideo.youtubeId}
                          className="w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1`}
                          title={activeVideo.title}
                          referrerPolicy="strict-origin-when-cross-origin"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          onError={() => setVideoLoadWarning(true)}
                        />
                      </div>
                      {/* Fallback Notice Bar */}
                      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span>
                          {videoLoadWarning
                            ? 'Video mengalami kendala pemuatan di browser ini.'
                            : 'Jika pemutar video tidak tampil atau dibatasi jaringan sekolah, buka langsung di YouTube.'}
                        </span>
                        <a
                          href={activeVideo.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                        >
                          Buka Video di YouTube <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Video Details & Manual Completion */}
                    <div className="xl:col-span-4 p-6 flex flex-col justify-between bg-slate-950/70 border-t xl:border-t-0 xl:border-l border-slate-800 space-y-5">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300">
                            {activeVideo.difficulty}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300">
                            {activeVideo.topicCategory}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {activeVideo.duration}
                          </span>
                        </div>

                        <h2 className="text-lg font-extrabold text-white leading-snug">{activeVideo.title}</h2>
                        <p className="text-xs text-slate-400">Sumber: {activeVideo.channel}</p>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeVideo.description}</p>
                      </div>

                      <div className="space-y-2.5 pt-4 border-t border-slate-800">
                        <p className="text-[11px] text-slate-400">
                          Status tontonan dicatat berdasarkan konfirmasi mandiri setelah kamu selesai menyimak video.
                        </p>
                        <button
                          onClick={() => handleMarkVideoWatched(activeVideo)}
                          disabled={isVideoWatched}
                          className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                            isVideoWatched
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {isVideoWatched ? 'Video Sudah Ditandai Selesai' : 'Tandai Video Selesai (+25 XP)'}
                        </button>

                        {supportModule && (
                          <button
                            onClick={() => {
                              setSelectedModule(supportModule);
                              setModuleSubTab('read');
                              setActiveTab('modules');
                            }}
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Buka Materi Pendukung #{supportModule.id}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post-Video Short Quiz */}
                  <div className="p-6 bg-slate-900/95 border-t border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-cyan-400" /> Kuis Singkat Setelah Video
                      </h3>
                      {isVideoQuizDone && (
                        <span className="text-xs font-bold text-emerald-400">✓ Kuis Video Selesai</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200">{activeVideo.quiz.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {activeVideo.quiz.options.map((opt, idx) => {
                        let style = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300';
                        if (videoQuizChoice !== null) {
                          if (idx === activeVideo.quiz.answer) style = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                          else if (idx === videoQuizChoice) style = 'bg-rose-500/20 border-rose-400 text-rose-200';
                        }
                        return (
                          <button
                            key={idx}
                            disabled={videoQuizChoice !== null}
                            onClick={() => {
                              setVideoQuizChoice(idx);
                              if (idx === activeVideo.quiz.answer && !user.videoQuizPassed.includes(activeVideo.id)) {
                                setUser((prev) => ({
                                  ...prev,
                                  videoQuizPassed: [...prev.videoQuizPassed, activeVideo.id]
                                }));
                                addXP(15, `Kuis Video: ${activeVideo.topicCategory}`, 'video');
                              }
                            }}
                            className={`text-left p-3.5 rounded-xl border text-xs font-medium transition ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Search & Difficulty Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={videoSearch}
                      onChange={(e) => setVideoSearch(e.target.value)}
                      placeholder="Cari judul atau topik video..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setVideoDiffFilter(diff)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                          videoDiffFilter === diff
                            ? 'bg-purple-500 text-white border-purple-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        {diff === 'ALL' ? 'Semua Tingkat' : diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Playlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVideos.map((vid) => {
                    const selected = vid.id === activeVideo.id;
                    const watched = user.watchedVideos.includes(vid.id);
                    return (
                      <button
                        key={vid.id}
                        onClick={() => {
                          setSelectedVideoId(vid.id);
                          setVideoQuizChoice(null);
                          setVideoLoadWarning(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`text-left rounded-2xl border overflow-hidden flex flex-col justify-between transition ${
                          selected
                            ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="relative aspect-video bg-slate-950">
                            <img
                              src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/90 text-cyan-300">
                              {vid.difficulty}
                            </span>
                            {watched && (
                              <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                                ✓ Selesai
                              </span>
                            )}
                            <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white">
                              {vid.duration}
                            </span>
                          </div>
                          <div className="p-4 space-y-1.5">
                            <span className="text-[11px] font-bold text-purple-300 block">{vid.topicCategory}</span>
                            <h3 className="text-sm font-bold text-white line-clamp-2">{vid.title}</h3>
                          </div>
                        </div>
                        <div className="px-4 pb-4 text-xs font-bold text-cyan-400">
                          {selected ? '● Sedang Diputar' : 'Putar Video →'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ================================================================
              4. CYBER SIMULATOR (INTERACTIVE PHISHING SIMULATOR)
          ================================================================ */}
          {activeTab === 'simulator' && (() => {
            const currentSim = PHISHING_SIMULATIONS[simIndex];
            const isSimDone = user.completedPhishingSim.includes(currentSim.id);

            const handleEvaluateSim = (guessIsPhishing) => {
              if (simAnswer !== null) return;
              setSimAnswer(guessIsPhishing);
              const isCorrect = guessIsPhishing === currentSim.isPhishing;
              if (isCorrect) {
                setSimSessionScore((s) => s + 100);
                if (!isSimDone) {
                  setUser((prev) => ({
                    ...prev,
                    completedPhishingSim: [...prev.completedPhishingSim, currentSim.id]
                  }));
                  addXP(currentSim.xp, `Phishing Simulator: ${currentSim.type}`, 'simulator');
                }
              }
            };

            return (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">Phishing Simulator</h1>
                    <p className="text-sm text-slate-400 mt-1">
                      Periksa pengirim, isi pesan, dan pratinjau tautan. Tentukan apakah pesan simulasi ini Aman atau Berbahaya!
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-300">
                      Skor Sesi: {simSessionScore}
                    </span>
                    <span className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-300">
                      Selesai: {user.completedPhishingSim.length}/{PHISHING_SIMULATIONS.length}
                    </span>
                  </div>
                </div>

                {/* Case Selector Pills */}
                <div className="flex flex-wrap gap-2">
                  {PHISHING_SIMULATIONS.map((item, idx) => {
                    const done = user.completedPhishingSim.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSimIndex(idx);
                          setSimAnswer(null);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                          simIndex === idx
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : done
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                        Kasus #{idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Inbox Card */}
                <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                      <Mail className="w-4 h-4" /> {currentSim.type}
                    </div>
                    <span className="text-xs text-slate-500">{currentSim.timestamp}</span>
                  </div>

                  <div className="p-6 md:p-8 space-y-5">
                    <div className="space-y-1.5 pb-4 border-b border-slate-800">
                      <div className="text-xs text-slate-400">
                        Pengirim: <span className="font-mono text-slate-200 font-semibold">{currentSim.sender}</span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-white">{currentSim.subject}</h2>
                    </div>

                    <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                      {currentSim.body}
                    </p>

                    {/* Safe Non-Clickable Link Inspector Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs">
                      <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-400">Pratinjau Tujuan Tautan / Lampiran:</span>
                      <span className="font-mono text-amber-300 break-all">{currentSim.linkPreview}</span>
                    </div>

                    {/* Decision Buttons */}
                    {simAnswer === null ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => handleEvaluateSim(false)}
                          className="py-4 px-5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <ShieldCheck className="w-5 h-5" /> Pesan Ini AMAN (Asli)
                        </button>
                        <button
                          onClick={() => handleEvaluateSim(true)}
                          className="py-4 px-5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <AlertOctagon className="w-5 h-5" /> Pesan Ini BERBAHAYA (Phishing)
                        </button>
                      </div>
                    ) : (
                      /* Detailed Feedback Breakdown */
                      <div className="space-y-4 pt-2">
                        <div
                          className={`p-5 rounded-2xl border ${
                            simAnswer === currentSim.isPhishing
                              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                          }`}
                        >
                          <div className="font-extrabold text-base mb-1">
                            {simAnswer === currentSim.isPhishing
                              ? `✅ Analisis Tepat! (+${currentSim.xp} XP)`
                              : '❌ Analisis Kurang Tepat!'}
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed">{currentSim.explanation}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-extrabold uppercase text-cyan-400">Indikator & Ciri-Ciri</h4>
                            <ul className="space-y-1.5">
                              {currentSim.indicators.map((ind, i) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                  <span className="text-cyan-400">•</span>
                                  <span>{ind}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-extrabold uppercase text-emerald-400">Cara Menghindarinya</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">{currentSim.prevention}</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSimIndex((prev) => (prev + 1) % PHISHING_SIMULATIONS.length);
                              setSimAnswer(null);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm"
                          >
                            Lanjut ke Simulasi Berikutnya →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================================================================
              5. CYBER ESCAPE ROOM (5 LEVELS + TIMER + HINTS + XP)
          ================================================================ */}
          {activeTab === 'escaperoom' && (() => {
            const room = ESCAPE_ROOM_LEVELS.find((r) => r.level === escapeLevel) || ESCAPE_ROOM_LEVELS[0];
            const isRoomSolved = user.escapeRoomProgress.completedLevels.includes(room.level);
            const formatTime = (sec) => `${Math.floor(sec / 60)}m ${sec % 60}s`;

            return (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">Cyber Escape Room</h1>
                    <p className="text-sm text-slate-400 mt-1">
                      Pecahkan teka-teki keamanan siber di setiap ruangan untuk membuka kunci pintu berikutnya!
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {formatTime(escapeSeconds)}
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-300">
                      Terbuka: {user.escapeRoomProgress.completedLevels.length} / 5
                    </div>
                  </div>
                </div>

                {/* Room Progression Bar */}
                <div className="grid grid-cols-5 gap-2">
                  {ESCAPE_ROOM_LEVELS.map((lvl) => {
                    const unlocked = lvl.level <= user.escapeRoomProgress.unlockedLevel;
                    const solved = user.escapeRoomProgress.completedLevels.includes(lvl.level);
                    const active = lvl.level === escapeLevel;
                    return (
                      <button
                        key={lvl.level}
                        disabled={!unlocked}
                        onClick={() => {
                          setEscapeLevel(lvl.level);
                          setEscapeChoice(null);
                          setEscapeShowHint(false);
                          setEscapeSeconds(0);
                          setEscapeRunning(true);
                        }}
                        className={`p-3 rounded-2xl border text-center transition ${
                          active
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : solved
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : unlocked
                            ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-500/40'
                            : 'bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-xs font-extrabold">Level {lvl.level}</div>
                        <div className="text-[10px] mt-0.5">
                          {solved ? '✓ Terbuka' : unlocked ? 'Aktif' : '🔒 Terkunci'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Room Terminal */}
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                      {room.roomName} • +{room.xp} XP
                    </span>
                    <button
                      onClick={() => setEscapeShowHint(!escapeShowHint)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" /> {escapeShowHint ? 'Sembunyikan Petunjuk' : 'Minta Petunjuk'}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-400 italic">
                    "{room.story}"
                  </div>

                  {escapeShowHint && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                      <span className="font-bold">Petunjuk Ruangan:</span> {room.hint}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-base md:text-lg font-bold text-white leading-snug">{room.puzzle}</h3>
                    <div className="space-y-2.5">
                      {room.options.map((opt, idx) => {
                        let style = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200';
                        if (escapeChoice !== null) {
                          if (idx === room.answer) style = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                          else if (idx === escapeChoice) style = 'bg-rose-500/20 border-rose-400 text-rose-200';
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!escapeRunning) setEscapeRunning(true);
                              setEscapeChoice(idx);
                              if (idx === room.answer) {
                                setEscapeRunning(false);
                                const nextLvl = Math.min(5, room.level + 1);
                                if (!isRoomSolved) {
                                  setUser((prev) => ({
                                    ...prev,
                                    escapeRoomProgress: {
                                      unlockedLevel: Math.max(prev.escapeRoomProgress.unlockedLevel, nextLvl),
                                      completedLevels: [...prev.escapeRoomProgress.completedLevels, room.level],
                                      bestTimes: {
                                        ...prev.escapeRoomProgress.bestTimes,
                                        [room.level]: escapeSeconds
                                      }
                                    }
                                  }));
                                  addXP(room.xp, `Lolos Escape Room: Level ${room.level}`, 'escaperoom');
                                }
                              }
                            }}
                            className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {escapeChoice !== null && (
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                        escapeChoice === room.answer
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      {escapeChoice === room.answer ? (
                        <div className="space-y-3">
                          <p className="font-bold">🔓 Pintu Ruangan Terbuka!</p>
                          <p>{room.successExplanation}</p>
                          {room.level < 5 && (
                            <button
                              onClick={() => {
                                setEscapeLevel(room.level + 1);
                                setEscapeChoice(null);
                                setEscapeShowHint(false);
                                setEscapeSeconds(0);
                                setEscapeRunning(true);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs"
                            >
                              Masuk ke Ruangan #{room.level + 1} →
                            </button>
                          )}
                        </div>
                      ) : (
                        <p>🔒 Kode belum tepat! Periksa kembali petunjuk keamanan dan coba pilih jawaban lain.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ================================================================
              6. QUIZ & ASSESSMENT + CYBER SAFETY SCORE
          ================================================================ */}
          {activeTab === 'quiz' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {!quizType ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-white">Quiz & Cyber Safety Score</h1>
                      <p className="text-sm text-slate-400 mt-1">
                        Evaluasi pemahamanmu di 6 bidang keamanan digital. Nilai minimal 80% diperlukan untuk membuka Sertifikat Digital.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizTimerEnabled}
                        onChange={(e) => setQuizTimerEnabled(e.target.checked)}
                        className="accent-cyan-500"
                      />
                      Aktifkan Timer (4 Menit)
                    </label>
                  </div>

                  {/* Pre-Test & Post-Test Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-2xl bg-slate-900/85 border border-slate-800 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 text-blue-300">
                          Diagnostik Awal
                        </span>
                        <span className="text-2xl font-black text-white">
                          {user.preTestScore !== null ? `${user.preTestScore}%` : 'Belum Tes'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">Tes Awal (Pre-Assessment)</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ukur pemahaman awalmu sebelum menyelesaikan seluruh modul pembelajaran (+40 XP).
                      </p>
                      <button
                        onClick={() => {
                          setQuizType('pre');
                          setQuizIdx(0);
                          setQuizAnswers({});
                          setQuizSecondsLeft(240);
                          setQuizDone(false);
                        }}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-sm transition"
                      >
                        {user.preTestScore !== null ? 'Ulangi Tes Awal' : 'Mulai Tes Awal'}
                      </button>
                    </div>

                    <div className="rounded-2xl bg-slate-900/85 border border-cyan-500/40 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300">
                          Syarat Sertifikat (≥ 80%)
                        </span>
                        <span className="text-2xl font-black text-cyan-400">
                          {user.postTestScore !== null ? `${user.postTestScore}%` : 'Belum Tes'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">Evaluasi Akhir (Cyber Safety Score)</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Evaluasi komprehensif 8 soal untuk mengukur kesiapan digitalmu dan membuka Sertifikat Digital (+100 XP).
                      </p>
                      <button
                        onClick={() => {
                          setQuizType('post');
                          setQuizIdx(0);
                          setQuizAnswers({});
                          setQuizSecondsLeft(240);
                          setQuizDone(false);
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm transition"
                      >
                        {user.postTestScore !== null ? 'Ulangi Evaluasi Akhir' : 'Mulai Evaluasi Akhir'}
                      </button>
                    </div>
                  </div>

                  {/* Cyber Safety Score Breakdown */}
                  {user.lastAssessmentBreakdown && (
                    <div className="rounded-3xl bg-slate-900/85 border border-slate-800 p-6 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-extrabold text-white">Laporan Cyber Safety Score</h3>
                          <p className="text-[11px] text-slate-400">
                            Catatan: Skor ini merupakan hasil evaluasi pemahaman pembelajaranmu, bukan audit teknis keamanan perangkat atau akun pribadimu.
                          </p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 self-start">
                          Tingkat: {bestEvalScore >= 80 ? 'Sangat Baik (Siap Digital)' : bestEvalScore >= 60 ? 'Cukup Baik' : 'Perlu Latihan'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-6 h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={user.lastAssessmentBreakdown}>
                              <PolarGrid stroke="#1e293b" />
                              <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="lg:col-span-6 space-y-3">
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase">Kategori Sudah Dikuasai</h4>
                            <p className="text-xs text-slate-300">
                              {user.lastAssessmentBreakdown.filter((b) => b.score >= 80).map((b) => b.category).join(', ') || 'Belum ada kategori mencapai ≥ 80%.'}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold text-amber-400 uppercase">Perlu Ditingkatkan & Rekomendasi Materi</h4>
                            <div className="flex flex-wrap gap-2">
                              {user.lastAssessmentBreakdown
                                .filter((b) => b.score < 80)
                                .map((b) => {
                                  const mod = LEARNING_MODULES.find((m) => b.missedModules.includes(m.id));
                                  return mod ? (
                                    <button
                                      key={b.category}
                                      onClick={() => {
                                        setSelectedModule(mod);
                                        setModuleSubTab('read');
                                        setActiveTab('modules');
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/25 transition"
                                    >
                                      Pelajari Modul #{mod.id}: {mod.title} →
                                    </button>
                                  ) : null;
                                })}
                              {user.lastAssessmentBreakdown.every((b) => b.score >= 80) && (
                                <span className="text-xs text-emerald-300">Seluruh kategori telah dikuasai dengan sangat baik!</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : !quizDone ? (
                /* Active Question-by-Question Quiz */
                (() => {
                  const q = ASSESSMENT_QUESTIONS[quizIdx];
                  const picked = quizAnswers[q.id];
                  const progressPct = Math.round(((quizIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100);

                  return (
                    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-cyan-400">
                          Soal {quizIdx + 1} dari {ASSESSMENT_QUESTIONS.length} • {q.category}
                        </span>
                        {quizTimerEnabled && (
                          <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg">
                            Sisa Waktu: {Math.floor(quizSecondsLeft / 60)}:{String(quizSecondsLeft % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
                      </div>

                      <h2 className="text-lg md:text-xl font-bold text-white leading-snug">{q.question}</h2>

                      <div className="space-y-3">
                        {q.options.map((opt, idx) => {
                          const isSelected = picked === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                              className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                                  : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <button
                          onClick={() => {
                            if (quizIdx > 0) setQuizIdx(quizIdx - 1);
                            else setQuizType(null);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                        >
                          {quizIdx > 0 ? '← Soal Sebelumnya' : 'Batal'}
                        </button>

                        <button
                          disabled={picked === undefined}
                          onClick={() => {
                            if (quizIdx + 1 < ASSESSMENT_QUESTIONS.length) {
                              setQuizIdx(quizIdx + 1);
                            } else {
                              finalizeAssessment();
                            }
                          }}
                          className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                            picked === undefined
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                          }`}
                        >
                          {quizIdx + 1 < ASSESSMENT_QUESTIONS.length ? 'Soal Berikutnya →' : 'Selesai & Lihat Pembahasan'}
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Quiz Results & Answer Review */
                (() => {
                  const scorePct = quizType === 'pre' ? user.preTestScore : user.postTestScore;
                  return (
                    <div className="space-y-6">
                      <div className="rounded-3xl bg-slate-900 border border-cyan-500/40 p-8 text-center space-y-4">
                        <h2 className="text-2xl font-extrabold text-white">
                          Hasil {quizType === 'pre' ? 'Tes Awal' : 'Evaluasi Akhir'}
                        </h2>
                        <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {scorePct}%
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                          {scorePct >= 80
                            ? 'Luar biasa! Nilai kamu sudah memenuhi standar kelulusan evaluasi (≥ 80%).'
                            : 'Terus tingkatkan pemahamanmu dengan mempelajari rekomendasi modul di bawah ini.'}
                        </p>
                        <button
                          onClick={() => setQuizType(null)}
                          className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs sm:text-sm"
                        >
                          Lihat Cyber Safety Score & Ringkasan
                        </button>
                      </div>

                      {/* Answer Explanations */}
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-white">Pembahasan Setiap Soal</h3>
                        {ASSESSMENT_QUESTIONS.map((q, idx) => {
                          const userAns = quizAnswers[q.id];
                          const correct = userAns === q.answer;
                          const recMod = LEARNING_MODULES.find((m) => m.id === q.moduleId);
                          return (
                            <div
                              key={q.id}
                              className={`p-5 rounded-2xl border space-y-2 ${
                                correct ? 'bg-slate-900/70 border-emerald-500/30' : 'bg-slate-900/70 border-rose-500/40'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className={correct ? 'text-emerald-400' : 'text-rose-400'}>
                                  {correct ? `✓ Soal #${idx + 1} Benar` : `✗ Soal #${idx + 1} Kurang Tepat`} ({q.category})
                                </span>
                              </div>
                              <p className="text-sm font-bold text-white">{q.question}</p>
                              <p className="text-xs text-slate-300">
                                Jawaban Benar: <span className="text-emerald-300 font-semibold">{q.options[q.answer]}</span>
                              </p>
                              <p className="text-xs text-slate-400">{q.explanation}</p>
                              {!correct && recMod && (
                                <button
                                  onClick={() => {
                                    setQuizType(null);
                                    setSelectedModule(recMod);
                                    setModuleSubTab('read');
                                    setActiveTab('modules');
                                  }}
                                  className="text-xs font-bold text-cyan-400 hover:underline pt-1 inline-block"
                                >
                                  Rekomendasi: Pelajari Modul #{recMod.id} ({recMod.title}) →
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* ================================================================
              7. DAILY CYBER CHALLENGE
          ================================================================ */}
          {activeTab === 'daily' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">Daily Cyber Challenge</h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Satu kasus keamanan digital harian ({new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}).
                  </p>
                </div>
                <span className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-300">
                  Hadiah: +{todayChallenge.xp} XP
                </span>
              </div>

              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
                {isTodayChallengeDone && dailyChoice === null ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Tantangan Hari Ini Sudah Selesai!</h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                      Kamu sudah menyelesaikan kasus harian untuk tanggal {todayKey} dan mengklaim +{todayChallenge.xp} XP. Kembali lagi besok untuk kasus baru!
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-base md:text-lg font-bold text-white leading-relaxed">
                      {todayChallenge.question}
                    </h2>

                    <div className="space-y-3">
                      {todayChallenge.options.map((opt, idx) => {
                        let style = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200';
                        if (dailyChoice !== null) {
                          if (idx === todayChallenge.answer) style = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                          else if (idx === dailyChoice) style = 'bg-rose-500/20 border-rose-400 text-rose-200';
                        }
                        return (
                          <button
                            key={idx}
                            disabled={dailyChoice !== null}
                            onClick={() => {
                              setDailyChoice(idx);
                              if (!isTodayChallengeDone) {
                                setUser((prev) => ({
                                  ...prev,
                                  dailyChallengeCompletedDates: [...(prev.dailyChallengeCompletedDates || []), todayKey]
                                }));
                                if (idx === todayChallenge.answer) {
                                  addXP(todayChallenge.xp, `Daily Cyber Challenge (${todayKey})`, 'daily');
                                } else {
                                  addXP(15, `Partisipasi Daily Challenge (${todayKey})`, 'daily');
                                }
                              }
                            }}
                            className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {dailyChoice !== null && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 text-xs sm:text-sm text-slate-300 space-y-1">
                        <span className="font-bold text-cyan-400 block">
                          {dailyChoice === todayChallenge.answer ? '✅ Jawaban Tepat!' : '💡 Penjelasan Kasus:'}
                        </span>
                        <p>{todayChallenge.explanation}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              8. ACHIEVEMENTS & HONEST LOCAL LEADERBOARD
          ================================================================ */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Achievements & Peringkat Perangkat</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Koleksi badge pencapaianmu serta catatan skor nyata pengguna di perangkat ini.
                </p>
              </div>

              {/* Achievement Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACHIEVEMENT_BADGES.map((badge) => {
                  const unlocked = badge.check(user);
                  return (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border transition ${
                        unlocked
                          ? 'bg-gradient-to-br from-slate-900 to-indigo-950/50 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{badge.icon}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                            unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {unlocked ? 'Terbuka' : 'Terkunci'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{badge.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Honest Local Leaderboard */}
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" /> Papan Peringkat Lokal (Perangkat Ini)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Leaderboard global online belum terhubung ke server database. Daftar di bawah hanya menampilkan pengguna nyata yang belajar di perangkat ini tanpa akun fiktif.
                    </p>
                  </div>
                  <button
                    onClick={handleSwitchLearner}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 shrink-0"
                  >
                    + Ganti / Tambah Siswa di Perangkat Ini
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {localLeaderboard.map((entry, idx) => {
                    const isMe = entry.id === user.id || entry.name === user.name;
                    return (
                      <div
                        key={entry.id}
                        className={`p-4 sm:px-6 flex items-center justify-between gap-4 ${
                          isMe ? 'bg-cyan-500/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-extrabold text-slate-300 shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-2xl">{entry.avatar}</span>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-white flex items-center gap-2 truncate">
                              <span className="truncate">{entry.name}</span>
                              {isMe && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                                  Kamu
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {entry.modulesCount}/11 Modul • {entry.escapeCount}/5 Escape Room
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-cyan-400">{entry.xp} XP</div>
                          <div className="text-[10px] text-slate-500">{entry.updatedAt}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              9. MY PROGRESS & OFFICIAL DIGITAL CERTIFICATE
          ================================================================ */}
          {activeTab === 'progress' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Profile Header Card */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-3xl">
                    {user.avatar}
                  </div>
                  <div>
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          maxLength={28}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500 text-white font-bold text-base focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (nameInput.trim().length >= 2) {
                              setUser((prev) => ({ ...prev, name: nameInput.trim() }));
                            }
                            setEditingName(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-xl md:text-2xl font-extrabold text-white">{user.name}</h1>
                        <button
                          onClick={() => {
                            setNameInput(user.name);
                            setEditingName(true);
                          }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        >
                          Edit Nama
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-cyan-400 font-semibold mt-1">
                      Total XP: {user.xp} • Badge Terbuka: {unlockedBadgesCount}/{ACHIEVEMENT_BADGES.length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center w-full md:w-auto">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-black text-cyan-400">{user.completedModules.length}/11</div>
                    <div className="text-[11px] text-slate-400">Modul</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-black text-purple-400">{bestEvalScore}%</div>
                    <div className="text-[11px] text-slate-400">Nilai Evaluasi</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-black text-emerald-400">{user.escapeRoomProgress.completedLevels.length}/5</div>
                    <div className="text-[11px] text-slate-400">Escape Room</div>
                  </div>
                </div>
              </div>

              {/* DIGITAL CERTIFICATE SECTION */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-400" /> Sertifikat Digital Kelulusan
                  </h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isCertificateEligible
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {isCertificateEligible ? 'Sertifikat Terbit' : 'Syarat Belum Terpenuhi'}
                  </span>
                </div>

                {!isCertificateEligible ? (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-300">
                      Sertifikat digital hanya diterbitkan setelah kamu memenuhi kedua syarat berikut:
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        {user.completedModules.length >= 11 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="text-slate-200">
                          Menyelesaikan seluruh 11 modul wajib ({user.completedModules.length}/11 selesai)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bestEvalScore >= 80 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="text-slate-200">
                          Meraih nilai Quiz & Assessment minimal 80% (Nilai tertinggimu: {bestEvalScore}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Official Printable Certificate Card */
                  <div className="space-y-4">
                    <div
                      id="printable-certificate"
                      className="rounded-3xl bg-gradient-to-br from-[#0A132C] via-[#0F1E45] to-[#13183A] border-2 border-cyan-400/60 p-8 sm:p-10 text-center space-y-5 shadow-2xl relative overflow-hidden"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> Sertifikat Penyelesaian Program
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Diberikan Kepada</p>
                        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                          {user.name}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                        Telah berhasil menyelesaikan seluruh 11 modul kurikulum dan lulus evaluasi kompetensi dengan nilai <span className="text-cyan-300 font-bold">{bestEvalScore}%</span> pada program edukasi:
                      </p>

                      <div className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                        DIGITAL SECURITY — Learn, Explore & Protect
                      </div>

                      <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                        <span>Tanggal Penerbitan: <strong className="text-slate-200">{user.certificateDate}</strong></span>
                        <span>No. Sertifikat: <strong className="font-mono text-cyan-300">{user.certificateNumber}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg"
                      >
                        <Printer className="w-4 h-4" /> Cetak / Simpan Sertifikat (PDF)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Learning Activity History & Local Data Management */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Riwayat Aktivitas Pembelajaran</h3>
                {user.history.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Belum ada riwayat aktivitas. Mulai pelajari modul atau selesaikan simulasi!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {user.history.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-200 truncate pr-2">{item.title}</span>
                        <span className="text-cyan-400 font-bold shrink-0">+{item.xp} XP</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleSwitchLearner}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" /> Ganti Siswa di Perangkat Ini
                  </button>
                  <button
                    onClick={() => {
                      try {
                        window.localStorage.removeItem(STORAGE_USER_KEY);
                        window.localStorage.removeItem(STORAGE_LB_KEY);
                        window.sessionStorage.removeItem(STORAGE_USER_KEY);
                        window.sessionStorage.removeItem(STORAGE_LB_KEY);
                        window.name = '';
                      } catch {
                        // Ignore storage errors
                      }
                      setLocalLeaderboard([]);
                      setUser(INITIAL_USER_STATE);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Data Lokal
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#050914] py-5 px-4 text-center text-xs text-slate-500">
          DIGITAL SECURITY — Learn, Explore & Protect • Platform Edukasi Keamanan Siber Pelajar Indonesia
        </footer>
      </div>
    </div>
  );
}