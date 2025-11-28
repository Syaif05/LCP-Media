# **LCP Media (Local Course Player) v0.3.0**

**LCP Media** adalah aplikasi Desktop Learning Management System (LMS) modern yang dirancang untuk memanajemen, memutar, dan melacak progres kursus video lokal maupun dari cloud drive (seperti Google Drive). Aplikasi ini dibangun dengan fokus pada UI/UX premium, performa tinggi, dan kemampuan *offline-first*.

## **🛠️ Teknologi (Tech Stack)**

Aplikasi ini menggunakan arsitektur **Electron** modern dengan pemisahan proses yang ketat (Context Isolation).

* **Core:**  
  * **Electron:** Menangani *Main Process* (Sistem Operasi, File System, Native Window).  
  * **React \+ Vite:** Menangani *Renderer Process* (UI/UX).  
* **Styling:**  
  * **Tailwind CSS:** Framework utility-first untuk desain responsif dan tema (Dark/Light Mode).  
  * **Framer Motion:** Library animasi untuk transisi halaman dan interaksi mikro.  
* **Media Processing:**  
  * **Fluent-FFmpeg & FFprobe:** Digunakan untuk membedah file video (terutama MKV) dan mengekstrak *embedded subtitles* secara *on-the-fly*.  
* **Database:**  
  * **LowDB Pattern (Custom JSON):** Penyimpanan data lokal ringan tanpa server database berat.  
* **Icons:** Lucide React.

## **🚀 Panduan Instalasi (Untuk Developer)**

1. **Clone Repository:**  
   git clone \[https://github.com/username/lcp-media.git\](https://github.com/username/lcp-media.git)  
   cd lcp-media

2. Install Dependencies:  
   Karena menggunakan fluent-ffmpeg yang kadang memiliki konflik peer-dependency dengan React versi terbaru, gunakan flag legacy:  
   npm install \--legacy-peer-deps

   *Wajib menginstall binary statis untuk FFmpeg:*  
   npm install fluent-ffmpeg ffmpeg-static ffprobe-static \--legacy-peer-deps

3. **Jalankan Mode Development:**  
   npm run dev

   Perintah ini akan menjalankan Vite server (port 5173\) dan Electron secara bersamaan.

## **📂 Struktur Proyek & Penjelasan Mendalam**

Berikut adalah peta lengkap dari source code aplikasi ini. Bagian ini menjelaskan **tanggung jawab** dari setiap file agar mudah dikembangkan.

### **1\. Backend (Electron Main Process) \- electron/**

Folder ini adalah "otak" aplikasi yang memiliki akses penuh ke komputer pengguna.

* **electron/main.js**  
  * **Peran:** Entry Point (Titik Masuk).  
  * **Tugas Utama:**  
    * Membuat Jendela (Window) utama dan Splash Screen loading.  
    * Menangani **IPC (Inter-Process Communication)**: Menerima perintah dari React (seperti select-folder, get-courses).  
    * Menangani logika **Download Streaming**: Menggunakan fs.createReadStream dan pipe untuk menyalin file besar tanpa membekukan aplikasi, sekaligus mengirim data *progress* ke UI.  
    * Mengatur path FFmpeg agar bisa berjalan baik di mode dev maupun produksi (.exe).  
* **electron/preload.js**  
  * **Peran:** Jembatan Keamanan (Security Bridge).  
  * **Tugas Utama:** Mengekspos fungsi-fungsi tertentu dari main.js ke dunia React menggunakan contextBridge.  
  * **Penting:** React **TIDAK BOLEH** memiliki akses langsung ke module Node.js seperti fs atau require. Semua harus lewat jembatan ini demi keamanan.  
* **electron/db.js**  
  * **Peran:** Database Manager.  
  * **Tugas Utama:** Membaca dan menulis ke file courses-data.json di folder AppData user (%APPDATA%).  
  * **Fitur:** Menyimpan daftar kursus, progres menonton, catatan (notes), dan link file attachment.  
* **electron/utils.js**  
  * **Peran:** Helper Scanning File.  
  * **Tugas Utama:** Membaca isi folder secara rekursif.  
  * **Fitur Kunci:** **Numeric Sorting** (Memastikan urutan file Video 1, Video 2, Video 10 benar, bukan Video 1, Video 10, Video 2).

### **2\. Frontend (React Renderer) \- src/**

Folder ini adalah "wajah" aplikasi yang dilihat pengguna.

* **src/App.jsx**  
  * **Peran:** Controller Utama / Router Manual.  
  * **Tugas Utama:**  
    * Menyimpan State global aplikasi (courses, view, activeMenu).  
    * Menangani logika navigasi antar halaman (Dashboard \<-\> Library \<-\> Player).  
    * Menyediakan fungsi global seperti handleDeleteCourse atau handleRenameCourse yang diteruskan ke komponen anak.  
* **src/layouts/MainLayout.jsx**  
  * **Peran:** Kerangka Halaman.  
  * **Tugas Utama:** Menata posisi TitleBar (atas), Sidebar (kiri), dan Content (kanan). Menangani layout responsif saat sidebar di-minimize.

#### **Komponen Tampilan (src/components/views/)**

* **DashboardView.jsx**: Tampilan awal (Home). Menampilkan Hero Section (kursus terakhir dimainkan) dan grid 6 kursus terbaru.  
* **LibraryView.jsx**: Menampilkan **SEMUA** koleksi kursus dengan fitur pencarian dan filter.  
* **SettingsView.jsx**: Halaman pengaturan untuk mengubah lokasi download folder dan reset aplikasi.  
* **CourseCard.jsx**: Komponen kartu kursus yang *reusable*. Memiliki menu dropdown (titik tiga) untuk Rename/Delete dan animasi hover.

#### **Komponen Player (src/components/CoursePlayer.jsx & src/hooks/)**

Ini adalah bagian paling kompleks dari aplikasi.

* **src/hooks/useCoursePlayer.js (Custom Hook)**  
  * **PENTING:** Semua logika Player dipisahkan di sini agar kode UI bersih.  
  * Mengatur State Video, Subtitle, Notes, dan Download.  
  * **Fitur Cerdas:** Memiliki fungsi loadVideos yang melakukan **Path Swapping**. Ia mengecek apakah file video sudah ada di folder LCP\_Downloads lokal. Jika ada, ia akan otomatis mengganti path cloud (Google Drive) dengan path lokal tanpa user sadari.  
* **src/components/player/video-parts/** (Pecahan UI Player)  
  * **VideoPlayer.jsx**: Membungkus tag \<video\> HTML5 standar.  
  * **VideoControls.jsx**: Toolbar custom di bawah video (Speed Control, Theater Mode, Subtitle Settings).  
  * **VideoHeader.jsx**: Menampilkan judul video dan indikator status (Cloud/Local).  
  * **SubtitleSettings.jsx**: Popup untuk mengatur warna, ukuran, dan background subtitle.  
* **src/components/player/** (Panel Samping Player)  
  * **PlaylistSidebar.jsx**: Daftar video di sebelah kanan. Menangani logika centang (watched status).  
  * **TabsSection.jsx**: Tab untuk "My Notes" dan "Attachments".

## **🏗️ Alur Kerja Data (Architecture Flow)**

Bagaimana aplikasi ini bekerja di balik layar?

### **1\. Smart Resume Logic (Melanjutkan Belajar)**

1. User klik kursus di Dashboard.  
2. useCoursePlayer memanggil window.electron.getCourseVideos(path).  
3. Electron men-scan folder asli.  
4. **Frontend Logic:** Sebelum ditampilkan, React mengecek satu-persatu: *"Apakah video ini sudah ada di folder Download lokal?"*.  
5. Jika **YA**: Path diganti ke file lokal (User memutar file lokal \-\> Cepat & Offline).  
6. Jika **TIDAK**: Path tetap mengarah ke source asli (misal: Google Drive G:/... \-\> Streaming).

### **2\. Subtitle Extraction Logic (MKV Support)**

1. Jika video punya file .srt eksternal \-\> Langsung muat.  
2. Jika video adalah .mkv (Embedded Subtitle):  
   * React meminta list track subtitle ke Electron (getEmbeddedSubtitles).  
   * Electron menggunakan ffprobe untuk membaca metadata video.  
   * User memilih bahasa di player \-\> Electron menjalankan ffmpeg untuk mengekstrak track tersebut menjadi file .vtt sementara di folder temp OS.  
   * File .vtt dikirim ke React dan dipasang ke \<video\>.

## **📦 Cara Build (Produksi)**

Untuk membuat file installer .exe yang siap didistribusikan:

1. Pastikan package.json memiliki konfigurasi build yang benar (termasuk icon).  
2. Jalankan:  
   npm run electron:build  

# LCP Media (Local Course Player) 🎥

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-29.0-blue)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)

**LCP Media** adalah aplikasi desktop modern yang dirancang khusus untuk mengelola dan memutar video kursus pembelajaran lokal secara offline. Dibangun dengan **Electron** dan **React**, aplikasi ini menawarkan pengalaman belajar yang fokus, terorganisir, dan bebas gangguan.

---

## ✨ Fitur Utama

* **📚 Manajemen Pustaka Cerdas:** Secara otomatis memindai folder dan menyusun video berdasarkan urutan numerik yang benar.
* **⏯️ Smart Resume:** Melanjutkan video tepat di detik terakhir Anda menonton.
* **📝 Catatan Terintegrasi:** Tulis catatan (notes) untuk setiap video dan simpan secara otomatis.
* **📂 File Attachment:** Hubungkan file pendukung (PDF, materi, kode) ke video tertentu agar mudah diakses.
* **🌐 Multi-Bahasa:** Mendukung Bahasa Indonesia dan Inggris.
* **🚀 Quick Play Mode:** Jadikan sebagai default player! Klik kanan file video di Windows Explorer -> "Open With LCP Media".
* **🌙 Dark Mode:** Tampilan antarmuka modern dengan dukungan tema gelap dan terang.
* **⚡ Performa Tinggi:** Menggunakan Virtual Scrolling untuk menangani ratusan video tanpa lag.
* **☁️ Hybrid Cloud/Local:** (Eksperimental) Mendukung pemutaran dari path Google Drive Desktop.

---

## 🛠️ Teknologi

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Sonner (Toast), Lucide Icons.
* **Backend:** Electron (Main/Renderer Process), Fluent-FFmpeg (untuk ekstraksi subtitle).
* **Storage:** LowDB (JSON Database lokal).

---

## 📦 Instalasi (Pengguna)

1.  Unduh file installer terbaru (`.exe`) dari halaman [Releases](https://github.com/Syaif05/LCP-Media/releases).
2.  Jalankan installer.
3.  Aplikasi siap digunakan!

---

## 💻 Pengembangan (Developer)

Jika Anda ingin berkontribusi atau memodifikasi kode sumber:

### Prasyarat
* Node.js (v16 atau lebih baru)
* NPM atau Yarn

### Langkah-langkah

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/Syaif05/LCP-Media.git](https://github.com/Syaif05/LCP-Media.git)
    cd LCP-Media
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Mode Dev**
    ```bash
    npm run dev
    ```
    Perintah ini akan menjalankan Vite (Frontend) dan Electron (Backend) secara bersamaan.

4.  **Build Aplikasi (Produksi)**
    ```bash
    npm run electron:build
    ```
    Hasil build (installer) akan berada di folder `dist-electron/`.

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat **Pull Request** untuk fitur baru atau perbaikan bug.
1.  Fork proyek ini.
2.  Buat branch fitur Anda (`git checkout -b fitur-keren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Push ke branch (`git push origin fitur-keren`).
5.  Buka Pull Request.

---

## 📝 Lisensi

Dilisensikan di bawah [MIT License](LICENSE).
Dibuat dengan ❤️ oleh **Syaifulloh**.

---

### 📸 Screenshot

*(Anda bisa menambahkan screenshot aplikasi di sini nanti setelah di-upload ke GitHub)*