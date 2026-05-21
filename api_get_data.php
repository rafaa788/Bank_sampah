<?php
// api_get_data.php - Mengambil data dari database secara realtime
header('Content-Type: application/json');
require_once 'koneksi.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    
    // Ambil semua data transaksi sampah
    case 'get_all_transaksi':
        $query = "SELECT 
                    t.id_transaksi as id,
                    b.nama_bsu as bsu,
                    t.rw,
                    t.rt,
                    j.nama_jenis as nama,
                    t.jenis,
                    t.berat_kg as berat,
                    t.harga_per_kg as hargaPerKg,
                    t.total_nilai as totalNilai,
                    DATE_FORMAT(t.tanggal_transaksi, '%Y-%m-%d %H:%i:%s') as tanggal
                  FROM transaksi_sampah t
                  JOIN jenis_sampah j ON t.id_jenis = j.id_jenis
                  LEFT JOIN bsu b ON t.id_bsu = b.id_bsu
                  ORDER BY t.tanggal_transaksi DESC";
        
        $result = mysqli_query($conn, $query);
        $data = [];
        
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'id' => (int)$row['id'],
                'bsu' => $row['bsu'] ?? null,
                'rw' => $row['rw'],
                'rt' => $row['rt'],
                'nama' => $row['nama'],
                'jenis' => $row['jenis'],
                'berat' => (float)$row['berat'],
                'hargaPerKg' => (int)$row['hargaPerKg'],
                'totalNilai' => (float)$row['totalNilai'],
                'tanggal' => $row['tanggal']
            ];
        }
        
        echo json_encode(['success' => true, 'data' => $data]);
        break;
    
    // Ambil statistik
    case 'get_statistik':
        $query = "SELECT 
                    SUM(CASE WHEN j.id_kategori = 1 THEN t.berat_kg ELSE 0 END) as total_organik,
                    SUM(CASE WHEN j.id_kategori != 1 THEN t.berat_kg ELSE 0 END) as total_nonorganik,
                    COUNT(*) as total_transaksi,
                    SUM(t.total_nilai) as total_nilai
                  FROM transaksi_sampah t
                  JOIN jenis_sampah j ON t.id_jenis = j.id_jenis";
        
        $result = mysqli_query($conn, $query);
        $stats = mysqli_fetch_assoc($result);
        
        echo json_encode([
            'success' => true,
            'total_organik' => (float)($stats['total_organik'] ?? 0),
            'total_nonorganik' => (float)($stats['total_nonorganik'] ?? 0),
            'total_berat' => (float)(($stats['total_organik'] ?? 0) + ($stats['total_nonorganik'] ?? 0)),
            'total_nilai' => (float)($stats['total_nilai'] ?? 0),
            'total_transaksi' => (int)($stats['total_transaksi'] ?? 0)
        ]);
        break;
    
    // Ambil daftar BSU
    case 'get_bsu':
        $query = "SELECT id_bsu, nama_bsu, rw, rt FROM bsu ORDER BY rw, rt";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'id_bsu' => (int)$row['id_bsu'],
                'nama' => $row['nama_bsu'],
                'rw' => $row['rw'],
                'rt' => $row['rt']
            ];
        }
        echo json_encode(['success' => true, 'data' => $data]);
        break;
    
    // Ambil daftar jenis sampah dengan harga
    case 'get_jenis_sampah':
        $query = "SELECT j.id_jenis, j.nama_jenis, j.harga_per_kg, k.nama_kategori as jenis
                  FROM jenis_sampah j
                  JOIN kategori_sampah k ON j.id_kategori = k.id_kategori
                  ORDER BY k.nama_kategori, j.nama_jenis";
        
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'id_jenis' => (int)$row['id_jenis'],
                'nama' => $row['nama_jenis'],
                'harga' => (int)$row['harga_per_kg'],
                'jenis' => $row['jenis']
            ];
        }
        echo json_encode(['success' => true, 'data' => $data]);
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Action tidak ditemukan']);
        break;
}

mysqli_close($conn);
?>