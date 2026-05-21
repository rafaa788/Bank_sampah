<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'bank_sampah_digital';

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Koneksi database gagal: ' . mysqli_connect_error()]);
    exit();
}

// Baca input JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit();
}

$username = mysqli_real_escape_string($conn, $input['username'] ?? '');
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username dan password wajib diisi']);
    exit();
}

// Query dengan SHA2 (sesuai database)
$query = "SELECT id_admin, username, nama_lengkap, role FROM admin 
          WHERE username = '$username' AND password = SHA2('$password', 256)";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query error: ' . mysqli_error($conn)]);
    exit();
}

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    
    // Update last_login
    mysqli_query($conn, "UPDATE admin SET last_login = NOW() WHERE id_admin = " . $user['id_admin']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login berhasil',
        'user' => [
            'id' => $user['id_admin'],
            'username' => $user['username'],
            'nama' => $user['nama_lengkap'],
            'role' => $user['role']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
}

mysqli_close($conn);
?>