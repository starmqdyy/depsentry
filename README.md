# DepSentry 🛡️

**DepSentry** adalah CLI open-source berbasis Node.js dan TypeScript untuk membandingkan dua file `package.json` dan memprediksi risiko perubahan dependency (`HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`) berbasis Semantic Versioning.

---

## 📦 Installation

Instal DepSentry secara global menggunakan npm:

```bash
npm install -g @starmqdyy/depsentry
```

---

## 🚀 Quick Start

Bandingkan dua file `package.json` secara langsung di terminal:

```bash
depsentry compare package-old.json package-new.json
```

---

## 🛠️ Commands

### `depsentry --help`
Tampilkan pesan bantuan dan daftar perintah yang tersedia.

```bash
depsentry --help
```

### `depsentry --version`
Tampilkan versi DepSentry saat ini.

```bash
depsentry --version
```

### `depsentry compare <old-file> <new-file>`
Bandingkan dua file `package.json` dan tampilkan analisis tingkat risikonya.

```bash
depsentry compare package-old.json package-new.json
```

---

## ⚙️ Options

- `-o, --output <file>` : Simpan hasil analisis perbandingan ke dalam file laporan berformat Markdown.

Contoh penggunaan:

```bash
depsentry compare package-old.json package-new.json --output report.md
```

---

## 📊 Example Output

Hasil keluaran terminal berwarna:

```text
╭──────────────────────────────────────────────╮
│                 DepSentry                    │
│   Dependency Risk Analyzer for Node.js       │
│                                              │
│   Created by starmqdyy                       │
│   github.com/starmqdyy/depsentry             │
╰──────────────────────────────────────────────╯

Files
  Old  ./examples/package-old.json
  New  ./examples/package-new.json

Dependency Changes

● MEDIUM  UPDATED  express
  ^4.17.1 → ^4.18.2
  dependencies · minor update

● MEDIUM  REMOVED  lodash
  ^4.17.21
  dependencies

● MEDIUM  ADDED    axios
  ^1.6.0
  dependencies

● HIGH    UPDATED  typescript
  ^4.9.5 → ^5.3.3
  devDependencies · major update

Risk Summary

  HIGH       1
  MEDIUM     5
  LOW        0
  UNKNOWN    0

Total changes: 6

DepSentry completed successfully.
```

---

## 📝 Markdown Report

Jika kamu menambahkan opsi `--output report.md`, DepSentry akan membuat laporan Markdown murni (tanpa kode warna ANSI) beserta rekomendasi penanganan:

```markdown
# DepSentry Dependency Report

Created by starmqdyy  
Repository: https://github.com/starmqdyy/depsentry

## Files
- **Old**: package-old.json
- **New**: package-new.json

## Summary
- **Total Changes**: 6
- **HIGH Risk**: 1
- **MEDIUM Risk**: 5
- **LOW Risk**: 0
- **UNKNOWN Risk**: 0

## High Risk
### typescript
- **Status**: UPDATED
- **Version**: `^4.9.5` → `^5.3.3`
- **Section**: `devDependencies` (major update)
- **Risk Level**: HIGH
- **Recommendation**: Review breaking changes and run all tests before updating.
```

---

## 💻 Development

Jika kamu ingin berkontribusi atau mengembangkan project ini secara lokal:

```bash
# Clone repository
git clone https://github.com/starmqdyy/depsentry.git
cd depsentry

# Install dependensi
npm install

# Menjalankan unit test (Vitest)
npm test

# Kompilasi TypeScript ke folder dist/
npm run build

# Uji coba secara lokal menggunakan npm link
npm link
depsentry compare ./examples/package-old.json ./examples/package-new.json
```

---

## 👤 Author

**starmqdyy**
- GitHub: [github.com/starmqdyy](https://github.com/starmqdyy)
- Repository: [github.com/starmqdyy/depsentry](https://github.com/starmqdyy/depsentry)

---

## 📜 License

Project ini dilindungi oleh lisensi [MIT](LICENSE).
