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

// =====================================================
// REKAP PER NAMA SAMPAH - DIPERBAIKI
// =====================================================
function getRekapPerNamaSampah(data) {
    // Group by BSU + Nama Nasabah + Nama Sampah
    var groupMap = {};
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var bsu = item.bsu || 'Tanpa BSU';
        var nasabah = item.namaNasabah || '-';
        var nama = item.nama || 'Tidak Diketahui';
        
        // Key unik: BSU + Nasabah + Nama Sampah
        var key = bsu + '|' + nasabah + '|' + nama;
        
        if (!groupMap[key]) {
            groupMap[key] = {
                bsu: bsu,
                namaNasabah: nasabah,
                nama: nama,
                totalBerat: 0,
                totalNilai: 0,
                jumlahTransaksi: 0
            };
        }
        groupMap[key].totalBerat += parseFloat(item.berat) || 0;
        groupMap[key].totalNilai += (parseFloat(item.berat) || 0) * (parseFloat(item.hargaPerKg) || 0);
        groupMap[key].jumlahTransaksi++;
    }
    
    // Convert ke array
    var result = Object.values(groupMap);
    
    // Sort by BSU, then totalBerat descending
    result.sort(function(a, b) {
        if (a.bsu !== b.bsu) return a.bsu.localeCompare(b.bsu);
        return b.totalBerat - a.totalBerat;
    });
    
    return result;
}

// =====================================================
// GENERATE LAPORAN MINGGUAN
// =====================================================
function generateLaporanMingguan(data, bsu, rw, rt) {
    var today = new Date();
    var weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.jenis === 'organik') totalOrganik += parseFloat(item.berat) || 0;
        else totalNonorganik += parseFloat(item.berat) || 0;
        totalNilai += (parseFloat(item.berat) || 0) * (parseFloat(item.hargaPerKg) || 0);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    var rekapPerNama = getRekapPerNamaSampah(data);
    
    return {
        title: 'Laporan Mingguan Bank Sampah Digital',
        periode: formatTanggalIndo(weekStart) + ' s/d ' + formatTanggalIndo(today),
        data: data,
        rekapPerNama: rekapPerNama,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: data.length,
        filterInfo: getFilterText(bsu, rw, rt)
    };
}

// =====================================================
// GENERATE LAPORAN BULANAN
// =====================================================
function generateLaporanBulanan(data, bsu, rw, rt) {
    var today = new Date();
    var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.jenis === 'organik') totalOrganik += parseFloat(item.berat) || 0;
        else totalNonorganik += parseFloat(item.berat) || 0;
        totalNilai += (parseFloat(item.berat) || 0) * (parseFloat(item.hargaPerKg) || 0);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    var rekapPerNama = getRekapPerNamaSampah(data);
    
    return {
        title: 'Laporan Bulanan Bank Sampah Digital',
        periode: namaBulan[today.getMonth()] + ' ' + today.getFullYear(),
        data: data,
        rekapPerNama: rekapPerNama,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: data.length,
        filterInfo: getFilterText(bsu, rw, rt)
    };
}

// =====================================================
// GENERATE LAPORAN TAHUNAN
// =====================================================
function generateLaporanTahunan(data, bsu, rw, rt) {
    var today = new Date();
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.jenis === 'organik') totalOrganik += parseFloat(item.berat) || 0;
        else totalNonorganik += parseFloat(item.berat) || 0;
        totalNilai += (parseFloat(item.berat) || 0) * (parseFloat(item.hargaPerKg) || 0);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    var rekapPerNama = getRekapPerNamaSampah(data);
    
    return {
        title: 'Laporan Tahunan Bank Sampah Digital',
        periode: 'Tahun ' + today.getFullYear(),
        data: data,
        rekapPerNama: rekapPerNama,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: data.length,
        filterInfo: getFilterText(bsu, rw, rt)
    };
}

// =====================================================
// GENERATE REKAP UNTUK TABEL (DENGAN ROWSPAN)
// =====================================================
function generateRekapTable(data) {
    // Group by BSU + Nama Nasabah untuk rowspan
    var rekapData = getRekapPerNamaSampah(data);
    
    var groupMap = {};
    for (var i = 0; i < rekapData.length; i++) {
        var key = rekapData[i].bsu + '|' + rekapData[i].namaNasabah;
        if (!groupMap[key]) {
            groupMap[key] = { count: 0 };
        }
        groupMap[key].count++;
    }
    
    var groupIndex = {};
    var result = [];
    
    for (var i = 0; i < rekapData.length; i++) {
        var r = rekapData[i];
        var key = r.bsu + '|' + r.namaNasabah;
        
        if (!groupIndex[key]) groupIndex[key] = 0;
        var isFirst = (groupIndex[key] === 0);
        groupIndex[key]++;
        
        result.push({
            bsu: r.bsu,
            namaNasabah: r.namaNasabah,
            nama: r.nama,
            totalBerat: r.totalBerat,
            totalNilai: r.totalNilai,
            jumlahTransaksi: r.jumlahTransaksi,
            isFirst: isFirst,
            rowspan: groupMap[key].count
        });
    }
    
    return result;
}

// Export ke global
window.formatRupiah = formatRupiah;
window.formatTanggalIndo = formatTanggalIndo;
window.getRekapPerNamaSampah = getRekapPerNamaSampah;
window.generateRekapTable = generateRekapTable;
window.generateLaporanMingguan = generateLaporanMingguan;
window.generateLaporanBulanan = generateLaporanBulanan;
window.generateLaporanTahunan = generateLaporanTahunan;
