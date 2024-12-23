# Kedi Hastanesi Hasta Yönetim Sistemi

## Proje Hakkında
Bu proje, kedi hastanesindeki hasta kayıtlarını, randevuları, tedavi süreçlerini ve stok yönetimini dijital ortamda takip etmek için geliştirilmiştir. PostgreSQL veritabanı ve Node.js kullanılarak oluşturulan bu sistem, hasta yönetim işlemlerini kolaylaştırır.

---

## Gereksinimler
Projeyi çalıştırmak için aşağıdaki yazılım ve araçların sisteminizde kurulu olduğundan emin olun:

1. **Node.js** (v14.0 veya üzeri)
2. **PostgreSQL** (v12.0 veya üzeri)



### Uygulamayı Çalıştırma
Projeyi başlatmak için aşağıdaki komutu kullanın:

cd C:\Users\leviv\kedi_hastanesi1  // sizin proje klasörünüz

node index.js


## Projenin Kullanımı
1. **Ana Sayfa:** Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı açabilirsiniz.
2. **Hasta Yönetimi:**
   - Yeni hasta eklemek.
   - Mevcut hastaları listelemek, aramak, düzenlemek ve silmek.

![ekle](https://github.com/user-attachments/assets/5e51897a-a5e6-4d14-9070-8035e80815e6)
![ara](https://github.com/user-attachments/assets/3a93ac51-563a-4b23-9cd4-a2fa3a112797)
![düzenle](https://github.com/user-attachments/assets/6ed4ec76-53a3-4a6a-8128-8964c1320b3c)
![sil](https://github.com/user-attachments/assets/f726171f-dd22-4818-ba29-71ed0d6b2465)

---

## Destek
Herhangi bir sorunla karşılaşırsanız, leviverleihtflugel@gmail.com üzerinden iletişime geçin.

######################################
##Örnek SQL - KAYIT EKLEME İfadeleri
######################################

Personel Tablosuna Kayıt Eklemek
Veteriner bilgisi eklemek için önce Personel tablosuna bir kayıt ekledik:

INSERT INTO Personel (Isim, Telefon, Adres, Pozisyon)
VALUES ('Dr. Ahmet', '555-555-5555', 'Ankara', 'Veteriner');

######################################
Veteriner Tablosuna Kayıt Eklemek
Veteriner tablosuna, Personel tablosuna eklenen kaydı referans alarak bir kayıt ekledik:

INSERT INTO Veteriner (VeterinerID, UzmanlikAlani, CalismaSaatleri)
VALUES (1, 'Küçük Hayvanlar', '09:00-18:00');

######################################
RandevuTuru Tablosuna Kayıt Eklemek
Randevu türü kaydı ekleyerek RandevuTurID için bir kayıt oluşturduk:

INSERT INTO RandevuTuru (TurAdi)
VALUES ('Genel Kontrol');

######################################
Randevu Tablosuna Kayıt Eklemek
Son olarak, HastaID, VeterinerID ve RandevuTurID değerlerini kullanarak Randevu kaydını ekledik:

INSERT INTO Randevu (HastaID, VeterinerID, Tarih, Saat, Durum, RandevuTurID)
VALUES (23, 1, '2024-12-23', '10:00', 'Planlanmış', 1);

######################################
##Örnek SQL - KAYIT SORGU İfadeleri
######################################

Personel Tablosundaki Kayıtları Sorgulamak
Eklediğimiz veterinerin kayıt bilgilerini görmek için:

SELECT * FROM Personel WHERE Pozisyon = 'Veteriner';

######################################
Veteriner Tablosundaki Kayıtları Sorgulamak
Veteriner tablosundaki tüm kayıtları görüntülemek için:

SELECT * FROM Veteriner;

######################################
Belirli bir veterineri sorgulamak için:

SELECT * FROM Veteriner WHERE VeterinerID = 1;

######################################
RandevuTuru Tablosundaki Kayıtları Sorgulamak
Eklediğiniz randevu türünü görmek için:

SELECT * FROM RandevuTuru;

######################################
Randevu Tablosundaki Kayıtları Sorgulamak
Eklediğiniz randevuyu görmek için:

SELECT * FROM Randevu;

######################################
Belirli bir hastanın randevusunu sorgulamak için:

SELECT * FROM Randevu WHERE HastaID = 23;

######################################
İlişkili Tablolardan Veri Getirmek
Bir randevunun detaylarını (hasta adı, veteriner adı, randevu türü) görmek için JOIN kullanabilirsiniz:

SELECT 
    r.RandevuID,
    h.Isim AS HastaAdi,
    v.UzmanlikAlani AS VeterinerUzmanlik,
    rt.TurAdi AS RandevuTuru,
    r.Tarih,
    r.Saat,
    r.Durum
FROM Randevu r
JOIN Hasta h ON r.HastaID = h.HastaID
JOIN Veteriner v ON r.VeterinerID = v.VeterinerID
JOIN RandevuTuru rt ON r.RandevuTurID = rt.RandevuTurID;

######################################
Belirli Koşullarla Sorgulama
Örneğin, belirli bir tarihteki randevuları listelemek için:

SELECT * FROM Randevu WHERE Tarih = '2024-12-23';

######################################
Günlük/Haftalık Randevu Raporu: Belirli bir tarihte ya da hafta içinde gerçekleşecek randevuları listeleyebilirsiniz.

SELECT r.RandevuID, h.Isim AS HastaAdi, v.UzmanlikAlani, r.Tarih, r.Saat
FROM Randevu r
JOIN Hasta h ON r.HastaID = h.HastaID
JOIN Veteriner v ON r.VeterinerID = v.VeterinerID
WHERE r.Tarih BETWEEN '2024-12-23' AND '2024-12-30';

######################################
Veteriner Bazlı Rapor: Bir veterinerin kaç randevuya katıldığını ve hangi türlerle ilgilendiğini listeleyebilirsiniz.

SELECT v.VeterinerID, v.UzmanlikAlani, COUNT(r.RandevuID) AS RandevuSayisi
FROM Randevu r
JOIN Veteriner v ON r.VeterinerID = v.VeterinerID
GROUP BY v.VeterinerID, v.UzmanlikAlani;

######################################
