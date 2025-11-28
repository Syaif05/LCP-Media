# LCP Media (Local Course Player) 🎵🎥

![LCP Media Banner](https://via.placeholder.com/1200x400.png?text=LCP+Media+v0.5.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-29.0-blue?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue?logo=react)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Stable_v0.5.0-success)]()

**LCP Media** adalah aplikasi desktop *all-in-one* yang menggabungkan manajemen kursus video pembelajaran dengan pemutar musik modern ala Spotify. Dirancang dengan antarmuka **Glassmorphism** yang elegan, aplikasi ini bertujuan untuk menciptakan lingkungan belajar dan hiburan yang fokus, terorganisir, dan estetis.

---

## 🚀 Unduh Aplikasi

Dapatkan versi terbaru (**v0.5.0**) untuk Windows:

[**📥 Download Installer (.exe) via Google Drive**](https://drive.google.com/file/d/1De_67w4zqzWpOUCqYZHGOKX9oLsXAti9/view?usp=sharing)

> **Catatan:** Jika browser memblokir unduhan, silakan pilih "Keep anyway" karena aplikasi ini belum ditandatangani secara digital (self-signed).

---

## ✨ Fitur Utama

### 🎥 Course Player (Video)
Fokus belajar tanpa gangguan dengan fitur LMS offline:
* **Smart Resume:** Melanjutkan video tepat di detik terakhir Anda menonton.
* **Catatan (Notes):** Tulis ringkasan materi langsung di aplikasi untuk setiap video.
* **File Attachments:** Lampirkan file pendukung (PDF, Source Code, Gambar) ke video tertentu agar materi terpusat.
* **Subtitle Otomatis:** Mendukung ekstraksi subtitle dari file MKV dan file eksternal (.srt/.vtt).
* **Course Management:** Scan folder materi secara otomatis dan urutkan berdasarkan nomor seri.

### 🎵 Music Player (Baru di v0.5.0)
Pemutar musik lokal dengan pengalaman pengguna setara aplikasi streaming:
* **Spotify-Style UI:** Antarmuka modern dengan Sidebar Playlist, Cover Art, dan Player Bar melayang.
* **Library Management:** Scan seluruh folder musik Anda secara rekursif.
* **Smart Queue:** Sistem antrian lagu (Add to Queue, Play Next).
* **Playlist:** Buat, edit, dan atur playlist musik Anda sendiri.
* **Playback Modes:** Shuffle (Acak) dan Repeat (Ulang Satu/Semua).
* **Metadata Reader:** Membaca Judul, Artis, dan Album dari file audio secara otomatis.

### 🎨 User Interface & Experience
* **Modern Glassmorphism:** Tampilan transparan yang halus dengan background animasi *ambient*.
* **Day & Night Mode:** Tema terang dan gelap yang bukan sekadar ganti warna, tapi menyesuaikan atmosfer (Siang yang cerah, Malam yang *glowing*).
* **Mini Player Mode:** Perkecil aplikasi menjadi widget *Always on Top* agar bisa menonton/mendengar sambil bekerja di aplikasi lain.
* **Quick Play:** Klik kanan file video/musik di Windows Explorer -> "Open With LCP Media" untuk memutar langsung.

---

## 📸 Screenshots

| Dashboard | Music Player |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x400.png?text=Dashboard+View) | ![Music Player](https://via.placeholder.com/600x400.png?text=Music+Player+View) |

| Video Player | Mini Mode |
|:---:|:---:|
| ![Video Player](https://via.placeholder.com/600x400.png?text=Course+Player+View) | ![Mini Mode](https://via.placeholder.com/600x400.png?text=Mini+Player+Mode) |

*(Screenshot akan segera diperbarui)*

---

## ⌨️ Keyboard Shortcuts

| Tombol | Aksi |
| :--- | :--- |
| **Spasi / K** | Play / Pause |
| **F** | Toggle Fullscreen |
| **M** | Mute / Unmute |
| **Panah Kanan / L** | Maju 5 Detik |
| **Panah Kiri / J** | Mundur 5 Detik |
| **Panah Atas** | Volume Naik |
| **Panah Bawah** | Volume Turun |

---

## 🛠️ Teknologi (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi web modern yang dibungkus untuk desktop:

* **Electron:** Framework utama aplikasi desktop.
* **React + Vite:** Frontend super cepat dan modular.
* **Tailwind CSS:** Styling utility-first untuk desain responsif.
* **Framer Motion:** Animasi UI yang halus (transisi halaman, hover effect).
* **Music-Metadata:** Membaca ID3 tags dari file audio.
* **Fluent-FFmpeg:** Pemrosesan media di backend.
* **LowDB:** Database JSON lokal yang ringan.
* **Sonner:** Notifikasi toast yang cantik.

---

## 💻 Panduan Developer

Ingin memodifikasi atau berkontribusi? Ikuti langkah ini:

### Prasyarat
* Node.js (v16+)
* Git

### Langkah Instalasi
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

4.  **Build Installer (.exe)**
    ```bash
    npm run electron:build
    ```
    File output akan berada di folder `dist-electron/`.

---

## 📝 Lisensi

Dilisensikan di bawah **MIT License**. Bebas digunakan dan dimodifikasi.
Dibuat dengan ❤️ oleh **Syaifulloh**.

---

*Jika Anda menemukan bug atau memiliki saran fitur, silakan buat [Issue](https://github.com/Syaif05/LCP-Media/issues) di repository GitHub.*
