# AGENTS.md

Bu dosya, Codex'in projeyi her çalıştırmada baştan taramak yerine önce yüksek-sinyalli bağlam alması için hazırlanmıştır.
Önce bu dosyayı oku. Sadece görev için gerekli dosyalara in.

## Proje Özeti

- Proje: Kur'an Arapçası öğrenme uygulaması
- Stack: Next.js 16 App Router, React 18, TypeScript, Zustand, Firebase Auth + Firestore, TanStack Query, Tailwind + shadcn/ui
- Canlı ortam: `https://kuran-egitim.web.app`
- Deploy hedefi: Firebase Hosting

## En Önemli Mimari Kararlar

- Uygulama artık SSR/function deploy etmez; static hosting odaklıdır.
- Kur'an okuma route'ları tek kabuk sayfa modeline geçirildi:
  - `/quran/page?number=...`
  - `/quran/surah?id=...`
- Eski linkler Firebase redirect ile korunur:
  - `/quran/page/:number` -> `/quran/page?number=:number`
  - `/quran/surah/:id` -> `/quran/surah?id=:id`
- Kur'an verisi `public/api/quran/` altındaki static JSON dosyalarından okunur.
- Kelime morfoloji popup'ı doğrudan `https://api.acikkuran.com` çağırır.

## Ana Dosyalar

- [app/layout.tsx](C:\Users\YAVUZ\Downloads\islam\kuran\app\layout.tsx)
  Uygulama provider zinciri ve global `ChunkErrorHandler`
- [firebase.json](C:\Users\YAVUZ\Downloads\islam\kuran\firebase.json)
  Hosting ayarları ve eski route redirect'leri
- [services/quran-api.ts](C:\Users\YAVUZ\Downloads\islam\kuran\services\quran-api.ts)
  Static JSON + AcikKuran çeviri fetch katmanı
- [scripts/generate-static-quran-data.mjs](C:\Users\YAVUZ\Downloads\islam\kuran\scripts\generate-static-quran-data.mjs)
  Build öncesi static Quran JSON üretimi
- [stores/quran-store.ts](C:\Users\YAVUZ\Downloads\islam\kuran\stores\quran-store.ts)
  Bookmark/favorite state, local persistence
- [context/auth-context.tsx](C:\Users\YAVUZ\Downloads\islam\kuran\context\auth-context.tsx)
  Firebase auth + Firestore hydrate/merge
- [components/firestore-sync-provider.tsx](C:\Users\YAVUZ\Downloads\islam\kuran\components\firestore-sync-provider.tsx)
  Store -> Firestore sync, debounce + `pagehide` flush
- [components/quran/verse-component.tsx](C:\Users\YAVUZ\Downloads\islam\kuran\components\quran\verse-component.tsx)
  Ayet üstü bookmark ve not davranışı
- [components/quran/interactive-arabic.tsx](C:\Users\YAVUZ\Downloads\islam\kuran\components\quran\interactive-arabic.tsx)
  Kelime popup'ı ve favori kalp davranışı
- [app/kelime/page.tsx](C:\Users\YAVUZ\Downloads\islam\kuran\app\kelime\page.tsx)
  `Kelimelerim` ve `Ayetlerim` ekranı

## Güncel Route Yapısı

- `/` landing
- `/giris` login
- `/kayit` register
- `/dashboard` kullanıcı paneli
- `/admin` admin
- `/quran` -> `/quran/page?number=1`
- `/quran/page` static shell, query ile sayfa numarası
- `/quran/surah` static shell, query ile sure id
- `/quran/surahs` sure listesi
- `/quran/bookmarks` kayıtlı ayetler + notlar
- `/kelime` kütüphane: favori kelimeler ve ayetler
- `/ogren`, `/oyun`, `/quiz`, `/developers`

## Veri Kaynakları

- Yerel veri:
  - `data/ayahs-data.json`
  - `data/surahs-data.json`
  - `data/surah-tr.json`
- Build çıktısı:
  - `public/api/quran/chapters.json`
  - `public/api/quran/ayahs-by-surah.json`
- Harici veri:
  - `api.acikkuran.com` -> Türkçe meal ve `verseparts`

## Favori/Bookmark Davranışı

- Kelime favorileri `quran-store.favoriteWords` içinde tutulur.
- Ayet işaretleri `quran-store.bookmarks` içinde tutulur.
- Store artık `zustand persist` ile local storage'a da yazılır.
- Firestore hydrate local state'i ezmez, merge eder.
- Ayet kartındaki:
  - `Bookmark` butonu doğrudan ekle/kaldır yapar
  - `StickyNote` butonu not dialog'unu açar

## Deploy ve Performans

- Build komutundan önce static veri üretilir:
  - `npm run build`
- Hosting deploy:
  - `firebase deploy --only hosting`
- Son optimize edilmiş deploy süresi yaklaşık `25 sn`
- Başlangıç deploy süresi yaklaşık `349 sn` idi

## Bilinen Kritik Noktalar

- Firebase Hosting tarafında Next.js 16 resmi olarak tam destek garantili değil; yine de mevcut yapı deploy oluyor.
- Deploy sonrası eski tarayıcı sekmeleri eski chunk hash'lerine düşebilir.
  - Bunu toparlamak için global chunk error handler eklendi.
- `favicon.ico` artık `public/favicon.ico` olarak mevcut.
- Bu projede büyük değişiklik yapmadan önce route modelini bozma:
  - Query tabanlı shell route sistemi deploy hızının ana sebebi.

## Codex İçin Çalışma Kuralı

- Önce bu dosyayı oku.
- Sonra yalnızca görevle ilgili dosyaları aç.
- `services/quran-api.ts`, `stores/quran-store.ts`, `auth-context.tsx`, `firebase.json` ve ilgili UI bileşenlerini referans al.
- Tüm repo taraması ancak bu dosyadaki bilgi yetersiz kalırsa yapılmalı.
