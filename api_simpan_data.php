<?php
// api_simpan_data.php - Menyimpan data ke database
header('Content-Type: application/json');
require_once 'koneksi.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// Untuk request JSON
$input = json_decode(file_get_contents('php://input'), true);
if ($input) {
    $_POST = array_merge($_POST, $input);
}

switch ($action) {
    
    // TAMBAH DATA
    case 'tambah':
        $bsu = mysqli_real_escape_string($conn, $_POST['bsu'] ?? '');
        $rw = mysqli_real_escape_string($conn, $_POST['rw'] ?? '');
        $rt = mysqli_real_escape_string($conn, $_POST['rt'] ?? '');
        $nama = mysqli_real_escape_string($conn, $_POST['nama'] ?? '');
        $jenis = mysqli_real_escape_string($conn, $_POST['jenis'] ?? 'nonorganik');
        $berat = (float)($_POST['berat'] ?? 0);
        $harga = (int)($_POST['harga'] ?? 0);
        
        if (!$rw || !$rt || !$nama || $berat <= 0) {
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            break;
        }
        
        // Cari atau buat id_jenis
        $qJenis = "SELECT id_jenis, harga_per_kg FROM jenis_sampah WHERE nama_jenis = '$nama' LIMIT 1";
        $rJenis = mysqli_query($conn, $qJenis);
        
        if (mysqli_num_rows($rJenis) > 0) {
            $rowJenis = mysqli_fetch_assoc($rJenis);
            $idJenis = $rowJenis['id_jenis'];
            if ($harga == 0) $harga = $rowJenis['harga_per_kg'];
        } else {
            // Tentukan id_kategori
            $idKat = ($jenis === 'organik') ? 1 : 2;
            $qInsert = "INSERT INTO jenis_sampah (id_kategori, nama_jenis, harga_per_kg) VALUES ($idKat, '$nama', $harga)";
            mysqli_query($conn, $qInsert);
            $idJenis = mysqli_insert_id($conn);
        }
        
        // Cari id_bsu
        $idBsu = 'NULL';
        if ($bsu) {
            $qBsu = "SELECT id_bsu FROM bsu WHERE nama_bsu = '$bsu' LIMIT 1";
            $rBsu = mysqli_query($conn, $qBsu);
            if (mysqli_num_rows($rBsu) > 0) {
                $idBsu = (int)mysqli_fetch_assoc($rBsu)['id_bsu'];
            }
        }
        
        $total = $berat * $harga;
        // Menggunakan admin default (id_admin = 1)
        $adminId = 1;
        
        $query = "INSERT INTO transaksi_sampah (id_bsu, id_jenis, rw, rt, berat_kg, harga_per_kg, total_nilai, jenis, id_admin) 
                  VALUES ($idBsu, $idJenis, '$rw', '$rt', $berat, $harga, $total, '$jenis', $adminId)";
        
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true, 'message' => 'Data berhasil ditambahkan']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal simpan: ' . mysqli_error($conn)]);
        }
        break;
    
    // EDIT DATA
    case 'edit':
        $id = (int)($_POST['id'] ?? 0);
        $bsu = mysqli_real_escape_string($conn, $_POST['bsu'] ?? '');
        $rw = mysqli_real_escape_string($conn, $_POST['rw'] ?? '');
        $rt = mysqli_real_escape_string($conn, $_POST['rt'] ?? '');
        $nama = mysqli_real_escape_string($conn, $_POST['nama'] ?? '');
        $jenis = mysqli_real_escape_string($conn, $_POST['jenis'] ?? 'nonorganik');
        $berat = (float)($_POST['berat'] ?? 0);
        $harga = (int)($_POST['harga'] ?? 0);
        
        if (!$id || !$rw || !$rt || !$nama || $berat <= 0) {
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            break;
        }
        
        // Cari atau buat id_jenis
        $qJenis = "SELECT id_jenis, harga_per_kg FROM jenis_sampah WHERE nama_jenis = '$nama' LIMIT 1";
        $rJenis = mysqli_query($conn, $qJenis);
        
        if (mysqli_num_rows($rJenis) > 0) {
            $rowJenis = mysqli_fetch_assoc($rJenis);
            $idJenis = $rowJenis['id_jenis'];
            if ($harga == 0) $harga = $rowJenis['harga_per_kg'];
        } else {
            $idKat = ($jenis === 'organik') ? 1 : 2;
            $qInsert = "INSERT INTO jenis_sampah (id_kategori, nama_jenis, harga_per_kg) VALUES ($idKat, '$nama', $harga)";
            mysqli_query($conn, $qInsert);
            $idJenis = mysqli_insert_id($conn);
        }
        
        // Cari id_bsu
        $idBsu = 'NULL';
        if ($bsu) {
            $qBsu = "SELECT id_bsu FROM bsu WHERE nama_bsu = '$bsu' LIMIT 1";
            $rBsu = mysqli_query($conn, $qBsu);
            if (mysqli_num_rows($rBsu) > 0) {
                $idBsu = (int)mysqli_fetch_assoc($rBsu)['id_bsu'];
            }
        }
        
        $total = $berat * $harga;
        
        $query = "UPDATE transaksi_sampah SET 
                    id_bsu = $idBsu,
                    id_jenis = $idJenis,
                    rw = '$rw',
                    rt = '$rt',
                    berat_kg = $berat,
                    harga_per_kg = $harga,
                    total_nilai = $total,
                    jenis = '$jenis'
                  WHERE id_transaksi = $id";
        
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true, 'message' => 'Data berhasil diupdate']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal update: ' . mysqli_error($conn)]);
        }
        break;
    
    // HAPUS DATA
    case 'hapus':
        $id = (int)($_POST['id'] ?? 0);
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
            break;
        }
        
        $query = "DELETE FROM transaksi_sampah WHERE id_transaksi = $id";
        
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true, 'message' => 'Data berhasil dihapus']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal hapus: ' . mysqli_error($conn)]);
        }
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Action tidak ditemukan']);
        break;
}

mysqli_close($conn);
?>