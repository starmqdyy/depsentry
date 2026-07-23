# DepSentry 🛡️

[![CI](https://github.com/starmqdyy/depsentry/actions/workflows/ci.yml/badge.svg)](https://github.com/starmqdyy/depsentry/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@starmqdyy/depsentry)](https://www.npmjs.com/package/@starmqdyy/depsentry)
[![npm downloads](https://img.shields.io/npm/dm/@starmqdyy/depsentry)](https://www.npmjs.com/package/@starmqdyy/depsentry
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-brightgreen)](https://nodejs.org)

**DepSentry** adalah CLI open-source berbasis Node.js dan TypeScript untuk membandingkan dua file `package.json`, mendeteksi perubahan dependency, dan memperkirakan tingkat risikonya berdasarkan Semantic Versioning.

Tingkat risiko yang tersedia:

- `HIGH`
- `MEDIUM`
- `LOW`
- `UNKNOWN`

---

## 📦 Installation

Instal DepSentry secara global melalui npm:

```bash
npm install -g @starmqdyy/depsentry
```

Atau jalankan langsung tanpa instalasi global:

```bash
npx @starmqdyy/depsentry --help
```

---

## 🚀 Quick Start

Bandingkan dua file `package.json`:

```bash
depsentry compare package-old.json package-new.json
```

Jalankan tanpa instalasi global:

```bash
npx @starmqdyy/depsentry compare package-old.json package-new.json
```

---

## ✨ Features

- Membandingkan `dependencies` dan `devDependencies`
- Mendeteksi dependency yang ditambahkan
- Mendeteksi dependency yang dihapus
- Mendeteksi dependency yang diperbarui
- Mengklasifikasikan perubahan versi sebagai patch, minor, atau major
- Memberikan tingkat risiko `LOW`, `MEDIUM`, `HIGH`, atau `UNKNOWN`
- Menampilkan laporan terminal berwarna
- Membuat laporan Markdown
- Menangani file yang tidak ditemukan
- Menangani file JSON yang tidak valid
- Dapat digunakan melalui command `depsentry`

---

## 🛠️ Commands

### `depsentry --help`

Menampilkan bantuan dan daftar command yang tersedia.

```bash
depsentry --help
```

### `depsentry --version`

Menampilkan versi DepSentry yang sedang digunakan.

```bash
depsentry --version
```

### `depsentry compare <old-file> <new-file>`

Membandingkan dua file `package.json` dan menampilkan analisis risikonya.

```bash
depsentry compare package-old.json package-new.json
```

---

## ⚙️ Options

### `-o, --output <file>`

Menyimpan hasil analisis ke file laporan Markdown.

```bash
depsentry compare package-old.json package-new.json --output report.md
```

---

## 📊 Risk Levels

| Risk | Arti |
|---|---|
| `HIGH` | Major version berubah dan berpotensi memiliki breaking changes |
| `MEDIUM` | Minor update, dependency baru, atau dependency dihapus |
| `LOW` | Patch update yang biasanya berisi perbaikan kecil |
| `UNKNOWN` | Versi tidak valid atau tidak dapat dianalisis |

Contoh:

```text
1.2.3 → 1.2.4 = LOW
1.2.3 → 1.3.0 = MEDIUM
1.2.3 → 2.0.0 = HIGH
```

---

## 📺 Example Output

```text
╭──────────────────────────────────────────────╮
│                  DepSentry                   │
│     Dependency Risk Analyzer for Node.js     │
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

Gunakan opsi `--output` untuk membuat laporan Markdown tanpa kode warna ANSI:

```bash
depsentry compare package-old.json package-new.json --output report.md
```

Contoh laporan:

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

Clone repository:

```bash
git clone https://github.com/starmqdyy/depsentry.git
cd depsentry
```

Instal dependency:

```bash
npm install
```

Jalankan unit test:

```bash
npm test
```

Build TypeScript:

```bash
npm run build
```

Uji CLI secara lokal:

```bash
npm link
depsentry --help
depsentry compare ./examples/package-old.json ./examples/package-new.json
```

Hapus global link setelah selesai:

```bash
npm unlink -g @starmqdyy/depsentry
```

---

## ✅ Testing

DepSentry menggunakan Vitest untuk unit testing.

```bash
npm test
```

Setiap push dan pull request menuju branch `main` juga diperiksa otomatis melalui GitHub Actions:

```text
npm ci
npm test
npm run build
```

---

## 📦 npm Package

Package resmi tersedia di npm:

```text
@starmqdyy/depsentry
```

Instalasi:

```bash
npm install -g @starmqdyy/depsentry
```

Halaman npm:

[https://www.npmjs.com/package/@starmqdyy/depsentry](https://www.npmjs.com/package/@starmqdyy/depsentry)

---

## 🤝 Contributing

Kontribusi, laporan bug, dan saran fitur sangat diterima.

1. Fork repository
2. Buat branch baru
3. Lakukan perubahan
4. Jalankan test dan build
5. Buat Pull Request

Sebelum membuat Pull Request, jalankan:

```bash
npm test
npm run build
```

---

## 👤 Author

**starmqdyy**

- GitHub: [github.com/starmqdyy](https://github.com/starmqdyy)
- Repository: [github.com/starmqdyy/depsentry](https://github.com/starmqdyy/depsentry)
- npm: [npmjs.com/package/@starmqdyy/depsentry](https://www.npmjs.com/package/@starmqdyy/depsentry)

---

## 📜 License

DepSentry dirilis menggunakan lisensi [MIT](LICENSE).
