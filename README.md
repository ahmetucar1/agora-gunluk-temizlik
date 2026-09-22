# Agora Günlük Temizlik

Agora Şarküteri için mobil uyumlu günlük temizlik takip uygulaması.

## Görevler
16 görev hazır olarak eklenmiştir:
1. Tuvalet temizlenecek
2. Tezgâh toparlanacak
3. Mutfak süpürülecek
4. Mutfak moplanacak
5. Dükkân süpürülecek
6. Dükkân moplanacak
7. Masalar silinecek
8. Zeytin tezgâhı silinecek
9. Peynir tezgâhı silinecek
10. Kahve tezgâhı silinecek
11. Bahçe temizlenecek
12. Bar moplanacak
13. Barın üstü silinecek
14. Bar ekipmanları silinecek
15. Halılar süpürülecek
16. Dükkânın önü sulanacak

## Çalıştırma
`npm install`
`npm run dev`

Firebase kullanmak için Vercel/GitHub ortam değişkenlerine `VITE_FIREBASE_*` değerlerini ekle. Firebase ayarları yoksa uygulama yine çalışır ve günlük kaydı telefonda localStorage'da tutar.

Firestore koleksiyonu: `cleaningDaily`
Belge ID: `YYYY-MM-DD`
