# Atlas Rehab — Uygulama İskeleti (MVP)

Atlas Rehab Center için Expo (React Native) ile geliştirilen, mock veriyle çalışan hasta + admin
uygulaması iskeleti. Henüz gerçek bir backend'e bağlı değil — tüm veriler `src/data/seed.ts`
içinde ve uygulama içi state'te (`src/context/AppState.tsx`) tutuluyor.

## İçerdiği akışlar

**Hasta:** kayıt / onay bekliyor → ana sayfa (seri + günlük egzersizler + yaklaşan randevu) →
egzersiz detayı (video/set/tekrar/tamamlama) → randevu talebi (hasta saat görmez, sadece tercih
iletir) → bildirimler (egzersiz hatırlatıcı + admin'in gönderdiği 2-3 saat teklifi, birini seçme).

**Admin:** onay bekleyen hesaplar (onayla/reddet) → randevu talepleri → saat teklif etme (kendi
boş takvimini görür, 2-3 saat seçip hastaya gönderir) → hasta yönetimi (üyeliği biten hastanın
hesabını "geri alınamaz" uyarısıyla silme).

Giriş ekranında bir **"Demo Girişi"** bölümü var — onaylı hasta, onay bekleyen hasta ve admin
rollerine gerçek kayıt olmadan hemen geçebilirsin.

## Çalıştırma

Bu proje bu (bulut) ortamda derlenip senin telefonuna canlı önizleme olarak açılamıyor — ortamın
ağ politikası Expo'nun tünel servisine (ngrok) erişimi engelliyor. Kendi bilgisayarında çalıştırmak
çok kolay:

```bash
git clone <bu repo>
cd atlas-rehab-app
npm install
npx expo start
```

Ardından:
1. Telefonuna **Expo Go** uygulamasını kur (App Store).
2. Bilgisayarın ve telefonun **aynı Wi-Fi ağında** olduğundan emin ol.
3. Terminalde çıkan QR kodu Expo Go ile (ya da iPhone'da doğrudan Kamera ile) okut.
4. Uygulama telefonunda canlı açılır; kod değiştikçe anında güncellenir.

Aynı Wi-Fi'de değilseniz: `npx expo start --tunnel` (kendi bilgisayarınızda `@expo/ngrok`'u
otomatik kurar ve bu ortamdaki gibi engellenmez).

## Sırada ne var

- **Supabase bağlantısı**: Auth (gerçek kayıt/giriş), Postgres tabloları (patients, exercises,
  appointments, notifications), Storage (egzersiz videoları), realtime bildirimler.
- **Push bildirimleri**: Expo Notifications + Supabase Edge Function ile hatırlatıcı/teklif
  gönderimi.
- **App Store yayını**: Apple Developer hesabı alındığında `eas build` ile gerçek `.ipa`.
