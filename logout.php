<?php
session_start();
require_once 'koneksi.php';

if (isset($_SESSION['user_id'])) {
    $logQuery = "INSERT INTO log_aktivitas (id_admin, aktivitas, detail, ip_address) 
                 VALUES ({$_SESSION['user_id']}, 'Logout', 'Logout berhasil', '{$_SERVER['REMOTE_ADDR']}')";
    mysqli_query($conn, $logQuery);
}

session_destroy();
header('Location: login.php');
exit();
?>