// =====================================================
// FUNGSI LAPORAN - JANGAN DIUBAH!
// =====================================================

// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// Format Tanggal Indonesia
function formatTanggalIndo(tanggal) {
    var namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return namaHari[tanggal.getDay()] + ', ' + tanggal.getDate() + ' ' + namaBulan[tanggal.getMonth()] + ' ' + tanggal.getFullYear();
}

// Get filter text
function getFilterText(bsu, rw, rt) {
    var parts = [];
    if (bsu && bsu !== 'all') parts.push('BSU: ' + bsu);
    if (rw && rw !== 'all') parts.push('RW: ' + rw);
    if (rt && rt !== 'all') parts.push('RT: ' + rt);
    if (parts.length === 0) return 'Semua Data';
    return parts.join(' | ');
}

// Generate Laporan Mingguan
function generateLaporanMingguan(data, bsu, rw, rt) {
    var today = new Date();
    var weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.jenis === 'organik') totalOrganik += item.berat;
        else totalNonorganik += item.berat;
        totalNilai += (item.berat * item.hargaPerKg);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    return {
        title: 'Laporan Mingguan Bank Sampah Digital',
        periode: formatTanggalIndo(weekStart) + ' s/d ' + formatTanggalIndo(today),
        data: data,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: data.length,
        filterInfo: getFilterText(bsu, rw, rt)
    };
}

// Generate Laporan Bulanan
function generateLaporanBulanan(data, bsu, rw, rt) {
    var today = new Date();
    var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.jenis === 'organik') totalOrganik += item.berat;
        else totalNonorganik += item.berat;
        totalNilai += (item.berat * item.hargaPerKg);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    return {
        title: 'Laporan Bulanan Bank Sampah Digital',
        periode: namaBulan[today.getMonth()] + ' ' + today.getFullYear(),
        data: data,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: data.length,
        filterInfo: getFilterText(bsu, rw, rt)
    };
}

// Generate Laporan Tahunan
function generateLaporanTahunan(data, bsu, rw, rt) {
    var today = new Date();
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.jenis === 'organik') totalOrganik += item.berat;
        else totalNonorganik += item.berat;
        totalNilai += (item.berat * item.hargaPerKg);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    return {
        title: 'Laporan Tahunan Bank Sampah Digital',
        periode: 'Tahun ' + today.getFullYear(),
        data: data,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: data.length,
        filterInfo: getFilterText(bsu, rw, rt)
    };
}

// Export ke global
window.formatRupiah = formatRupiah;
window.formatTanggalIndo = formatTanggalIndo;
window.generateLaporanMingguan = generateLaporanMingguan;
window.generateLaporanBulanan = generateLaporanBulanan;
window.generateLaporanTahunan = generateLaporanTahunan;
