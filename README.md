AR4UPLOAD
simple • fast • file sharing web
AR4UPLOAD adalah web berbagi file dengan pendekatan minimalis, ringan, dan langsung guna.
tujuannya satu: upload file → dapat link → share → selesai.
tanpa distraksi
tanpa gimmick
tanpa basa-basi
tentang AR4UPLOAD
banyak web file sharing terlalu:
berat
ribet
overfeature
AR4UPLOAD memilih jalan sebaliknya:
melakukan satu hal kecil dengan benar
fitur utama
upload file dengan UI sederhana
generate shareable link
fast load dan ringan
easy to extend
alur kerja singkat
alur dasar sistem upload:
Copy code
Txt
user pilih file
→ klik upload
→ file diproses
→ link dibuat
→ file siap dibagikan
simpel. logis. bisa diskalakan.
contoh potongan implementasi
HTML upload form:
Copy code
Html
<form id="uploadForm">
  <input type="file" id="fileInput" />
  <button type="submit">upload</button>
</form>
JavaScript handling:
Copy code
Js
document.getElementById("uploadForm").addEventListener("submit", e => {
  e.preventDefault();
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;
  console.log("uploading:", file.name);
});
kode dibuat readable, bukan sok pinter.
teknologi yang digunakan
HTML – struktur
CSS – tampilan
JavaScript – logic
backend & storage menyesuaikan implementasi repo.
struktur repository
Copy code
Txt
AR4UPLOAD/
├── index.html
├── style.css
├── script.js
├── assets/
└── README.md
rapi itu bukan gaya
rapi itu kebiasaan
cara menjalankan
clone repository:
Copy code
Bash
git clone https://github.com/aryaxzell/AR4UPLOAD.git
buka:
Copy code
Txt
index.html
atau jalankan lewat server lokal jika terhubung backend.
roadmap
user authentication
file size limit
expired download link
user dashboard
security improvement
pelan
tapi niat
status project
active development
fokus ke fondasi sebelum nambah fitur.
lisensi
bebas dipelajari dan dikembangkan.
jangan copas mentah lalu sok jadi creator.
penutup
AR4UPLOAD itu kecil.
tapi kecil yang punya arah.
kalau mau gede,
fondasinya harus waras.
