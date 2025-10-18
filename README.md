# Shoes Care POS (Frontend)

Aplikasi **Point of Sales** untuk **Laundry Sepatu** tanpa struk fisik. Dibangun dengan **React + Vite**, **TypeScript**, dan **Tailwind CSS**. Fokus pada pembuatan transaksi, manajemen rak, pelacakan status via **QR/Invoice**, dan proses **pengambilan sepatu**.

## ✨ Core Feature
- **Authentication & User Management**
  - Login (Admin/Customer), Registrasi Customer (opsional), profil pengguna.
- **Role-based UI**
  - **Admin/Superadmin**: kelola rak, buat & proses transaksi.
  - **Customer**: lihat transaksi sendiri, lacak status, scan QR untuk pickup.
- **Manajemen Rak**
  - Buat, edit, hapus rak; status **AVAILABLE/OCCUPIED/MAINTENANCE**.
- **Pembuatan Transaksi**
  - Input harga, pilih rak, snapshot data customer, generate **Invoice & QR**.
- **Lacak Transaksi**
  - Cari via **QR** atau **Invoice**; tampilkan timeline status.
- **Pengambilan Sepatu**
  - Scan QR ➜ validasi ➜ ubah status ➜ kosongkan rak.
- **Status Transaksi + Riwayat**
  - `PENDING → ON_PROCESS → READY_TO_PICKUP → COMPLETED` (atau `FAILED`).
- **UI/UX**
  - Desain modern bertema “laundry sepatu”, akses cepat ke fitur utama, dark-mode ready (opsional).

## 🛠️ Tech Stack
- **React** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- (Opsional) React Query / Zustand untuk state & data fetching
- (Opsional) QR Scanner (html5-qrcode / react-qr-reader)

## 📂 Project Structure
```
📦 shoes-care-pos-frontend
├── 📁 src
│   ├── 📁 core
│   │   ├── 📁 models           # tipe data (User, Rack, Transaction, History)
│   │   ├── 📁 service          # api client (auth, racks, transactions)
│   │   └── 📁 config           # env, constants, interceptors
│   ├── 📁 entries
│   │   ├── 📄 app.tsx          # root app (router, providers)
│   │   └── 📄 index.css        # tailwind base
│   ├── 📁 feature
│   │   ├── 📁 components       # UI reusable
│   │   │   ├── ⚛ RackCard.tsx
│   │   │   ├── ⚛ TransactionCard.tsx
│   │   │   └── ⚛ QRScanner.tsx
│   │   ├── 📁 hooks            # useAuth, useRacks, useTransactions
│   │   │   ├── ⚛ useAuth.ts
│   │   │   └── ⚛ useTransactions.ts
│   │   └── 📁 views            # halaman
│   │       ├── ⚛ LoginView.tsx
│   │       ├── ⚛ DashboardView.tsx
│   │       ├── ⚛ RacksView.tsx
│   │       ├── ⚛ TransactionCreateView.tsx
│   │       ├── ⚛ TransactionTrackView.tsx   # lookup by QR/Invoice
│   │       └── ⚛ PickupView.tsx             # scan & complete
├── 📄 index.html
├── 📄 README.md
└── 📄 vite.config.ts
```

## 🗺️ Rute Halaman (contoh)
- `/login` – Login sebagai **Admin** atau **Customer**
- `/` – Dashboard ringkas (quick actions, ringkasan status hari ini)
- `/racks` – Daftar & kelola rak
- `/transactions` – Daftar transaksi (filter status)
- `/transactions/new` – Buat transaksi
- `/track` – Form lacak transaksi (input QR/Invoice)
- `/pickup` – Scan QR untuk pengambilan

## 🔧 Environment
Buat `.env` di root:
```env
VITE_API_BASE_URL="http://localhost:4000"
VITE_APP_NAME="Shoes Care POS"
```

## 🚀 How to run?
### Requirement
- Node.js & npm/yarn

### Step by step
```bash
# 1️⃣ Clone
git clone https://github.com/your-org/shoes-care-pos-frontend.git
cd shoes-care-pos-frontend

# 2️⃣ Setup Environment
cp .env.example .env
# Edit VITE_API_BASE_URL sesuai backend

# 3️⃣ Install dependency
yarn install    # atau: npm install

# 4️⃣ Jalankan aplikasi
yarn dev        # atau: npm run dev
```

## 🔌 Integrasi API (ringkas)
- **Auth**
  - `POST /auth/login`, `POST /auth/register`, `GET /users/profile/me`
- **Racks**
  - `GET/POST/PUT/DELETE /racks`
- **Transactions**
  - `GET /transactions` (admin)
  - `POST /transactions` (admin)
  - `GET /transactions/my` (customer)
  - `GET /transactions/lookup?qr=... | ?invoice=...`
  - `POST /transactions/scan` (pickup by QR)

> **Format QR**: `sc-pos:tx:{INVOICE}`

## 🧩 Komponen Kunci
- `LoginView`: form **Email, Password, Login sebagai (Admin/Customer)** dengan segmented control.
- `QRScanner`: wrapper lib scanner (kamera) + handler sukses (navigate/aksi).
- `TransactionCard`: status badge, invoice, customer, rak, tombol aksi cepat.
- `RackCard`: status rak + action assign/unassign.

## ✅ Best Practices
- Simpan **role** di auth state & guard route (Admin vs Customer).
- Gunakan **React Query/Zustand** untuk cache transaksi & rak.
- Debounce pencarian invoice/QR.
- Tampilan **timeline history** di detail transaksi.

## 🤝 Contributions
Kontribusi sangat terbuka! Fork repo ini, buat branch baru, lalu ajukan Pull Request.

## 📜 License
MIT

---
🚀 Built with ❤️ for **Muhammad Fikrianto Aji**
