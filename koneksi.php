<?php
// =====================================================
// koneksi.php — Koneksi Database Bank Sampah Digital
// =====================================================

$host     = 'localhost';
$username = 'root';
$password = '';           // Sesuaikan jika XAMPP Anda pakai password
$database = 'bank_sampah_digital';

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Koneksi database gagal: ' . mysqli_connect_error()]));
}

mysqli_set_charset($conn, "utf8mb4");
date_default_timezone_set('Asia/Jakarta');

// Fungsi untuk cek koneksi
function isConnected() {
    global $conn;
    return $conn ? true : false;
}
?>