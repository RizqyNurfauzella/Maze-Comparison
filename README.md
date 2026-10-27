# Maze Runner: DFS Algorithm Comparison Tool

## 📋 Deskripsi Proyek

Proyek ini adalah aplikasi web interaktif untuk membandingkan efisiensi algoritma **Depth-First Search (DFS) Iteratif** vs **DFS Rekursif** pada labirin (maze) dengan tema Maze Runner. Aplikasi ini mengimplementasikan kedua pendekatan DFS untuk menemukan jalur dari titik awal ke titik akhir.

Proyek ini dikembangkan sebagai bagian dari Tugas Besar mata kuliah **Analisis Kompleksitas Algoritma**, dengan fokus pada analisis perbandingan kompleksitas waktu dan ruang antara pendekatan iteratif vs rekursif pada DFS.

## 🎯 Tujuan Akademik

- Membandingkan efisiensi **DFS Iteratif** vs **DFS Rekursif** dalam hal:
  - Running Time
  - Space Complexity (overhead rekursi)
  - Praktikalitas implementasi
- Visualisasi proses pencarian jalur secara real-time
- Analisis kompleksitas dengan berbagai ukuran input (N x N)

## ✨ Fitur Utama

### 🧩 Generator Maze
- Maze dibuat menggunakan algoritma **random walls** (30% probability)
- **Start** selalu di **(0,0)** (pojok kiri atas)
- **Exit** selalu di **(N-1, N-1)** (pojok kanan bawah)
- Memastikan start dan exit selalu path (tidak tertutup dinding)
- Dead ends untuk meningkatkan kompleksitas

### 🔍 Algoritma Pencarian
- **DFS Iteratif**: Implementasi standar dengan stack
- **DFS Rekursif**: Implementasi rekursif murni untuk eksplorasi maze

> **Catatan:** DFS menemukan salah satu jalur yang valid dari start ke exit, tetapi tidak menjamin jalur terpendek.

### 🎬 Visualisasi Interaktif
- Animasi step-by-step pencarian node (visited nodes berwarna kuning)
- Progress bar dengan scrubbing (maju/mundur animasi)
- Kontrol **Play/Pause/Reset**
- Speed control (1x - 10x)
- Highlight jalur yang ditemukan dengan warna berbeda:
  - DFS Iterative: **Biru**
  - DFS Recursive: **Merah**

### 📊 Analisis Kompleksitas
- Tabel analisis waktu eksekusi dan nodes dikunjungi DFS
- Grafik untuk visualisasi tren kompleksitas DFS
- Input N untuk analisis berbagai ukuran maze (5-100)
- Switch view antara **Table** dan **Graph**
- **Export Table to CSV**: Download data analisis
- **Download Chart Image**: Simpan grafik sebagai PNG

### 🎨 UI/UX Modern
- Tema gelap dengan gradient background
- Card-based layout dengan glassmorphism effects
- Modern typography (Segoe UI)
- Interactive buttons dengan hover effects
- Responsive design dengan max-width containers
- Export controls yang muncul setelah analysis

## 🛠️ Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Visualization**: Matplotlib (untuk grafik analisis)
- **Styling**: Custom CSS dengan tema dark

## 📦 Instalasi

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/RizqyNurfauzella/Maze-Comparison.git
   cd Maze-Comparison
   ```

2. **Install Dependencies**
   ```bash
   pip install flask matplotlib
   ```

3. **Run Aplikasi**
   ```bash
   python app.py
   ```

4. **Akses Browser**
   ```
   http://127.0.0.1:5000
   ```

## 🚀 Cara Penggunaan

### 1. Generate Maze
- Masukkan ukuran maze N (5-100, default: 15)
- Klik "Generate Maze" untuk membuat maze baru
- Start selalu di kiri atas (hijau), Exit di kanan bawah (merah)

### 2. Jalankan Algoritma
- Klik tombol "Run DFS Iterative" atau "Run DFS Recursive"
- Amati animasi pencarian secara real-time:
  - Nodes visited: **Kuning**
  - Jalur yang ditemukan: **Biru/Merah**
- Gunakan kontrol **Play/Pause/Reset** dan **Speed** (1x-10x)
- Drag progress bar untuk maju/mundur animasi

### 3. Analisis Kompleksitas
- Masukkan max N untuk analisis (misal: 20)
- Klik "Run Analysis"
- Pilih view "Table" atau "Graph" untuk melihat hasil
- **Export Table to CSV**: Download data analisis
- **Download Chart Image**: Simpan grafik sebagai PNG

## 📁 Struktur Proyek

```
Maze-Comparison/
├── app.py                 # Main Flask application
├── maze.py                # Maze generation logic
├── dfs.py                 # DFS implementations (iterative and recursive)
├── analysis.py            # Complexity analysis with matplotlib
├── templates/
│   └── index.html         # Main HTML template
├── static/
│   ├── style.css          # CSS styling
│   ├── script.js          # Frontend JavaScript
│   └── analysis.png       # Generated analysis chart
└── README.md              # Project documentation
```

## 📈 Analisis Kompleksitas

### Teori Kompleksitas
- **DFS**: O(V + E) - Eksplorasi depth-first
- **Iteratif vs Rekursif**: Iteratif lebih efisien untuk maze besar (tidak ada recursion depth limit)

### Perbandingan Praktis
- **Iteratif vs Rekursif**: Iteratif lebih efisien untuk maze besar (tidak ada recursion depth limit)
- **Space Complexity**: Iteratif O(V), Rekursif O(V + H) dimana H adalah kedalaman rekursi

## 🎯 Fitur Khusus

- **Auto-Analysis**: Untuk N > 70, analysis langsung dijalankan otomatis
- **Maze Hiding**: Untuk N > 70, maze tidak ditampilkan untuk performa
- **Responsive Cells**: Ukuran cell menyesuaikan ukuran maze
- **Fixed Start/Exit**: Start (0,0) dan Exit (N-1,N-1) selalu konsisten
- **Playback Controls**: Play/Pause/Reset dengan progress scrubbing
- **Export Features**: CSV export dan image download untuk analysis
- **Modern UI**: Glassmorphism cards dengan gradient effects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Authors

- **Nama Anda** - *Initial work* - [GitHub Profile]

## 🙏 Acknowledgments

- Maze Runner movie inspiration
- Flask documentation
- Matplotlib visualization library
- Analisis Kompleksitas Algoritma course materials

---

**Catatan**: Proyek ini dikembangkan untuk tujuan edukasi dan akademik. Pastikan Python dan dependencies terinstall dengan benar sebelum menjalankan aplikasi.