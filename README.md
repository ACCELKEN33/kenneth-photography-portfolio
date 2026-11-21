# Kenneth — Visual Stories (Portfolio)

Website portofolio fotografi & videografi dengan HTML, CSS, dan JavaScript murni (tanpa framework).

## Struktur folder

```text
kenneth-photography-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── IMG_0184.JPG
    ├── IMG_6432.JPG
    ├── IMG_1813.JPG
    ├── IMG_9089.JPG
    ├── DJI_20260704060346_0039_D_K03.JPG
    └── IMG_7880.JPG
```

## Cara menjalankan

1. Buka folder project di VS Code (**File → Open Folder**).
2. Pasang ekstensi **Live Server**, klik kanan `index.html` → **Open with Live Server**.
3. Atau buka `index.html` langsung di browser.

## Fitur

- Hero, statistik (angka berhitung otomatis), dan marquee
- Galeri masonry dengan filter kategori (jumlah foto dihitung otomatis)
- Lightbox: tombol prev/next, panah keyboard, swipe di HP, keterangan foto
- Bagian Services, Process, About, dan Contact (form membuka aplikasi email)
- Menu aktif mengikuti scroll, progress bar, animasi muncul saat scroll
- Responsif (HP, tablet, desktop) dan menghormati pengaturan "reduce motion"

## Cara menambah foto baru

1. Taruh foto di folder `images/`.
2. Salin satu blok `<article class="gallery-card"> ... </article>` di `index.html`.
3. Ganti `src`, `data-full`, `data-title`, `data-caption`, dan `data-category`.
   - `data-category` yang tersedia: `landscape`, `pgti`, `church`.
4. Jumlah di tombol filter akan terhitung sendiri.

## Cara menambah kategori

1. Tambah tombol di `index.html`:
   `<button class="filter-button" data-filter="wedding" aria-pressed="false">Wedding <span class="count"></span></button>`
2. Pakai `data-category="wedding"` pada foto yang sesuai.

## Tips

- Foto besar (beberapa MB) membuat website lambat. Kompres dulu ke lebar sekitar 2000 px (misalnya lewat squoosh.app).
- Ganti email di `index.html` dan `script.js` bila berubah (cari `kennethfredericckkk3@gmail.com`).
