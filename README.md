# ARSAWIRA Creative Service

Website internal/publik Kominfo untuk:
- katalog layanan desain
- form request desain
- arsip karya
- informasi alur kerja

## Jalankan
```bash
npm install
npm run dev
```

## Mode demo
Tanpa Supabase, form request tetap bekerja dan menyimpan request di localStorage browser.

## Supabase
Salin `.env.example` menjadi `.env`, kemudian isi:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

SQL awal ada di `supabase/schema.sql`.
