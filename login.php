<?php
session_start();
require_once 'config/koneksi.php';

// Jika sudah login, redirect ke dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: menu_halaman.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];
    
    $user = getAdminByUsername($conn, $username);
    
    if ($user && verifyPassword($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id_admin'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
        $_SESSION['role'] = $user['role'];
        
        updateLastLogin($conn, $user['id_admin']);
        insertLog($conn, $user['id_admin'], 'Login', 'Login berhasil');
        
        header('Location: menu_halaman.php');
        exit();
    } else {
        $error = 'Username atau password salah!';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Bank Sampah Digital</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/login-style.css">
</head>
<body>
    <div class="login-wrapper">
        <div class="login-hero">
            <div class="hero-bg-gradient"></div>
            <div class="login-content">
                <div class="brand-card">
                    <div class="brand-icon">
                        <div class="icon-ring">
                            <i class="fas fa-leaf"></i>
                            <i class="fas fa-recycle"></i>
                        </div>
                    </div>
                    <h1>Bank Sampah <span>Digital</span></h1>
                    <p class="brand-tagline">Kelola Sampah, Selamatkan Bumi</p>
                    
                    <?php if ($error): ?>
                    <div class="error-toast show">
                        <i class="fas fa-exclamation-circle"></i>
                        <span><?php echo $error; ?></span>
                    </div>
                    <?php endif; ?>
                    
                    <form method="POST" action="" class="login-form">
                        <div class="input-field">
                            <i class="fas fa-user"></i>
                            <input type="text" name="username" placeholder="Username" autocomplete="off" required>
                            <div class="input-line"></div>
                        </div>
                        <div class="input-field">
                            <i class="fas fa-lock"></i>
                            <input type="password" name="password" placeholder="Password" required>
                            <div class="input-line"></div>
                        </div>
                        <button type="submit" class="login-btn">
                            <span>Masuk Dashboard</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>