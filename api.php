<?php
// =====================================================
// api.php — REST API untuk Bank Sampah Digital
// Diakses oleh script-admin.js via fetch()
// =====================================================

session_start();
require_once 'koneksi.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Cek login untuk semua request kecuali login itu sendiri
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Tidak terautentikasi']);
    exit();
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    // ==================== GET DATA TRANSAKSI ====================
    case 'get_transaksi':
        $bsu   = $_GET['bsu']  ?? 'all';
        $rw    = $_GET['rw']   ?? 'all';
        $rt    = $_GET['rt']   ?? 'all';
        $jenis = $_GET['jenis']?? 'all';
        $limit = intval($_GET['limit'] ?? 1000);

        $where = ['1=1'];

        if ($bsu !== 'all') {
            $bsu_safe = mysqli_real_escape_string($conn, $bsu);
            $where[] = "b.nama_bsu = '$bsu_safe'";
        }
        if ($rw !== 'all') {
            $rw_safe = mysqli_real_escape_string($conn, $rw);
            $where[] = "t.rw = '$rw_safe'";
        }
        if ($rt !== 'all') {
            $rt_safe = mysqli_real_escape_string($conn, $rt);
            $where[] = "t.rt = '$rt_safe'";
        }
        if ($jenis !== 'all') {
            $jenis_safe = mysqli_real_escape_string($conn, $jenis);
            $where[] = "t.jenis = '$jenis_safe'";
        }

        $whereStr = implode(' AND ', $where);
        $query = "SELECT 
                    t.id_transaksi AS id,
                    b.nama_bsu AS bsu,
                    t.rw,
                    t.rt,
                    j.nama_jenis AS nama,
                    t.jenis,
                    t.berat_kg AS berat,
                    t.harga_per_kg AS hargaPerKg,
                    t.total_nilai AS totalNilai,
                    t.tanggal_transaksi AS tanggal
                  FROM transaksi_sampah t
                  JOIN jenis_sampah j ON t.id_jenis = j.id_jenis
                  LEFT JOIN bsu b ON t.id_bsu = b.id_bsu
                  WHERE $whereStr
                  ORDER BY t.tanggal_transaksi DESC
                  LIMIT $limit";

        $result = mysqli_query($conn, $query);
        $data   = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['id']       = (int)$row['id'];
            $row['berat']    = (float)$row['berat'];
            $row['hargaPerKg'] = (int)$row['hargaPerKg'];
            $row['totalNilai'] = (float)$row['totalNilai'];
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
        break;

    // ==================== GET STATISTIK ====================
    case 'get_statistik':
        $bsu   = $_GET['bsu']  ?? 'all';
        $rw    = $_GET['rw']   ?? 'all';
        $rt    = $_GET['rt']   ?? 'all';

        $where = ['1=1'];
        if ($bsu !== 'all') {
            $bsu_safe = mysqli_real_escape_string($conn, $bsu);
            $where[] = "b.nama_bsu = '$bsu_safe'";
        }
        if ($rw !== 'all') {
            $rw_safe = mysqli_real_escape_string($conn, $rw);
            $where[] = "t.rw = '$rw_safe'";
        }
        if ($rt !== 'all') {
            $rt_safe = mysqli_real_escape_string($conn, $rt);
            $where[] = "t.rt = '$rt_safe'";
        }

        $whereStr = implode(' AND ', $where);
        $q = "SELECT
                SUM(CASE WHEN t.jenis='organik'    THEN t.berat_kg ELSE 0 END) AS total_organik,
                SUM(CASE WHEN t.jenis='nonorganik' THEN t.berat_kg ELSE 0 END) AS total_nonorganik,
                SUM(t.berat_kg)    AS total_berat,
                SUM(t.total_nilai) AS total_nilai,
                COUNT(*)           AS total_transaksi,
                SUM(CASE WHEN t.jenis='organik'    THEN 1 ELSE 0 END) AS count_organik,
                SUM(CASE WHEN t.jenis='nonorganik' THEN 1 ELSE 0 END) AS count_nonorganik
              FROM transaksi_sampah t
              LEFT JOIN bsu b ON t.id_bsu = b.id_bsu
              WHERE $whereStr";

        $res  = mysqli_query($conn, $q);
        $stat = mysqli_fetch_assoc($res);

        echo json_encode([
            'success'          => true,
            'total_organik'    => (float)($stat['total_organik']    ?? 0),
            'total_nonorganik' => (float)($stat['total_nonorganik'] ?? 0),
            'total_berat'      => (float)($stat['total_berat']      ?? 0),
            'total_nilai'      => (float)($stat['total_nilai']      ?? 0),
            'total_transaksi'  => (int)  ($stat['total_transaksi']  ?? 0),
            'count_organik'    => (int)  ($stat['count_organik']    ?? 0),
            'count_nonorganik' => (int)  ($stat['count_nonorganik'] ?? 0),
        ]);
        break;

    // ==================== GET REKAP PER JENIS ====================
    case 'get_rekap_jenis':
        $bsu   = $_GET['bsu']   ?? 'all';
        $rw    = $_GET['rw']    ?? 'all';
        $rt    = $_GET['rt']    ?? 'all';
        $jenis = $_GET['jenis'] ?? 'all';

        $where = ['1=1'];
        if ($bsu !== 'all') {
            $bsu_safe = mysqli_real_escape_string($conn, $bsu);
            $where[] = "b.nama_bsu = '$bsu_safe'";
        }
        if ($rw !== 'all') {
            $rw_safe = mysqli_real_escape_string($conn, $rw);
            $where[] = "t.rw = '$rw_safe'";
        }
        if ($rt !== 'all') {
            $rt_safe = mysqli_real_escape_string($conn, $rt);
            $where[] = "t.rt = '$rt_safe'";
        }
        if ($jenis !== 'all') {
            $jenis_safe = mysqli_real_escape_string($conn, $jenis);
            $where[] = "t.jenis = '$jenis_safe'";
        }

        $whereStr = implode(' AND ', $where);
        $q = "SELECT j.nama_jenis, t.jenis,
                SUM(t.berat_kg) AS total_berat,
                COUNT(*)        AS jumlah_transaksi,
                SUM(t.total_nilai) AS total_nilai
              FROM transaksi_sampah t
              JOIN jenis_sampah j ON t.id_jenis = j.id_jenis
              LEFT JOIN bsu b ON t.id_bsu = b.id_bsu
              WHERE $whereStr
              GROUP BY t.id_jenis
              ORDER BY total_berat DESC";

        $res  = mysqli_query($conn, $q);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $row['total_berat']       = (float)$row['total_berat'];
            $row['jumlah_transaksi']  = (int)  $row['jumlah_transaksi'];
            $row['total_nilai']       = (float)$row['total_nilai'];
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
        break;

    // ==================== GET BSU LIST ====================
    case 'get_bsu':
        $q   = "SELECT id_bsu, nama_bsu, rw, rt FROM bsu ORDER BY rw, rt, nama_bsu";
        $res = mysqli_query($conn, $q);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $row['id_bsu'] = (int)$row['id_bsu'];
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
        break;

    // ==================== GET JENIS SAMPAH LIST ====================
    case 'get_jenis':
        $q = "SELECT j.id_jenis, j.nama_jenis, j.harga_per_kg, k.nama_kategori AS jenis
              FROM jenis_sampah j
              JOIN kategori_sampah k ON j.id_kategori = k.id_kategori
              ORDER BY k.nama_kategori, j.nama_jenis";
        $res  = mysqli_query($conn, $q);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $row['id_jenis']    = (int)$row['id_jenis'];
            $row['harga_per_kg'] = (int)$row['harga_per_kg'];
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
        break;

    // ==================== TAMBAH TRANSAKSI ====================
    case 'tambah':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $rw      = mysqli_real_escape_string($conn, $input['rw']      ?? '');
        $rt      = mysqli_real_escape_string($conn, $input['rt']      ?? '');
        $nama    = mysqli_real_escape_string($conn, $input['nama']     ?? '');
        $jenis   = mysqli_real_escape_string($conn, $input['jenis']    ?? 'nonorganik');
        $berat   = (float)($input['berat']   ?? 0);
        $harga   = (int)  ($input['harga']   ?? 0);
        $bsuNama = mysqli_real_escape_string($conn, $input['bsu'] ?? '');

        if (!$rw || !$rt || !$nama || $berat <= 0) {
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            break;
        }

        // Cari / buat id_jenis
        $qJenis = "SELECT j.id_jenis FROM jenis_sampah j
                   JOIN kategori_sampah k ON j.id_kategori = k.id_kategori
                   WHERE j.nama_jenis = '$nama'
                   LIMIT 1";
        $rJenis  = mysqli_query($conn, $qJenis);
        $idJenis = null;
        if (mysqli_num_rows($rJenis) > 0) {
            $idJenis = (int)mysqli_fetch_assoc($rJenis)['id_jenis'];
        } else {
            // Buat jenis baru
            $idKat = ($jenis === 'organik') ? 1 : 2;
            mysqli_query($conn, "INSERT INTO jenis_sampah (id_kategori, nama_jenis, harga_per_kg)
                                 VALUES ($idKat, '$nama', $harga)");
            $idJenis = mysqli_insert_id($conn);
        }

        // Cari id_bsu
        $idBsu = 'NULL';
        if ($bsuNama) {
            $qBsu = "SELECT id_bsu FROM bsu WHERE nama_bsu = '$bsuNama' LIMIT 1";
            $rBsu = mysqli_query($conn, $qBsu);
            if (mysqli_num_rows($rBsu) > 0) {
                $idBsu = (int)mysqli_fetch_assoc($rBsu)['id_bsu'];
            }
        }

        $total   = $berat * $harga;
        $adminId = $_SESSION['user_id'];

        $q = "INSERT INTO transaksi_sampah
                (id_bsu, id_jenis, rw, rt, berat_kg, harga_per_kg, total_nilai, jenis, id_admin)
              VALUES
                ($idBsu, $idJenis, '$rw', '$rt', $berat, $harga, $total, '$jenis', $adminId)";

        if (mysqli_query($conn, $q)) {
            $newId = mysqli_insert_id($conn);
            insertLog($conn, $adminId, 'Tambah', "Tambah transaksi id=$newId");
            echo json_encode(['success' => true, 'id' => $newId, 'message' => 'Data berhasil ditambahkan']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan: ' . mysqli_error($conn)]);
        }
        break;

    // ==================== EDIT TRANSAKSI ====================
    case 'edit':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $id      = (int)($input['id'] ?? 0);
        $rw      = mysqli_real_escape_string($conn, $input['rw']   ?? '');
        $rt      = mysqli_real_escape_string($conn, $input['rt']   ?? '');
        $nama    = mysqli_real_escape_string($conn, $input['nama']  ?? '');
        $jenis   = mysqli_real_escape_string($conn, $input['jenis'] ?? 'nonorganik');
        $berat   = (float)($input['berat'] ?? 0);
        $harga   = (int)  ($input['harga'] ?? 0);
        $bsuNama = mysqli_real_escape_string($conn, $input['bsu'] ?? '');

        if (!$id || !$rw || !$rt || !$nama || $berat <= 0) {
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            break;
        }

        // Cari id_jenis
        $qJenis = "SELECT id_jenis FROM jenis_sampah WHERE nama_jenis = '$nama' LIMIT 1";
        $rJenis  = mysqli_query($conn, $qJenis);
        $idJenis = null;
        if (mysqli_num_rows($rJenis) > 0) {
            $idJenis = (int)mysqli_fetch_assoc($rJenis)['id_jenis'];
        } else {
            $idKat = ($jenis === 'organik') ? 1 : 2;
            mysqli_query($conn, "INSERT INTO jenis_sampah (id_kategori, nama_jenis, harga_per_kg)
                                 VALUES ($idKat, '$nama', $harga)");
            $idJenis = mysqli_insert_id($conn);
        }

        // Cari id_bsu
        $idBsu = 'NULL';
        if ($bsuNama) {
            $qBsu = "SELECT id_bsu FROM bsu WHERE nama_bsu = '$bsuNama' LIMIT 1";
            $rBsu = mysqli_query($conn, $qBsu);
            if (mysqli_num_rows($rBsu) > 0) {
                $idBsu = (int)mysqli_fetch_assoc($rBsu)['id_bsu'];
            }
        }

        $total   = $berat * $harga;
        $adminId = $_SESSION['user_id'];

        $q = "UPDATE transaksi_sampah SET
                id_bsu=$idBsu, id_jenis=$idJenis, rw='$rw', rt='$rt',
                berat_kg=$berat, harga_per_kg=$harga, total_nilai=$total, jenis='$jenis'
              WHERE id_transaksi=$id";

        if (mysqli_query($conn, $q)) {
            insertLog($conn, $adminId, 'Edit', "Edit transaksi id=$id");
            echo json_encode(['success' => true, 'message' => 'Data berhasil diupdate']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal update: ' . mysqli_error($conn)]);
        }
        break;

    // ==================== HAPUS TRANSAKSI ====================
    case 'hapus':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;

        $id      = (int)($input['id'] ?? 0);
        $adminId = $_SESSION['user_id'];

        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
            break;
        }

        if (mysqli_query($conn, "DELETE FROM transaksi_sampah WHERE id_transaksi=$id")) {
            insertLog($conn, $adminId, 'Hapus', "Hapus transaksi id=$id");
            echo json_encode(['success' => true, 'message' => 'Data berhasil dihapus']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal hapus: ' . mysqli_error($conn)]);
        }
        break;

    // ==================== GET SESSION INFO ====================
    case 'session':
        echo json_encode([
            'success'       => true,
            'username'      => $_SESSION['username'] ?? '',
            'nama_lengkap'  => $_SESSION['nama_lengkap'] ?? '',
            'role'          => $_SESSION['role'] ?? '',
        ]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Action tidak dikenali']);
}
?>
