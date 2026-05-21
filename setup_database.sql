-- =====================================================
-- SETUP DATABASE BANK SAMPAH DIGITAL
-- Jalankan file ini di phpMyAdmin XAMPP
-- =====================================================

CREATE DATABASE IF NOT EXISTS bank_sampah_digital
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bank_sampah_digital;

-- =====================================================
-- TABEL ADMIN
-- =====================================================
CREATE TABLE IF NOT EXISTS admin (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash',
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('admin','operator') NOT NULL DEFAULT 'operator',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABEL KATEGORI SAMPAH (organik / nonorganik)
-- =====================================================
CREATE TABLE IF NOT EXISTS kategori_sampah (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO kategori_sampah (nama_kategori) VALUES
('organik'),
('nonorganik');

-- =====================================================
-- TABEL JENIS SAMPAH (nama spesifik + harga)
-- =====================================================
CREATE TABLE IF NOT EXISTS jenis_sampah (
    id_jenis INT AUTO_INCREMENT PRIMARY KEY,
    id_kategori INT NOT NULL,
    nama_jenis VARCHAR(200) NOT NULL,
    harga_per_kg INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_kategori) REFERENCES kategori_sampah(id_kategori)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABEL BSU (Bank Sampah Unit)
-- =====================================================
CREATE TABLE IF NOT EXISTS bsu (
    id_bsu INT AUTO_INCREMENT PRIMARY KEY,
    nama_bsu VARCHAR(100) NOT NULL,
    rw VARCHAR(10) NOT NULL,
    rt VARCHAR(10) NOT NULL DEFAULT 'all'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABEL TRANSAKSI SAMPAH
-- =====================================================
CREATE TABLE IF NOT EXISTS transaksi_sampah (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    id_bsu INT NULL,
    id_jenis INT NOT NULL,
    rw VARCHAR(10) NOT NULL,
    rt VARCHAR(10) NOT NULL,
    berat_kg DECIMAL(10,2) NOT NULL,
    harga_per_kg INT NOT NULL,
    total_nilai DECIMAL(15,2) NOT NULL,
    jenis ENUM('organik','nonorganik') NOT NULL,
    tanggal_transaksi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_admin INT NOT NULL,
    FOREIGN KEY (id_bsu) REFERENCES bsu(id_bsu) ON DELETE SET NULL,
    FOREIGN KEY (id_jenis) REFERENCES jenis_sampah(id_jenis),
    FOREIGN KEY (id_admin) REFERENCES admin(id_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABEL LOG AKTIVITAS
-- =====================================================
CREATE TABLE IF NOT EXISTS log_aktivitas (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_admin INT NOT NULL,
    aktivitas VARCHAR(100) NOT NULL,
    detail TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_admin) REFERENCES admin(id_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- DATA AWAL: 2 AKUN (ADMIN + TAMU)
-- =====================================================
-- Hapus data lama jika ada
DELETE FROM admin;

-- Reset auto increment
ALTER TABLE admin AUTO_INCREMENT = 1;

-- AKUN 1: ADMIN (Full akses)
-- Username: bsi_mandiri | Password: mandiri2025
INSERT INTO admin (username, password, nama_lengkap, role) VALUES
('bsi_mandiri', SHA2('mandiri2025', 256), 'Administrator BSI Mandiri', 'admin');

-- AKUN 2: TAMU / OPERATOR (Hanya baca)
-- Username: tamu_bsi | Password: sampahku2025
INSERT INTO admin (username, password, nama_lengkap, role) VALUES
('tamu_bsi', SHA2('sampahku2025', 256), 'Pengunjung / Tamu', 'operator');

-- =====================================================
-- DATA BSU (BANK SAMPAH UNIT)
-- =====================================================
INSERT INTO bsu (nama_bsu, rw, rt) VALUES
('BSU MEDE 1','RW01','RT01'),('BSU MEDE 2','RW01','RT02'),
('BSU MEDE 3','RW01','RT03'),('BSU MEDE 4','RW01','RT04'),
('BSU PELANGI CERIA','RW02','RT01'),('BSU PELANGI 2','RW02','RT02'),
('BSU PELANGI KENANGA','RW02','RT03'),('BSU PELANGI BUNDA','RW02','RT04'),
('BSU RW03 RT01','RW03','RT01'),('BSU RW03 RT02','RW03','RT02'),
('BSU RW03 RT03','RW03','RT03'),('BSU FORSILA','RW04','RT01'),
('BSU BERSERI 04','RW04','RT02'),('BSU BINTANG KEJORA 1','RW05','RT01'),
('BSU BINTANG KEJORA 2','RW05','RT02'),('BSU TERANG','RW06','RT01'),
('BSU RW06 RT02','RW06','RT02'),('BSU RW06 RT03','RW06','RT03'),
('BSU RW06 RT04','RW06','RT04'),('BSU RW06 RT05','RW06','RT05'),
('BSU BERSEMI 0107','RW07','RT01'),('BSU BERSEMI 07','RW07','RT02'),
('BSU RW07 RT03','RW07','RT03'),('BSU RW07 RT04','RW07','RT04'),
('BSU RW07 RT05','RW07','RT05'),('BSU MENTARI 01','RW08','RT01'),
('BSU MENTARI','RW08','RT02'),('BSU KP KIDOEL','RW09','all'),
('BSU MAWARGA','RW10','RT01'),('BSU SRIKANDI','RW10','RT02'),
('BSU RW10 RT03','RW10','RT03'),('BSU RW11 RT01','RW11','RT01'),
('BSU ZALAK 2','RW11','RT02'),('BSU RW11 RT03','RW11','RT03'),
('BSU RW12 RT01','RW12','RT01'),('BSU RW12 RT02','RW12','RT02'),
('BSU RW12 RT03','RW12','RT03'),('BSU CEMERLANG 1','RW13','RT01'),
('BSU CEMERLANG 2','RW13','RT02'),('BSU CEMERLANG 3','RW13','RT03'),
('BSU RW14 RT01','RW14','RT01'),('BSU RW14 RT02','RW14','RT02'),
('BSU RW14 RT03','RW14','RT03');

-- =====================================================
-- DATA JENIS SAMPAH & HARGA
-- =====================================================
-- Plastik (nonorganik)
INSERT INTO jenis_sampah (id_kategori, nama_jenis, harga_per_kg) VALUES
(2,'Pet A - Botol TANPA tutup dan label + Galon Le Mineral',3500),
(2,'Pet B - Masih berlabel dan tutup',2000),
(2,'Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)',3000),
(2,'Botol Plastik Campuran Semua Warna dan Bentuk',1500),
(2,'Botol Warna MILKU dan NUTRIBOOST',2500),
(2,'Gelas A - Gelas plastik kemasan bening TANPA SABLON DAN LABEL',2500),
(2,'Gelas B - Warna jernih DENGAN SABLON DAN LABEL',1500),
(2,'Gelas Warna (Mountea, Tea Gelas, Ale2)',2000),
(2,'Emberan - Semua plastik lunak YANG BUKAN HITAM',2000),
(2,'Kresek / Assoy',500),
(2,'Plastik Bening Polos PP/PE',2000),
(2,'Sedotan Plastik Aqua',1000),
(2,'Sedotan Plastik Putih Susu',800),
(2,'Sedotan Plastik Warna Campur',600),
(2,'Sedotan Plastik Hitam',300),
(2,'Tutup Botol Plastik / HDPE',3000),
(2,'Tutup Galon Aqua Plastik / LDPE',2000),
(2,'Tutup Galon Isi Ulang',1500),
(2,'Galon AQUA / OASIS UTUH',15000),
(2,'Galon AQUA / OASIS PECAH BELAH',5000),
(2,'Boncos (karung bekas, tali rapiah plastik)',500),
-- Logam (nonorganik)
(2,'Alumunium',10000),
(2,'Besi',3000),
(2,'Tembaga',50000),
(2,'Seng',2000),
(2,'Stainless Steel',5000),
(2,'Timah',8000),
(2,'Babet - Bekas onderdil, sperpart, besi berlapis chrome',5000),
(2,'Kabin / Enamel / Besi lapis cat / Crom Warna / CPU komputer',2000),
-- Kertas (nonorganik)
(2,'Kardus',1600),
(2,'Kertas Koran A / Utuh',700),
(2,'Kertas Koran B / Lecek tidak utuh',100),
(2,'HVS / Kertas Putih',1500),
(2,'Kertas Campuran',500),
(2,'Buku',500),
(2,'Duplex / Karton',800),
-- Organik
(1,'Sampah Dapur Organik',0),
(1,'Daun Kering',0),
(1,'Sisa Makanan',0),
(1,'Sampah Organik Lainnya',0);

-- =====================================================
-- CEK HASIL AKUN
-- =====================================================
SELECT id_admin, username, nama_lengkap, role, created_at FROM admin;

-- =====================================================
-- SELESAI
-- =====================================================
-- 🔐 AKUN LOGIN BARU:
-- =====================================================
-- 👑 ADMIN:   username = bsi_mandiri | password = mandiri2025
-- 👤 TAMU:    username = tamu_bsi    | password = sampahku2025
-- =====================================================