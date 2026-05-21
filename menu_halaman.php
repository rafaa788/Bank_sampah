<?php
session_start();
require_once 'koneksi.php';

// CEK LOGIN
if (!isLoggedIn()) {
    header('Location: login.php');
    exit();
}

$isAdmin = isAdmin();
$userName = $_SESSION['nama_lengkap'] ?? $_SESSION['username'] ?? 'Admin';
$userRole = $_SESSION['role'] ?? 'admin';

// Ambil data statistik dari database
$totalOrganik = 0;
$totalNonorganik = 0;
$totalBerat = 0;
$totalNilai = 0;

$queryTotal = "SELECT 
    SUM(CASE WHEN j.id_kategori = 1 THEN t.berat_kg ELSE 0 END) as total_organik,
    SUM(CASE WHEN j.id_kategori != 1 THEN t.berat_kg ELSE 0 END) as total_nonorganik,
    COUNT(*) as total_transaksi,
    SUM(t.total_nilai) as total_nilai
FROM transaksi_sampah t
JOIN jenis_sampah j ON t.id_jenis = j.id_jenis";

$resultTotal = mysqli_query($conn, $queryTotal);
if ($resultTotal) {
    $stats = mysqli_fetch_assoc($resultTotal);
    $totalOrganik = $stats['total_organik'] ?? 0;
    $totalNonorganik = $stats['total_nonorganik'] ?? 0;
    $totalBerat = $totalOrganik + $totalNonorganik;
    $totalNilai = $stats['total_nilai'] ?? 0;
}

function formatRupiah($angka) {
    return 'Rp ' . number_format($angka, 0, ',', '.');
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Bank Sampah Digital</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin-style.css">
    <style>
        .role-badge {
            background: #e8f5e9;
            color: #2e7d32;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 10px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .logout-btn {
            background: #ef5350;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.85rem;
        }
        .logout-btn:hover {
            background: #e53935;
        }
    </style>
</head>
<body>
    <div class="app">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-gradient"></div>
            <div class="sidebar-header">
                <div class="logo">
                    <div class="logo-badge">
                        <i class="fas fa-trash-alt" style="font-size: 1.8rem; color: white;"></i>
                    </div>
                    <div class="logo-text">
                        <h2>Bank Sampah<span></span></h2>
                        <h2>Induk Mandiri<span></span></h2>
                        <p>Desa Gunung Putri</p>
                        <p>Kabupaten Bogor</p>
                    </div>
                </div>
            </div>
            <div class="sidebar-menu">
                <a href="menu_halaman.html" class="menu-item active">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="kelola.php" class="menu-item">
                    <i class="fas fa-recycle"></i>
                    <span>Kelola Sampah</span>
                </a>
                <a href="statistik.php" class="menu-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Statistik</span>
                </a>
            </div>
            <div class="sidebar-footer">
                <a href="logout.php" class="logout-btn" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Keluar</span>
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="app-header">
                <button class="menu-toggle" id="menuToggle">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="header-greeting">
                    <h1>Dashboard</h1>
                    <p>Selamat datang, <span><?php echo htmlspecialchars($userName); ?></span></p>
                </div>
                <div class="user-info">
                    <span class="role-badge"><i class="fas fa-shield-alt"></i> <?php echo strtoupper($userRole); ?></span>
                    <div class="profile-avatar">
                        <i class="fas fa-trash-alt"></i>
                        <div class="online-dot"></div>
                    </div>
                </div>
            </header>

            <div class="page-container">
                <div class="welcome-card">
                    <div class="welcome-emoji">🌱</div>
                    <div class="welcome-text">
                        <h2>Selamat datang di BSI Mandiri <?php echo htmlspecialchars($userName); ?>!</h2>
                        <p>Kelola data sampah dengan mudah dan cepat</p>
                    </div>
                </div>

                <div class="stat-grid">
                    <div class="stat-card stat-organik">
                        <div class="stat-bg"></div>
                        <div class="stat-icon"><i class="fas fa-seedling"></i></div>
                        <div class="stat-detail">
                            <span class="stat-label">Sampah Organik</span>
                            <span class="stat-value"><?php echo number_format($totalOrganik, 2); ?></span>
                            <span class="stat-unit">kg</span>
                        </div>
                    </div>
                    <div class="stat-card stat-nonorganik">
                        <div class="stat-bg"></div>
                        <div class="stat-icon"><i class="fas fa-box"></i></div>
                        <div class="stat-detail">
                            <span class="stat-label">Sampah Nonorganik</span>
                            <span class="stat-value"><?php echo number_format($totalNonorganik, 2); ?></span>
                            <span class="stat-unit">kg</span>
                        </div>
                    </div>
                    <div class="stat-card stat-total">
                        <div class="stat-bg"></div>
                        <div class="stat-icon"><i class="fas fa-chart-simple"></i></div>
                        <div class="stat-detail">
                            <span class="stat-label">Total Semua</span>
                            <span class="stat-value"><?php echo number_format($totalBerat, 2); ?></span>
                            <span class="stat-unit">kg</span>
                        </div>
                    </div>
                </div>

                <div class="data-table-card">
                    <div class="card-header">
                        <div class="header-left">
                            <i class="fas fa-table"></i>
                            <h3>Data Sampah per RT/RW</h3>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>BSU</th>
                                    <th>RW</th>
                                    <th>RT</th>
                                    <th>Nama Sampah</th>
                                    <th>Jenis</th>
                                    <th>Berat (kg)</th>
                                    <th>Total Nilai (Rp)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $queryTransaksi = "SELECT t.*, j.nama_jenis, b.nama_bsu 
                                                   FROM transaksi_sampah t 
                                                   JOIN jenis_sampah j ON t.id_jenis = j.id_jenis 
                                                   LEFT JOIN bsu b ON t.id_bsu = b.id_bsu 
                                                   ORDER BY t.tanggal_transaksi DESC LIMIT 20";
                                $resultTransaksi = mysqli_query($conn, $queryTransaksi);
                                
                                if ($resultTransaksi && mysqli_num_rows($resultTransaksi) > 0) {
                                    while ($row = mysqli_fetch_assoc($resultTransaksi)):
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($row['nama_bsu'] ?? '-'); ?></td>
                                    <td><?php echo htmlspecialchars($row['rw']); ?></td>
                                    <td><?php echo htmlspecialchars($row['rt']); ?></td>
                                    <td><?php echo htmlspecialchars($row['nama_jenis']); ?></td>
                                    <td><?php echo htmlspecialchars($row['jenis'] ?? 'Nonorganik'); ?></td>
                                    <td><?php echo number_format($row['berat_kg'], 2); ?> kg</td>
                                    <td><?php echo formatRupiah($row['total_nilai']); ?></td>
                                </tr>
                                <?php 
                                    endwhile;
                                } else {
                                ?>
                                <tr>
                                    <td colspan="7" style="text-align: center;">Belum ada data transaksi</td>
                                </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Sidebar toggle untuk mobile
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('open');
            });
        }
        
        // Tutup sidebar saat klik di luar (mobile)
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (sidebar && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    </script>
</body>
</html>