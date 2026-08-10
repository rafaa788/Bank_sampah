// =====================================================
// TAMU-SCRIPT.JS - DENGAN 3 FOTO UPLOAD & FIX SIMPAN
// =====================================================

// ==================== CEK LOGIN ====================
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'menu_login.html';
}

var userRole = sessionStorage.getItem('userRole') || '';
if (userRole === 'admin') {
    window.location.href = 'menu_halaman.html';
}

// ==================== GLOBAL VARIABLES ====================
var DATA_TAMU_KEY = 'bankSampahTamuData';
var STORAGE_KEY = 'bankSampahData';
var dataTamuMenunggu = [];
var daftarSampah = [];
var dataBSUWithKetua = [];
var currentUserBSU = '';
var currentUserRW = '';
var currentUserRT = '';
var currentUserName = '';
var bsuTrenChart = null;
var currentTabunganFilter = 'all';

// ==================== DATA BSU LENGKAP ====================
var dataBSU = [
    { nama: "BSU MEDE 1", rw: "RW01", rt: "RT01", ketua: "Bapak Slamet" },
    { nama: "BSU MEDE 2", rw: "RW01", rt: "RT02", ketua: "Ibu Siti" },
    { nama: "BSU MEDE 3", rw: "RW01", rt: "RT03", ketua: "Bapak Agus" },
    { nama: "BSU MEDE 4", rw: "RW01", rt: "RT04", ketua: "Ibu Dewi" },
    { nama: "BSU PELANGI CERIA", rw: "RW02", rt: "RT01", ketua: "Bapak Herman" },
    { nama: "BSU PELANGI 2", rw: "RW02", rt: "RT02", ketua: "Ibu Rina" },
    { nama: "BSU PELANGI KENANGA", rw: "RW02", rt: "RT03", ketua: "Bapak Joko" },
    { nama: "BSU PELANGI BUNDA", rw: "RW02", rt: "RT04", ketua: "Ibu Tuti" },
    { nama: "BSU RW03 RT01", rw: "RW03", rt: "RT01", ketua: "Bapak Eko" },
    { nama: "BSU RW03 RT02", rw: "RW03", rt: "RT02", ketua: "Ibu Ani" },
    { nama: "BSU RW03 RT03", rw: "RW03", rt: "RT03", ketua: "Bapak Budi" },
    { nama: "BSU FORSILA", rw: "RW04", rt: "RT01", ketua: "Ibu Wati" },
    { nama: "BSU BERSERI 04", rw: "RW04", rt: "RT02", ketua: "Bapak Dodi" },
    { nama: "BSU BINTANG KEJORA 1", rw: "RW05", rt: "RT01", ketua: "Ibu Lina" },
    { nama: "BSU BINTANG KEJORA 2", rw: "RW05", rt: "RT02", ketua: "Bapak Deni" },
    { nama: "BSU TERANG", rw: "RW06", rt: "RT01", ketua: "Ibu Maya" },
    { nama: "BSU RW06 RT02", rw: "RW06", rt: "RT02", ketua: "Bapak Rudi" },
    { nama: "BSU RW06 RT03", rw: "RW06", rt: "RT03", ketua: "Ibu Erna" },
    { nama: "BSU RW06 RT04", rw: "RW06", rt: "RT04", ketua: "Bapak Tono" },
    { nama: "BSU RW06 RT05", rw: "RW06", rt: "RT05", ketua: "Ibu Yuni" },
    { nama: "BSU BERSEMI 0107", rw: "RW07", rt: "RT01", ketua: "Bapak Hendra" },
    { nama: "BSU BERSEMI 07", rw: "RW07", rt: "RT02", ketua: "Ibu Ratna" },
    { nama: "BSU RW07 RT03", rw: "RW07", rt: "RT03", ketua: "Bapak Feri" },
    { nama: "BSU RW07 RT04", rw: "RW07", rt: "RT04", ketua: "Ibu Linda" },
    { nama: "BSU RW07 RT05", rw: "RW07", rt: "RT05", ketua: "Bapak Andi" },
    { nama: "BSU MENTARI 01", rw: "RW08", rt: "RT01", ketua: "Ibu Nina" },
    { nama: "BSU MENTARI", rw: "RW08", rt: "RT02", ketua: "Bapak Taufik" },
    { nama: "BSU KP KIDOEL", rw: "RW09", rt: "all", ketua: "Bapak Kidoel" },
    { nama: "BSU MAWARGA", rw: "RW10", rt: "RT01", ketua: "Ibu Rose" },
    { nama: "BSU SRIKANDI", rw: "RW10", rt: "RT02", ketua: "Bapak Srikandi" },
    { nama: "BSU RW10 RT03", rw: "RW10", rt: "RT03", ketua: "Ibu Mega" },
    { nama: "BSU RW11 RT01", rw: "RW11", rt: "RT01", ketua: "Bapak Gilang" },
    { nama: "BSU ZALAK 2", rw: "RW11", rt: "RT02", ketua: "Ibu Zalak" },
    { nama: "BSU RW11 RT03", rw: "RW11", rt: "RT03", ketua: "Bapak Rizki" },
    { nama: "BSU RW12 RT01", rw: "RW12", rt: "RT01", ketua: "Ibu Sari" },
    { nama: "BSU RW12 RT02", rw: "RW12", rt: "RT02", ketua: "Bapak Darma" },
    { nama: "BSU RW12 RT03", rw: "RW12", rt: "RT03", ketua: "Ibu Ayu" },
    { nama: "BSU CEMERLANG 1", rw: "RW13", rt: "RT01", ketua: "Bapak Chandra" },
    { nama: "BSU CEMERLANG 2", rw: "RW13", rt: "RT02", ketua: "Ibu Berlian" },
    { nama: "BSU CEMERLANG 3", rw: "RW13", rt: "RT03", ketua: "Bapak Gio" },
    { nama: "BSU RW14 RT01", rw: "RW14", rt: "RT01", ketua: "Ibu Fira" },
    { nama: "BSU RW14 RT02", rw: "RW14", rt: "RT02", ketua: "Bapak Irfan" },
    { nama: "BSU RW14 RT03", rw: "RW14", rt: "RT03", ketua: "Ibu Nadia" }
];
dataBSUWithKetua = dataBSU;

// ==================== PRESET SAMPAH ====================
var presetSampah = {
    plastik: [
        "Pet A - Botol TANPA tutup dan label + Galon Le Mineral",
        "Pet B - Masih berlabel dan tutup",
        "Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)",
        "Botol Plastik Campuran Semua Warna dan Bentuk",
        "Gelas A - Gelas plastik kemasan bening TANPA SABLON DAN LABEL",
        "Gelas B - Warna jernih DENGAN SABLON DAN LABEL",
        "Gelas Warna (Mountea, Tea Gelas, Ale2)",
        "Emberan - Semua plastik lunak YANG BUKAN HITAM",
        "Kresek / Assoy",
        "Plastik Bening Polos PP/PE"
    ],
    logam: [
        "Alumunium",
        "Besi A (besi cor-coran, padat, tebal)",
        "Besi Campur / Baja Ringan, sepeda rusak, paku",
        "Rongsok Campur (alumunium panci, softdrink, siku)",
        "Kaleng",
        "Kawat / Seng",
        "Tembaga Merah / kupas berisi padat tebal"
    ],
    kertas: [
        "Kertas Koran B / Lecek tidak utuh",
        "Kertas Putih / HVS bertinta hitam",
        "Kertas Semen",
        "Kertas Warna / HVS warna, tinta warna, Crayon",
        "Kertas Campur / Semua kertas KECUALI KERTAS NASI",
        "Kardus",
        "Duplex",
        "Kornes (Gulungan Kain)"
    ]
};

// ==================== FUNGSI UTILITY ====================
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function showToast(message, isError) {
    var toast = document.getElementById('toast');
    var toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;
    
    toastMessage.innerText = message;
    toast.classList.add('show');
    toast.style.background = isError ? '#ef5350' : '#2e7d32';
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function formatRupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function formatTanggalIndo(tanggal) {
    if (!tanggal) return '-';
    var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var tgl = new Date(tanggal);
    if (isNaN(tgl.getTime())) return tanggal;
    return tgl.getDate() + ' ' + namaBulan[tgl.getMonth()] + ' ' + tgl.getFullYear();
}

function getHargaByNamaSampah(namaSampah) {
    var hargaSampahDetail = {
        "Pet A - Botol TANPA tutup dan label + Galon Le Mineral": 3500,
        "Pet B - Masih berlabel dan tutup": 2000,
        "Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)": 1000,
        "Botol Plastik Campuran Semua Warna dan Bentuk": 1500,
        "Gelas A - Gelas plastik kemasan bening TANPA SABLON DAN LABEL": 3000,
        "Gelas B - Warna jernih DENGAN SABLON DAN LABEL": 1500,
        "Gelas Warna (Mountea, Tea Gelas, Ale2)": 2000,
        "Emberan - Semua plastik lunak YANG BUKAN HITAM": 1500,
        "Kresek / Assoy": 500,
        "Plastik Bening Polos PP/PE": 1000,
        "Alumunium": 10000,
        "Besi A (besi cor-coran, padat, tebal)": 4000,
        "Besi Campur / Baja Ringan, sepeda rusak, paku": 2500,
        "Rongsok Campur (alumunium panci, softdrink, siku)": 6000,
        "Kaleng": 2000,
        "Kawat / Seng": 1500,
        "Tembaga Merah / kupas berisi padat tebal": 65000,
        "Kertas Koran B / Lecek tidak utuh": 100,
        "Kertas Putih / HVS bertinta hitam": 1500,
        "Kertas Semen": 1400,
        "Kertas Warna / HVS warna, tinta warna, Crayon": 800,
        "Kertas Campur / Semua kertas KECUALI KERTAS NASI": 800,
        "Kardus": 1600,
        "Duplex": 800,
        "Kornes (Gulungan Kain)": 800
    };
    
    if (hargaSampahDetail[namaSampah]) {
        return hargaSampahDetail[namaSampah];
    }
    
    var namaLower = (namaSampah || '').toLowerCase();
    for (var key in hargaSampahDetail) {
        if (namaLower.includes(key.toLowerCase()) || key.toLowerCase().includes(namaLower)) {
            return hargaSampahDetail[key];
        }
    }
    return 2000;
}

// ==================== SET USER BSU ====================
function setUserBSU() {
    var userBSU = sessionStorage.getItem('userBSU') || '';
    var userRW = sessionStorage.getItem('userRW') || '';
    var userRT = sessionStorage.getItem('userRT') || '';
    var userName = sessionStorage.getItem('username') || 'Pengunjung';
    
    if (userBSU) {
        for (var i = 0; i < dataBSU.length; i++) {
            if (dataBSU[i].nama === userBSU) {
                currentUserBSU = userBSU;
                currentUserRW = dataBSU[i].rw;
                currentUserRT = dataBSU[i].rt;
                currentUserName = userName;
                return;
            }
        }
    }
    
    if (userRW && userRT) {
        for (var i = 0; i < dataBSU.length; i++) {
            var bsu = dataBSU[i];
            if (bsu.rw === userRW && (bsu.rt === userRT || bsu.rt === 'all')) {
                currentUserBSU = bsu.nama;
                currentUserRW = bsu.rw;
                currentUserRT = bsu.rt;
                currentUserName = userName;
                sessionStorage.setItem('userBSU', bsu.nama);
                return;
            }
        }
    }
    
    if (dataBSU.length > 0) {
        currentUserBSU = dataBSU[0].nama;
        currentUserRW = dataBSU[0].rw;
        currentUserRT = dataBSU[0].rt;
        currentUserName = userName;
        sessionStorage.setItem('userBSU', dataBSU[0].nama);
        sessionStorage.setItem('userRW', dataBSU[0].rw);
        sessionStorage.setItem('userRT', dataBSU[0].rt);
    }
}

// ==================== SAVE & LOAD DATA TAMU ====================
function saveTamuDataLocal() {
    localStorage.setItem(DATA_TAMU_KEY, JSON.stringify(dataTamuMenunggu));
    console.log('Data tamu disimpan:', dataTamuMenunggu.length, 'data');
}

function loadTamuDataLocal() {
    var stored = localStorage.getItem(DATA_TAMU_KEY);
    if (stored) {
        try {
            dataTamuMenunggu = JSON.parse(stored);
            console.log('Data tamu dimuat dari localStorage:', dataTamuMenunggu.length, 'data');
        } catch(e) {
            console.error('Error parsing data tamu:', e);
            dataTamuMenunggu = [];
        }
    } else {
        dataTamuMenunggu = [];
        saveTamuDataLocal();
    }
    return dataTamuMenunggu;
}

// ==================== LOAD DATA ====================
function loadTamuData() {
    // Load dari localStorage
    loadTamuDataLocal();
    
    // Load daftar sampah dari localStorage admin
    var storedSampah = localStorage.getItem(STORAGE_KEY);
    if (storedSampah) {
        try {
            daftarSampah = JSON.parse(storedSampah);
        } catch(e) {
            daftarSampah = [];
        }
    }
    
    renderHistory();
    updateDashboard();
    renderNasabahList('');
    renderBukuTabunganTamuWithFilter();
    updateNasabahDatalist();
    
    // Cek data pending dan kirim notifikasi ke admin
    checkPendingData();
}

// ==================== CEK DATA PENDING ====================
function checkPendingData() {
    var pending = dataTamuMenunggu.filter(function(item) {
        return item.status === 'pending';
    });
    if (pending.length > 0) {
        console.log('Ada ' + pending.length + ' data pending menunggu verifikasi');
        // Kirim sinyal ke admin melalui localStorage
        localStorage.setItem('tamuDataPending', JSON.stringify({
            count: pending.length,
            lastUpdate: new Date().toISOString()
        }));
    }
}

// ==================== GET DATA BSU ====================
function getDataBSU() {
    var filtered = [];
    for (var i = 0; i < daftarSampah.length; i++) {
        var item = daftarSampah[i];
        if (item.bsu === currentUserBSU) {
            filtered.push(item);
        }
    }
    return filtered;
}

function getDataBSUWithTamu() {
    var result = [];
    var usedIds = {};
    
    // Data dari daftarSampah (yang sudah diverifikasi)
    for (var i = 0; i < daftarSampah.length; i++) {
        var item = daftarSampah[i];
        if (item.bsu === currentUserBSU) {
            result.push(item);
            if (item.verifiedTamuId) {
                usedIds[item.verifiedTamuId] = true;
            }
        }
    }
    
    // Data dari dataTamuMenunggu yang sudah verified
    for (var j = 0; j < dataTamuMenunggu.length; j++) {
        var tamu = dataTamuMenunggu[j];
        if (tamu.status === 'verified' && tamu.bsu === currentUserBSU && !usedIds[tamu.id]) {
            result.push({
                id: tamu.id,
                nama: tamu.nama,
                bsu: tamu.bsu,
                rw: tamu.rw || currentUserRW,
                rt: tamu.rt || currentUserRT,
                berat: tamu.berat,
                hargaPerKg: tamu.hargaPerKg || getHargaByNamaSampah(tamu.nama),
                tanggal: tamu.tanggal || tamu.createdAt || new Date().toISOString(),
                namaNasabah: tamu.namaNasabah || '-',
                verifiedFromTamu: true,
                verifiedTamuId: tamu.id,
                jenis: 'nonorganik',
                foto_timbang: tamu.fotoTimbang || null,
                foto_hasil: tamu.fotoHasil || null,
                foto_bukti: tamu.fotoBukti || null
            });
        }
    }
    
    return result;
}

// ==================== GET NASABAH UNIK ====================
function getNasabahUnik() {
    var dataBsu = getDataBSUWithTamu();
    var nasabahMap = {};
    
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        var nama = item.namaNasabah || '-';
        if (nama !== '-' && nama !== 'undefined' && nama !== 'null' && String(nama).trim() !== '') {
            if (!nasabahMap[nama]) {
                nasabahMap[nama] = {
                    nama: nama,
                    totalBerat: 0,
                    totalNilai: 0,
                    totalTransaksi: 0,
                    rw: item.rw || '-',
                    rt: item.rt || '-',
                    lastTransaksi: item.tanggal || null
                };
            }
            var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
            var nilai = item.berat * harga;
            nasabahMap[nama].totalBerat += item.berat;
            nasabahMap[nama].totalNilai += nilai;
            nasabahMap[nama].totalTransaksi++;
            if (item.tanggal && (!nasabahMap[nama].lastTransaksi || new Date(item.tanggal) > new Date(nasabahMap[nama].lastTransaksi))) {
                nasabahMap[nama].lastTransaksi = item.tanggal;
            }
        }
    }
    
    var result = Object.values(nasabahMap);
    result.sort(function(a, b) { return b.totalNilai - a.totalNilai; });
    return result;
}

// ==================== UPDATE DASHBOARD ====================
function updateDashboard() {
    var dataBsu = getDataBSUWithTamu();
    
    var totalBerat = 0;
    for (var i = 0; i < dataBsu.length; i++) {
        totalBerat += dataBsu[i].berat;
    }
    document.getElementById('bsuTotalBerat').innerText = totalBerat.toFixed(2) + ' kg';
    
    document.getElementById('bsuTotalTransaksi').innerText = dataBsu.length;
    
    var totalNilai = 0;
    for (var i = 0; i < dataBsu.length; i++) {
        var harga = dataBsu[i].hargaPerKg || getHargaByNamaSampah(dataBsu[i].nama);
        totalNilai += dataBsu[i].berat * harga;
    }
    document.getElementById('bsuTotalNilai').innerText = formatRupiah(totalNilai);
    
    var nasabahUnik = getNasabahUnik();
    document.getElementById('bsuTotalNasabah').innerText = nasabahUnik.length;
    
    var organikBerat = 0, nonorganikBerat = 0;
    var organikCount = 0, nonorganikCount = 0;
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        if (item.jenis === 'organik') {
            organikBerat += item.berat;
            organikCount++;
        } else {
            nonorganikBerat += item.berat;
            nonorganikCount++;
        }
    }
    document.getElementById('bsuOrganikBerat').innerText = organikBerat.toFixed(2) + ' kg';
    document.getElementById('bsuOrganikCount').innerText = organikCount + ' transaksi';
    document.getElementById('bsuNonorganikBerat').innerText = nonorganikBerat.toFixed(2) + ' kg';
    document.getElementById('bsuNonorganikCount').innerText = nonorganikCount + ' transaksi';
    
    renderTopNasabah(nasabahUnik);
    updateBsuTrenChart(dataBsu);
    updateNasabahDatalist();
}

// ==================== RENDER TOP NASABAH ====================
function renderTopNasabah(nasabahList) {
    var container = document.getElementById('bsuTopNasabahList');
    var count = document.getElementById('bsuNasabahCount');
    if (!container) return;
    
    if (count) count.textContent = 'Total: ' + nasabahList.length + ' nasabah';
    
    if (nasabahList.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px;">Belum ada data nasabah</div>';
        return;
    }
    
    var html = '';
    var top = nasabahList.slice(0, 5);
    for (var i = 0; i < top.length; i++) {
        var n = top[i];
        var medal = '';
        if (i === 0) medal = '🥇';
        else if (i === 1) medal = '🥈';
        else if (i === 2) medal = '🥉';
        
        html += '<div class="nasabah-item">' +
            '<div class="nasabah-rank">' + medal + ' ' + (i + 1) + '</div>' +
            '<div class="nasabah-info">' +
                '<div class="nasabah-name">' + escapeHtml(n.nama) + '</div>' +
                '<div class="nasabah-detail">' + n.totalTransaksi + ' transaksi | ' + n.totalBerat.toFixed(2) + ' kg</div>' +
            '</div>' +
            '<div class="nasabah-total">' + formatRupiah(n.totalNilai) + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
}

// ==================== BSU TREN CHART ====================
function updateBsuTrenChart(dataBsu) {
    var ctx = document.getElementById('bsuTrenChart');
    if (!ctx) return;
    var ctx2d = ctx.getContext('2d');
    
    var today = new Date();
    var dateMap = {};
    var labels = [];
    
    for (var i = 6; i >= 0; i--) {
        var date = new Date(today);
        date.setDate(date.getDate() - i);
        var dateStr = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        labels.push(dateStr);
        dateMap[date.toDateString()] = { organik: 0, nonorganik: 0, total: 0 };
    }
    
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        if (item.tanggal) {
            var itemDate = new Date(item.tanggal).toDateString();
            if (dateMap[itemDate]) {
                if (item.jenis === 'organik') {
                    dateMap[itemDate].organik += item.berat;
                } else {
                    dateMap[itemDate].nonorganik += item.berat;
                }
                dateMap[itemDate].total += item.berat;
            }
        }
    }
    
    var organikData = [];
    var nonorganikData = [];
    var totalData = [];
    var dateKeys = Object.keys(dateMap);
    for (var i = 0; i < dateKeys.length; i++) {
        var key = dateKeys[i];
        organikData.push(dateMap[key].organik);
        nonorganikData.push(dateMap[key].nonorganik);
        totalData.push(dateMap[key].total);
    }
    
    if (bsuTrenChart) {
        bsuTrenChart.destroy();
    }
    
    bsuTrenChart = new Chart(ctx2d, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Organik',
                    data: organikData,
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                },
                {
                    label: 'Nonorganik',
                    data: nonorganikData,
                    borderColor: '#f9a825',
                    backgroundColor: 'rgba(249,168,37,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                },
                {
                    label: 'Total',
                    data: totalData,
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(21,101,192,0.05)',
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5],
                    pointRadius: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 10 }, boxWidth: 12 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toFixed(2) + ' kg';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Berat (kg)', font: { size: 10 } },
                    ticks: { font: { size: 10 } }
                },
                x: {
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

// ==================== RENDER NASABAH LIST ====================
function renderNasabahList(searchTerm) {
    var container = document.getElementById('nasabahListContainer');
    var count = document.getElementById('nasabahListCount');
    if (!container) return;
    
    var nasabahList = getNasabahUnik();
    
    if (searchTerm) {
        var term = searchTerm.toLowerCase();
        nasabahList = nasabahList.filter(function(n) {
            return n.nama.toLowerCase().includes(term);
        });
    }
    
    if (count) count.textContent = 'Total: ' + nasabahList.length + ' nasabah';
    
    if (nasabahList.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px;">' +
            '<i class="fas fa-users" style="font-size:2rem;display:block;margin-bottom:12px;opacity:0.3;"></i>' +
            '<p>Belum ada nasabah terdaftar</p>' +
            '</div>';
        return;
    }
    
    var html = '<div class="nasabah-table-wrapper">' +
        '<table class="nasabah-table">' +
        '<thead><tr><th>No</th><th>Nama Nasabah</th><th>RW/RT</th><th>Total Berat</th><th>Total Transaksi</th><th>Total Tabungan</th></tr></thead>' +
        '<tbody>';
    
    for (var i = 0; i < nasabahList.length; i++) {
        var n = nasabahList[i];
        var rowClass = (i % 2 === 0) ? '' : 'row-alt';
        html += '<tr class="' + rowClass + '">' +
            '<td>' + (i + 1) + '</td>' +
            '<td><strong>' + escapeHtml(n.nama) + '</strong></td>' +
            '<td>' + n.rw + ' - ' + n.rt + '</td>' +
            '<td>' + n.totalBerat.toFixed(2) + ' kg</td>' +
            '<td>' + n.totalTransaksi + '</td>' +
            '<td class="nasabah-total-value">' + formatRupiah(n.totalNilai) + '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ==================== BUKU TABUNGAN ====================
function generateTabunganNasabah(namaNasabah) {
    var dataBsu = getDataBSUWithTamu();
    
    var filteredData = [];
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        var namaItem = item.namaNasabah || '-';
        if (String(namaItem).toLowerCase().includes(String(namaNasabah).toLowerCase())) {
            filteredData.push(item);
        }
    }
    
    filteredData.sort(function(a, b) {
        return new Date(a.tanggal) - new Date(b.tanggal);
    });
    
    var saldo = 0;
    var history = [];
    var totalBerat = 0;
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
        var nilai = item.berat * harga;
        saldo += nilai;
        totalBerat += item.berat;
        
        history.push({
            tanggal: item.tanggal || '-',
            namaSampah: item.nama || 'Tidak Diketahui',
            namaNasabah: item.namaNasabah || namaNasabah,
            bsu: item.bsu || currentUserBSU,
            rw: item.rw || currentUserRW,
            rt: item.rt || currentUserRT,
            berat: item.berat,
            hargaPerKg: harga,
            nilai: nilai,
            saldo: saldo,
            fotoTimbang: item.foto_timbang || null,
            fotoHasil: item.foto_hasil || null,
            fotoBukti: item.foto_bukti || null
        });
    }
    
    return {
        namaNasabah: namaNasabah,
        bsu: currentUserBSU,
        history: history,
        totalSaldo: saldo,
        totalTransaksi: history.length,
        totalBerat: totalBerat
    };
}

// ==================== UPDATE DATALIST ====================
function updateNasabahDatalist() {
    var nasabahList = getNasabahUnik();
    
    var datalist = document.getElementById('nasabahDatalist');
    var filterSelect = document.getElementById('tabunganFilterSelect');
    
    if (datalist) {
        var html = '';
        for (var i = 0; i < nasabahList.length; i++) {
            html += '<option value="' + escapeHtml(nasabahList[i].nama) + '">';
        }
        datalist.innerHTML = html;
    }
    
    if (filterSelect) {
        var html3 = '<option value="all">📊 Semua Nasabah (Rekap)</option>';
        html3 += '<option value="__separator__" disabled>──────────</option>';
        for (var i = 0; i < nasabahList.length; i++) {
            html3 += '<option value="' + escapeHtml(nasabahList[i].nama) + '">👤 ' + escapeHtml(nasabahList[i].nama) + ' (Rp ' + nasabahList[i].totalNilai.toLocaleString() + ')</option>';
        }
        filterSelect.innerHTML = html3;
    }
}

// ==================== RENDER TABUNGAN DENGAN NAMA SAMPAH ====================
function renderBukuTabunganTamuWithFilter() {
    var container = document.getElementById('tabunganTamuContainer');
    if (!container) return;
    
    var namaNasabah = document.getElementById('tabunganNamaNasabah').value.trim();
    var filterSelect = document.getElementById('tabunganFilterSelect');
    var selectedValue = filterSelect ? filterSelect.value : 'all';
    
    if (selectedValue !== 'all' && selectedValue !== '__separator__' && !namaNasabah) {
        namaNasabah = selectedValue;
        document.getElementById('tabunganNamaNasabah').value = namaNasabah;
    }
    
    if (!namaNasabah || namaNasabah === 'all') {
        renderRekapTabunganForTamu('');
        return;
    }
    
    var data = generateTabunganNasabah(namaNasabah);
    
    if (data.history.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:60px 20px;">' +
            '<i class="fas fa-wallet" style="font-size:3rem;display:block;margin-bottom:16px;opacity:0.3;"></i>' +
            '<p style="font-size:1rem;">Tidak ada data untuk nasabah <strong>' + escapeHtml(namaNasabah) + '</strong></p>' +
            '<p style="font-size:0.85rem;color:var(--text-muted);">Pastikan nama nasabah sudah diverifikasi oleh Admin</p>' +
            '</div>';
        return;
    }
    
    renderDetailTabunganForTamu(data, container);
}

// ==================== RENDER DETAIL TABUNGAN DENGAN 3 FOTO ====================
function renderDetailTabunganForTamu(data, container) {
    var html = '<div class="tabungan-card">' +
        '<div class="tabungan-header">' +
        '<h3><i class="fas fa-user"></i> ' + escapeHtml(data.namaNasabah) + '</h3>' +
        '<span class="no-rek">' + currentUserBSU + '</span>' +
        '</div>' +
        '<div class="tabungan-saldo">' +
        '<div class="saldo-label">Total Saldo</div>' +
        '<div class="saldo-value">' + formatRupiah(data.totalSaldo) + '</div>' +
        '<div style="font-size:0.7rem;color:var(--text-muted);">Total Transaksi: ' + data.totalTransaksi + ' | Total Berat: ' + data.totalBerat.toFixed(2) + ' kg</div>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="tabungan-table">' +
        '<thead><tr><th>No</th><th>Tanggal</th><th>Nama Sampah</th><th>RW/RT</th><th>Berat (kg)</th><th>Harga/kg</th><th>Nilai</th><th>Saldo</th><th>Foto</th></tr></thead>' +
        '<tbody>';
    
    for (var i = 0; i < data.history.length; i++) {
        var item = data.history[i];
        var tgl = item.tanggal ? formatTanggalIndo(item.tanggal) : '-';
        var rowClass = (i % 2 === 0) ? '' : 'row-alt';
        
        var fotoHtml = '-';
        var fotoList = [];
        if (item.fotoTimbang) fotoList.push('<a href="' + item.fotoTimbang + '" target="_blank" class="foto-link" title="Foto Timbang">📷</a>');
        if (item.fotoHasil) fotoList.push('<a href="' + item.fotoHasil + '" target="_blank" class="foto-link" title="Foto Hasil">📸</a>');
        if (item.fotoBukti) fotoList.push('<a href="' + item.fotoBukti + '" target="_blank" class="foto-link" title="Foto Bukti">📋</a>');
        if (fotoList.length > 0) fotoHtml = fotoList.join(' ');
        
        html += '<tr class="' + rowClass + '">' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + tgl + '</td>' +
            '<td class="sampah-cell"><strong>' + escapeHtml(item.namaSampah) + '</strong></td>' +
            '<td>' + escapeHtml(item.rw) + ' - ' + escapeHtml(item.rt) + '</td>' +
            '<td>' + item.berat.toFixed(2) + '</td>' +
            '<td>' + formatRupiah(item.hargaPerKg) + '</td>' +
            '<td class="debit">' + formatRupiah(item.nilai) + '</td>' +
            '<td><strong>' + formatRupiah(item.saldo) + '</strong></td>' +
            '<td class="foto-cell">' + fotoHtml + '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table>' +
        '</div>' +
        '<div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
        '<div style="font-size:0.7rem;color:var(--text-muted);">' +
        'Dicetak: ' + formatTanggalIndo(new Date().toISOString()) +
        '</div>' +
        '<button onclick="exportTabunganTamuPDF(\'' + escapeHtml(data.namaNasabah) + '\')" style="padding:8px 20px;background:linear-gradient(135deg,#dc3545,#c82333);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;">' +
        '<i class="fas fa-file-pdf"></i> Ekspor PDF' +
        '</button>' +
        '<button onclick="exportTabunganTamuExcel(\'' + escapeHtml(data.namaNasabah) + '\')" style="padding:8px 20px;background:linear-gradient(135deg,#1e7e34,#28a745);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;">' +
        '<i class="fas fa-file-excel"></i> Ekspor Excel' +
        '</button>' +
        '</div>' +
        '</div>';
    
    container.innerHTML = html;
}

// ==================== REKAP SEMUA NASABAH ====================
function renderRekapTabunganForTamu(searchTerm) {
    var container = document.getElementById('tabunganTamuContainer');
    if (!container) return;
    
    var dataBsu = getDataBSUWithTamu();
    var nasabahMap = {};
    
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        var nama = item.namaNasabah || '-';
        if (nama !== '-' && nama !== 'undefined' && nama !== 'null' && String(nama).trim() !== '') {
            if (!nasabahMap[nama]) {
                nasabahMap[nama] = {
                    nama: nama,
                    totalBerat: 0,
                    totalNilai: 0,
                    totalTransaksi: 0,
                    rw: item.rw || '-',
                    rt: item.rt || '-',
                    lastTransaksi: item.tanggal || null
                };
            }
            var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
            var nilai = item.berat * harga;
            nasabahMap[nama].totalBerat += item.berat;
            nasabahMap[nama].totalNilai += nilai;
            nasabahMap[nama].totalTransaksi++;
            if (item.tanggal && (!nasabahMap[nama].lastTransaksi || new Date(item.tanggal) > new Date(nasabahMap[nama].lastTransaksi))) {
                nasabahMap[nama].lastTransaksi = item.tanggal;
            }
        }
    }
    
    var rekapData = Object.values(nasabahMap);
    rekapData.sort(function(a, b) { return b.totalNilai - a.totalNilai; });
    
    if (searchTerm) {
        var term = searchTerm.toLowerCase();
        rekapData = rekapData.filter(function(n) {
            return n.nama.toLowerCase().includes(term);
        });
    }
    
    if (rekapData.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:60px 20px;">' +
            '<i class="fas fa-file-invoice" style="font-size:2.5rem;display:block;margin-bottom:16px;opacity:0.3;"></i>' +
            '<p style="font-size:1rem;">Belum ada data nasabah</p>' +
            '</div>';
        return;
    }
    
    var grandTotalNilai = 0;
    var grandTotalBerat = 0;
    var grandTotalTransaksi = 0;
    for (var i = 0; i < rekapData.length; i++) {
        grandTotalNilai += rekapData[i].totalNilai;
        grandTotalBerat += rekapData[i].totalBerat;
        grandTotalTransaksi += rekapData[i].totalTransaksi;
    }
    
    var html = '<div class="tabungan-card">' +
        '<div class="tabungan-header">' +
        '<h3><i class="fas fa-users"></i> REKAP SEMUA NASABAH</h3>' +
        '<span class="no-rek">' + currentUserBSU + ' | ' + rekapData.length + ' nasabah</span>' +
        '</div>' +
        '<div style="background:linear-gradient(135deg, var(--primary), var(--primary-light));color:white;padding:16px 20px;border-radius:var(--radius-sm);margin-bottom:16px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">' +
        '<div><span style="opacity:0.8;font-size:0.75rem;">Total Keseluruhan</span><br><strong style="font-size:1.2rem;">' + formatRupiah(grandTotalNilai) + '</strong></div>' +
        '<div><span style="opacity:0.8;font-size:0.75rem;">Total Berat</span><br><strong style="font-size:1.2rem;">' + grandTotalBerat.toFixed(2) + ' kg</strong></div>' +
        '<div><span style="opacity:0.8;font-size:0.75rem;">Total Transaksi</span><br><strong style="font-size:1.2rem;">' + grandTotalTransaksi + '</strong></div>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="tabungan-table">' +
        '<thead><tr><th>No</th><th>Nama Nasabah</th><th>RW/RT</th><th>Berat (kg)</th><th>Transaksi</th><th>Total Tabungan</th><th>Terakhir</th></tr></thead>' +
        '<tbody>';
    
    for (var i = 0; i < rekapData.length; i++) {
        var n = rekapData[i];
        var rowClass = (i % 2 === 0) ? '' : 'row-alt';
        var tgl = n.lastTransaksi ? formatTanggalIndo(n.lastTransaksi) : '-';
        html += '<tr class="' + rowClass + '">' +
            '<td>' + (i + 1) + '</td>' +
            '<td class="nasabah-name-cell"><strong>' + escapeHtml(n.nama) + '</strong></td>' +
            '<td>' + n.rw + ' - ' + n.rt + '</td>' +
            '<td>' + n.totalBerat.toFixed(2) + '</td>' +
            '<td>' + n.totalTransaksi + '</td>' +
            '<td class="debit">' + formatRupiah(n.totalNilai) + '</td>' +
            '<td style="font-size:0.65rem;color:var(--text-muted);">' + tgl + '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table>' +
        '</div>' +
        '<div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
        '<div style="font-size:0.7rem;color:var(--text-muted);">Dicetak: ' + formatTanggalIndo(new Date().toISOString()) + '</div>' +
        '<button onclick="exportRekapTamuExcel()" style="padding:8px 20px;background:linear-gradient(135deg,#1e7e34,#28a745);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;">' +
        '<i class="fas fa-file-excel"></i> Ekspor Excel' +
        '</button>' +
        '<button onclick="printRekapTamuPDF()" style="padding:8px 20px;background:linear-gradient(135deg,#dc3545,#c82333);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;">' +
        '<i class="fas fa-file-pdf"></i> Cetak PDF' +
        '</button>' +
        '</div>' +
        '</div>';
    
    container.innerHTML = html;
}

// ==================== EKSPORT FUNGSI ====================
function exportTabunganTamuPDF(namaNasabah) {
    if (!namaNasabah || namaNasabah === 'all' || namaNasabah === 'undefined') {
        var filterSelect = document.getElementById('tabunganFilterSelect');
        var selectedValue = filterSelect ? filterSelect.value : 'all';
        if (selectedValue !== 'all' && selectedValue !== '__separator__') {
            namaNasabah = selectedValue;
        } else {
            showToast('Pilih nama nasabah terlebih dahulu!', true);
            return;
        }
    }
    
    var data = generateTabunganNasabah(namaNasabah);
    
    if (data.history.length === 0) {
        showToast('Tidak ada data untuk nasabah ini!', true);
        return;
    }
    
    var tglCetak = formatTanggalIndo(new Date().toISOString());
    var admin = sessionStorage.getItem('adminName') || 'BSU';
    
    var tabelDetail = '';
    for (var i = 0; i < data.history.length; i++) {
        var item = data.history[i];
        var tgl = item.tanggal ? formatTanggalIndo(item.tanggal) : '-';
        var bgColor = (i % 2 === 0) ? '#ffffff' : '#f9f9f9';
        
        var fotoHtml = '-';
        var fotoList = [];
        if (item.fotoTimbang) fotoList.push('<a href="' + item.fotoTimbang + '" target="_blank">📷</a>');
        if (item.fotoHasil) fotoList.push('<a href="' + item.fotoHasil + '" target="_blank">📸</a>');
        if (item.fotoBukti) fotoList.push('<a href="' + item.fotoBukti + '" target="_blank">📋</a>');
        if (fotoList.length > 0) fotoHtml = fotoList.join(' ');
        
        tabelDetail += '<tr style="background:' + bgColor + ';">' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">' + (i+1) + '</td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">' + tgl + '</td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;"><strong>' + escapeHtml(item.namaSampah) + '</strong></td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">' + escapeHtml(item.rw) + ' - ' + escapeHtml(item.rt) + '</td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">' + item.berat.toFixed(2) + '</td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">' + formatRupiah(item.hargaPerKg) + '</td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">' + formatRupiah(item.nilai) + '</td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:right;"><strong>' + formatRupiah(item.saldo) + '</strong></td>' +
            '<td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">' + fotoHtml + '</td>' +
            '</tr>';
    }
    
    var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Buku Tabungan - ' + escapeHtml(namaNasabah) + '</title><style>' +
        'body { font-family: "Times New Roman", Arial, sans-serif; padding: 30px; }' +
        '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; }' +
        'h1 { color: #2e7d32; margin-bottom: 5px; font-size: 24px; }' +
        '.subtitle { color: #666; font-size: 14px; }' +
        '.info-nasabah { background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }' +
        '.info-nasabah .nasabah-name { font-size: 20px; color: #1a5e2a; font-weight: bold; }' +
        '.info-nasabah .nasabah-detail { font-size: 14px; color: #2e7d32; margin-top: 4px; }' +
        '.saldo-box { background: linear-gradient(135deg, #2e7d32, #4caf7a); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }' +
        '.saldo-box .label { font-size: 12px; opacity: 0.8; }' +
        '.saldo-box .value { font-size: 28px; font-weight: bold; }' +
        '.saldo-box .detail { font-size: 12px; opacity: 0.9; margin-top: 5px; }' +
        'table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }' +
        'th { background: #2e7d32; color: white; padding: 10px; text-align: center; }' +
        'td { padding: 6px 10px; border-bottom: 1px solid #ddd; }' +
        '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }' +
        '.signature { margin-top: 40px; display: flex; justify-content: space-around; }' +
        '.signature-box { text-align: center; }' +
        '.signature-line { margin-top: 40px; width: 200px; border-top: 1px solid #000; margin: 0 auto; }' +
        '.signature-box p { margin-top: 8px; font-size: 12px; }' +
        '</style></head><body>' +
        '<div class="header">' +
        '<h1>BANK SAMPAH DIGITAL</h1>' +
        '<div class="subtitle">BSI Mandiri - Desa Gunung Putri</div>' +
        '</div>' +
        '<div class="info-nasabah">' +
        '<div style="font-size:14px;color:#666;margin-bottom:4px;">📘 BUKU TABUNGAN</div>' +
        '<div class="nasabah-name">' + escapeHtml(namaNasabah) + '</div>' +
        '<div class="nasabah-detail">BSU: ' + currentUserBSU + '</div>' +
        '</div>' +
        '<div class="saldo-box">' +
        '<div class="label">TOTAL SALDO</div>' +
        '<div class="value">' + formatRupiah(data.totalSaldo) + '</div>' +
        '<div class="detail">Total Transaksi: ' + data.totalTransaksi + ' | Total Berat: ' + data.totalBerat.toFixed(2) + ' kg</div>' +
        '</div>' +
        '<table><thead><tr><th>No</th><th>Tanggal</th><th>Nama Sampah</th><th>RW/RT</th><th>Berat (kg)</th><th>Harga/kg</th><th>Nilai</th><th>Saldo</th><th>Foto</th></tr></thead><tbody>' +
        tabelDetail + '</tbody></table>' +
        '<div class="footer">' +
        '<p>Dicetak pada: ' + tglCetak + '</p>' +
        '<p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p>' +
        '</div>' +
        '<div class="signature">' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Kepala Bank Sampah</p></div>' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Ketua BSU</p></div>' +
        '</div>' +
        '</body></html>';
    
    try {
        var blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Buku_Tabungan_' + escapeHtml(namaNasabah) + '.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function() { URL.revokeObjectURL(link.href); }, 100);
        showToast('Buku tabungan berhasil diunduh! Buka di browser untuk print/save PDF.', false);
    } catch(e) {
        var win = window.open('', '_blank', 'width=800,height=600');
        if (win) {
            win.document.write(htmlContent);
            win.document.close();
            setTimeout(function() { win.print(); }, 500);
        } else {
            showToast('Popup diblokir! Silakan izinkan popup.', true);
        }
    }
}

function exportTabunganTamuExcel(namaNasabah) {
    if (!namaNasabah || namaNasabah === 'all' || namaNasabah === 'undefined') {
        var filterSelect = document.getElementById('tabunganFilterSelect');
        var selectedValue = filterSelect ? filterSelect.value : 'all';
        if (selectedValue !== 'all' && selectedValue !== '__separator__') {
            namaNasabah = selectedValue;
        } else {
            showToast('Pilih nama nasabah terlebih dahulu!', true);
            return;
        }
    }
    
    var data = generateTabunganNasabah(namaNasabah);
    
    if (data.history.length === 0) {
        showToast('Tidak ada data untuk nasabah ini!', true);
        return;
    }
    
    var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
        'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
        'xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="UTF-8">' +
        '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>' +
        '<x:ExcelWorksheet><x:Name>Tabungan</x:Name><x:WorksheetOptions>' +
        '<x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>' +
        '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
        '<style>' +
        'body { font-family: Arial, sans-serif; }' +
        'h1 { color: #2e7d32; text-align: center; font-size: 18px; }' +
        'th { background: #2e7d32; color: white; padding: 10px; border: 1px solid #ddd; }' +
        'td { padding: 8px; border: 1px solid #ddd; }' +
        '.total-row { background: #e8f5e9; font-weight: bold; }' +
        '</style>' +
        '</head><body>' +
        '<h1>BUKU TABUNGAN</h1>' +
        '<p style="text-align:center;">Nama Nasabah: <strong>' + escapeHtml(namaNasabah) + '</strong></p>' +
        '<p style="text-align:center;">BSU: ' + currentUserBSU + '</p>' +
        '<p style="text-align:center;">Periode: ' + formatTanggalIndo(new Date().toISOString()) + '</p>' +
        '<br>' +
        '<table>' +
        '<tr><th>No</th><th>Tanggal</th><th>Nama Sampah</th><th>RW/RT</th><th>Berat (kg)</th><th>Harga/kg</th><th>Nilai (Rp)</th><th>Saldo (Rp)</th></tr>';
    
    for (var i = 0; i < data.history.length; i++) {
        var item = data.history[i];
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + (item.tanggal ? formatTanggalIndo(item.tanggal) : '-') + '</td>' +
            '<td><strong>' + escapeHtml(item.namaSampah) + '</strong></td>' +
            '<td>' + escapeHtml(item.rw) + ' - ' + escapeHtml(item.rt) + '</td>' +
            '<td>' + item.berat.toFixed(2) + '</td>' +
            '<td>' + formatRupiah(item.hargaPerKg) + '</td>' +
            '<td>' + formatRupiah(item.nilai) + '</td>' +
            '<td><strong>' + formatRupiah(item.saldo) + '</strong></td>' +
            '</tr>';
    }
    
    html += '<tr class="total-row">' +
        '<td colspan="7" style="text-align:right;">TOTAL</td>' +
        '<td>' + formatRupiah(data.totalSaldo) + '</td>' +
        '</tr>' +
        '</table>' +
        '<p style="text-align:center;margin-top:30px;">Dicetak: ' + formatTanggalIndo(new Date().toISOString()) + '</p>' +
        '</body></html>';
    
    try {
        var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'Buku_Tabungan_' + escapeHtml(namaNasabah) + '.xls';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function() { URL.revokeObjectURL(url); }, 100);
        showToast('Buku tabungan berhasil diekspor ke Excel!', false);
    } catch(e) {
        showToast('Gagal ekspor Excel: ' + e.message, true);
    }
}

// ==================== TAMBAH DATA TAMU (FIX - SIMPAN KE ADMIN) ====================
function tambahDataTamu() {
    var namaNasabah = document.getElementById('tamuNamaNasabah').value;
    var namaSampah = document.getElementById('tamuNamaSampah').value;
    var berat = parseFloat(document.getElementById('tamuBeratSampah').value);
    var bsu = document.getElementById('tamuBSU').value;
    var ketua = document.getElementById('tamuKetuaBSU').value;
    var tanggal = document.getElementById('tamuTanggal').value;
    
    var fotoTimbang = document.getElementById('previewFotoTimbang').querySelector('img');
    var fotoHasil = document.getElementById('previewFotoHasil').querySelector('img');
    var fotoBukti = document.getElementById('previewFotoBukti').querySelector('img');
    
    // VALIDASI
    if (!namaNasabah.trim()) {
        showToast('Nama nasabah wajib diisi!', true);
        document.getElementById('tamuNamaNasabah').focus();
        return;
    }
    if (!namaSampah.trim()) {
        showToast('Nama sampah wajib diisi!', true);
        document.getElementById('tamuNamaSampah').focus();
        return;
    }
    if (berat <= 0 || isNaN(berat)) {
        showToast('Berat harus lebih dari 0 kg!', true);
        document.getElementById('tamuBeratSampah').focus();
        return;
    }
    if (!bsu.trim()) {
        showToast('BSU tidak terdeteksi! Silakan login ulang.', true);
        return;
    }
    if (!ketua.trim()) {
        showToast('Ketua BSU tidak terdeteksi!', true);
        return;
    }
    if (!fotoTimbang) {
        showToast('Foto penimbangan wajib diupload!', true);
        return;
    }
    if (!fotoHasil) {
        showToast('Foto hasil timbangan wajib diupload!', true);
        return;
    }
    if (!fotoBukti) {
        showToast('Foto bukti sampah wajib diupload!', true);
        return;
    }
    
    var rw = currentUserRW || 'RW01';
    var rt = currentUserRT || 'RT01';
    
    showToast('Mengupload data...', false);
    
    try {
        // Ambil data foto sebagai base64
        var fotoTimbangData = fotoTimbang.src;
        var fotoHasilData = fotoHasil.src;
        var fotoBuktiData = fotoBukti.src;
        
        // Buat ID unik
        var newId = Date.now() + Math.floor(Math.random() * 1000);
        
        // Simpan ke localStorage dengan key yang sama dengan admin
        var newItem = {
            id: newId,
            namaNasabah: namaNasabah.trim(),
            nama: namaSampah.trim(),
            berat: berat,
            bsu: bsu.trim(),
            ketua: ketua.trim(),
            rw: rw,
            rt: rt,
            tanggal: tanggal || new Date().toISOString().slice(0,10),
            fotoTimbang: fotoTimbangData,
            fotoHasil: fotoHasilData,
            fotoBukti: fotoBuktiData,
            status: 'pending',
            hargaPerKg: 0,
            verifiedBy: null,
            verifiedAt: null,
            createdAt: new Date().toISOString()
        };
        
        // Tambahkan ke array
        dataTamuMenunggu.push(newItem);
        saveTamuDataLocal();
        
        // ===== KIRIM SINYAL KE ADMIN VIA LOCALSTORAGE =====
        // Data sudah tersimpan di localStorage dengan key 'bankSampahTamuData'
        // Admin akan membaca dari key yang sama
        localStorage.setItem('tamuDataPending', JSON.stringify({
            count: dataTamuMenunggu.filter(function(item) { return item.status === 'pending'; }).length,
            lastUpdate: new Date().toISOString(),
            latestData: newItem
        }));
        
        // ===== COBA KIRIM KE SUPABASE =====
        try {
            if (typeof supabaseInsert === 'function') {
                var insertData = {
                    rw: rw,
                    rt: rt,
                    berat_kg: berat,
                    harga_per_kg: 0,
                    total_nilai: 0,
                    jenis: 'nonorganik',
                    tanggal_transaksi: tanggal || new Date().toISOString(),
                    nama_nasabah: namaNasabah.trim(),
                    status: 'pending',
                    foto_timbang: fotoTimbangData,
                    foto_hasil: fotoHasilData,
                    foto_bukti: fotoBuktiData,
                    bsu_nama: bsu.trim(),
                    ketua_bsu: ketua.trim()
                };
                
                supabaseInsert('transaksi_sampah', insertData)
                    .then(function(result) {
                        console.log('Data saved to Supabase:', result);
                    })
                    .catch(function(err) {
                        console.error('Error saving to Supabase:', err);
                    });
            }
        } catch (supabaseError) {
            console.error('Supabase error:', supabaseError);
        }
        
        // Reset form
        document.getElementById('tamuNamaNasabah').value = '';
        document.getElementById('tamuNamaSampah').value = '';
        document.getElementById('tamuBeratSampah').value = '1';
        document.getElementById('previewFotoTimbang').innerHTML = '';
        document.getElementById('previewFotoHasil').innerHTML = '';
        document.getElementById('previewFotoBukti').innerHTML = '';
        
        updateNasabahDatalist();
        renderHistory();
        updateDashboard();
        
        showToast('✅ Data berhasil dikirim untuk verifikasi! Admin akan melihat data Anda.', false);
        
    } catch (error) {
        console.error('Error tambah data:', error);
        showToast('Gagal mengirim data: ' + (error.message || 'Coba lagi'), true);
    }
}

// ==================== UPLOAD FOTO ====================
function setupUploadFoto() {
    // Foto 1: Timbang
    var uploadTimbang = document.getElementById('uploadFotoTimbang');
    var inputTimbang = document.getElementById('fotoTimbang');
    var previewTimbang = document.getElementById('previewFotoTimbang');
    
    if (uploadTimbang && inputTimbang) {
        uploadTimbang.addEventListener('click', function() {
            inputTimbang.click();
        });
        inputTimbang.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    previewTimbang.innerHTML = '<img src="' + event.target.result + '" alt="Foto Penimbangan">';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Foto 2: Hasil
    var uploadHasil = document.getElementById('uploadFotoHasil');
    var inputHasil = document.getElementById('fotoHasil');
    var previewHasil = document.getElementById('previewFotoHasil');
    
    if (uploadHasil && inputHasil) {
        uploadHasil.addEventListener('click', function() {
            inputHasil.click();
        });
        inputHasil.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    previewHasil.innerHTML = '<img src="' + event.target.result + '" alt="Foto Hasil Timbangan">';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Foto 3: Bukti
    var uploadBukti = document.getElementById('uploadFotoBukti');
    var inputBukti = document.getElementById('fotoBukti');
    var previewBukti = document.getElementById('previewFotoBukti');
    
    if (uploadBukti && inputBukti) {
        uploadBukti.addEventListener('click', function() {
            inputBukti.click();
        });
        inputBukti.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    previewBukti.innerHTML = '<img src="' + event.target.result + '" alt="Foto Bukti Sampah">';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// ==================== RENDER HISTORY ====================
function renderHistory() {
    var container = document.getElementById('historyList');
    var count = document.getElementById('historyCount');
    if (!container) return;
    
    var dataBsuHistory = [];
    for (var i = 0; i < dataTamuMenunggu.length; i++) {
        if (dataTamuMenunggu[i].bsu === currentUserBSU) {
            dataBsuHistory.push(dataTamuMenunggu[i]);
        }
    }
    
    if (count) count.textContent = dataBsuHistory.length + ' data';
    
    if (dataBsuHistory.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<i class="fas fa-inbox"></i>' +
            '<p>Belum ada data yang dikirim</p>' +
        '</div>';
        return;
    }
    
    var html = '';
    var sortedData = dataBsuHistory.slice().reverse();
    for (var i = 0; i < sortedData.length; i++) {
        var item = sortedData[i];
        var statusText = '';
        var statusClass = '';
        if (item.status === 'pending') {
            statusText = '⏳ Menunggu Verifikasi';
            statusClass = 'pending';
        } else if (item.status === 'verified') {
            statusText = '✅ Diverifikasi';
            statusClass = 'verified';
        } else if (item.status === 'rejected') {
            statusText = '❌ Ditolak';
            statusClass = 'rejected';
        }
        
        var fotoInfo = '';
        if (item.fotoTimbang) fotoInfo += '📷 ';
        if (item.fotoHasil) fotoInfo += '📸 ';
        if (item.fotoBukti) fotoInfo += '📋 ';
        if (!fotoInfo) fotoInfo = '-';
        
        html += '<div class="history-item">' +
            '<div class="item-info">' +
                '<div class="item-name">' + escapeHtml(item.nama) + '</div>' +
                '<div class="item-detail">' + item.berat.toFixed(2) + ' kg | ' + escapeHtml(item.namaNasabah || '-') + ' | ' + item.tanggal + ' | Foto: ' + fotoInfo + '</div>' +
            '</div>' +
            '<span class="item-status ' + statusClass + '">' + statusText + '</span>' +
        '</div>';
    }
    container.innerHTML = html;
}

// ==================== POPULATE DATALIST ====================
function populateSampahDatalist() {
    var datalist = document.getElementById('sampahDatalist');
    if (!datalist) return;
    
    var allSampah = presetSampah.plastik.concat(presetSampah.logam).concat(presetSampah.kertas);
    var html = '';
    for (var i = 0; i < allSampah.length; i++) {
        html += '<option value="' + escapeHtml(allSampah[i]) + '">';
    }
    datalist.innerHTML = html;
}

// ==================== SETUP TABS ====================
function setupTabs() {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    
    for (var i = 0; i < tabBtns.length; i++) {
        tabBtns[i].addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab');
            
            for (var j = 0; j < tabBtns.length; j++) {
                tabBtns[j].classList.remove('active');
            }
            this.classList.add('active');
            
            for (var j = 0; j < tabContents.length; j++) {
                tabContents[j].classList.remove('active');
            }
            var targetId = 'tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1);
            var target = document.getElementById(targetId);
            if (target) target.classList.add('active');
            
            if (tabId === 'dashboard') {
                updateDashboard();
            } else if (tabId === 'nasabah') {
                renderNasabahList(document.getElementById('nasabahSearchInput').value || '');
            } else if (tabId === 'history') {
                renderHistory();
            } else if (tabId === 'tabungan') {
                renderBukuTabunganTamuWithFilter();
            } else if (tabId === 'rekap') {
                renderRekapTabunganForTamu(document.getElementById('rekapSearchInput').value || '');
            }
        });
    }
}

// ==================== LOGOUT ====================
function openConfirmLogout() {
    var modal = document.getElementById('confirmLogoutModal');
    if (modal) modal.style.display = 'block';
}

function closeConfirmLogout() {
    var modal = document.getElementById('confirmLogoutModal');
    if (modal) modal.style.display = 'none';
}

function confirmLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userBSU');
    sessionStorage.removeItem('userRW');
    sessionStorage.removeItem('userRT');
    sessionStorage.removeItem('loginTime');
    window.location.href = 'menu_login.html';
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tamu page loaded');
    
    setUserBSU();
    
    var bsuNameDisplay = document.getElementById('bsuNameDisplay');
    if (bsuNameDisplay) {
        bsuNameDisplay.textContent = currentUserBSU;
    }
    
    var userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = currentUserName || 'Pengunjung';
    }
    
    var tanggalInput = document.getElementById('tamuTanggal');
    if (tanggalInput) {
        var now = new Date();
        tanggalInput.value = now.toISOString().slice(0,10);
    }
    
    var bsuInput = document.getElementById('tamuBSU');
    if (bsuInput) {
        bsuInput.value = currentUserBSU;
    }
    
    var ketuaInput = document.getElementById('tamuKetuaBSU');
    if (ketuaInput) {
        for (var i = 0; i < dataBSU.length; i++) {
            if (dataBSU[i].nama === currentUserBSU) {
                ketuaInput.value = dataBSU[i].ketua || 'Ketua BSU';
                break;
            }
        }
    }
    
    var rwrtInput = document.getElementById('tamuRWRT');
    if (rwrtInput) {
        rwrtInput.value = currentUserRW + ' - ' + (currentUserRT === 'all' ? 'Semua RT' : currentUserRT);
    }
    
    // Load data
    loadTamuData();
    
    populateSampahDatalist();
    setupUploadFoto();
    setupTabs();
    updateNasabahDatalist();
    
    setTimeout(function() {
        updateDashboard();
    }, 100);
    
    // ===== EVENT LISTENERS =====
    var tambahBtn = document.getElementById('tambahTamuBtn');
    if (tambahBtn) {
        tambahBtn.addEventListener('click', tambahDataTamu);
    }
    
    var generateTabunganBtn = document.getElementById('generateTabunganTamuBtn');
    if (generateTabunganBtn) {
        generateTabunganBtn.addEventListener('click', renderBukuTabunganTamuWithFilter);
    }
    
    var filterSelect = document.getElementById('tabunganFilterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            if (this.value !== 'all' && this.value !== '__separator__') {
                document.getElementById('tabunganNamaNasabah').value = this.value;
                renderBukuTabunganTamuWithFilter();
            } else {
                document.getElementById('tabunganNamaNasabah').value = '';
                renderBukuTabunganTamuWithFilter();
            }
        });
    }
    
    var namaNasabahInput = document.getElementById('tabunganNamaNasabah');
    if (namaNasabahInput) {
        namaNasabahInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderBukuTabunganTamuWithFilter();
            }
        });
    }
    
    // PDF Export
    var exportPdfBtn = document.getElementById('exportTabunganTamuPDF');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            var nama = document.getElementById('tabunganNamaNasabah').value.trim();
            if (!nama) {
                var filterSelect2 = document.getElementById('tabunganFilterSelect');
                if (filterSelect2 && filterSelect2.value !== 'all' && filterSelect2.value !== '__separator__') {
                    nama = filterSelect2.value;
                }
            }
            exportTabunganTamuPDF(nama);
        });
    }
    
    // Excel Export
    var exportExcelBtn = document.getElementById('exportTabunganTamuExcel');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            var nama = document.getElementById('tabunganNamaNasabah').value.trim();
            if (!nama) {
                var filterSelect2 = document.getElementById('tabunganFilterSelect');
                if (filterSelect2 && filterSelect2.value !== 'all' && filterSelect2.value !== '__separator__') {
                    nama = filterSelect2.value;
                }
            }
            exportTabunganTamuExcel(nama);
        });
    }
    
    // Nasabah search
    var nasabahSearchBtn = document.getElementById('nasabahSearchBtn');
    if (nasabahSearchBtn) {
        nasabahSearchBtn.addEventListener('click', function() {
            var search = document.getElementById('nasabahSearchInput').value || '';
            renderNasabahList(search);
        });
    }
    
    var nasabahResetBtn = document.getElementById('nasabahResetBtn');
    if (nasabahResetBtn) {
        nasabahResetBtn.addEventListener('click', function() {
            document.getElementById('nasabahSearchInput').value = '';
            renderNasabahList('');
        });
    }
    
    var nasabahSearchInput = document.getElementById('nasabahSearchInput');
    if (nasabahSearchInput) {
        nasabahSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderNasabahList(this.value || '');
            }
        });
    }
    
    // Rekap
    var rekapSearchBtn = document.getElementById('rekapSearchBtn');
    if (rekapSearchBtn) {
        rekapSearchBtn.addEventListener('click', function() {
            var search = document.getElementById('rekapSearchInput').value || '';
            renderRekapTabunganForTamu(search);
        });
    }
    
    var rekapResetBtn = document.getElementById('rekapResetBtn');
    if (rekapResetBtn) {
        rekapResetBtn.addEventListener('click', function() {
            document.getElementById('rekapSearchInput').value = '';
            renderRekapTabunganForTamu('');
        });
    }
    
    var rekapExportBtn = document.getElementById('rekapExportBtn');
    if (rekapExportBtn) {
        rekapExportBtn.addEventListener('click', exportRekapTamuExcel);
    }
    
    var rekapPrintBtn = document.getElementById('rekapPrintBtn');
    if (rekapPrintBtn) {
        rekapPrintBtn.addEventListener('click', printRekapTamuPDF);
    }
    
    // Logout
    var logoutBtn = document.getElementById('logoutTamuBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openConfirmLogout();
        });
    }
    
    // Auto refresh setiap 30 detik untuk sync data
    setInterval(function() {
        loadTamuDataLocal();
        updateNasabahDatalist();
        checkPendingData();
    }, 30000);
    
    console.log('Tamu page initialized with BSU:', currentUserBSU);
});

// ==================== EKSPOR REKAP EXCEL (TAMU) ====================
function exportRekapTamuExcel() {
    var dataBsu = getDataBSUWithTamu();
    var nasabahMap = {};
    
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        var nama = item.namaNasabah || '-';
        if (nama !== '-' && nama !== 'undefined' && nama !== 'null' && String(nama).trim() !== '') {
            if (!nasabahMap[nama]) {
                nasabahMap[nama] = {
                    nama: nama,
                    totalBerat: 0,
                    totalNilai: 0,
                    totalTransaksi: 0,
                    rw: item.rw || '-',
                    rt: item.rt || '-',
                    bsu: item.bsu || currentUserBSU || '-',
                    detail: [],
                    fotoTimbang: null,
                    fotoHasil: null,
                    fotoBukti: null
                };
            }
            var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
            var nilai = item.berat * harga;
            nasabahMap[nama].totalBerat += item.berat;
            nasabahMap[nama].totalNilai += nilai;
            nasabahMap[nama].totalTransaksi++;
            nasabahMap[nama].detail.push({
                tanggal: item.tanggal || '-',
                namaSampah: item.nama || 'Tidak Diketahui',
                berat: item.berat,
                harga: harga,
                nilai: nilai,
                fotoTimbang: item.foto_timbang || null,
                fotoHasil: item.foto_hasil || null,
                fotoBukti: item.foto_bukti || null
            });
            if (item.foto_timbang) nasabahMap[nama].fotoTimbang = item.foto_timbang;
            if (item.foto_hasil) nasabahMap[nama].fotoHasil = item.foto_hasil;
            if (item.foto_bukti) nasabahMap[nama].fotoBukti = item.foto_bukti;
        }
    }
    
    var rekapData = Object.values(nasabahMap);
    rekapData.sort(function(a, b) { return b.totalNilai - a.totalNilai; });
    
    if (rekapData.length === 0) {
        showToast('Tidak ada data untuk diekspor!', true);
        return;
    }
    
    var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
    html += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    html += 'xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><meta charset="UTF-8">';
    html += '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>';
    html += '<x:ExcelWorksheet><x:Name>Rekap_Tabungan</x:Name><x:WorksheetOptions>';
    html += '<x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
    html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
    html += '<style>';
    html += 'body { font-family: Arial, sans-serif; padding: 20px; }';
    html += '.main-title { background: #2e7d32; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; }';
    html += '.sub-title { background: #e8f5e9; padding: 12px; text-align: center; font-size: 12px; }';
    html += '.bsu-header { background: #4caf7a; color: white; padding: 12px; font-size: 14px; font-weight: bold; margin-top: 20px; }';
    html += '.nasabah-title { background: #e8f5e9; padding: 8px 12px; font-size: 13px; font-weight: bold; color: #1a5e2a; margin-top: 10px; border-left: 4px solid #2e7d32; }';
    html += 'table { border-collapse: collapse; width: 100%; margin: 8px 0; }';
    html += 'th { background: #2e7d32; color: white; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center; font-size: 11px; }';
    html += 'td { padding: 6px 8px; border: 1px solid #ddd; text-align: center; font-size: 10px; }';
    html += '.total-row { background: #e8f5e9; font-weight: bold; }';
    html += '.sampah-cell { text-align: left; font-weight: 600; }';
    html += '.nasabah-name { text-align: left; font-weight: bold; color: #1a5e2a; }';
    html += '.foto-cell { text-align: center; }';
    html += '.grand-total { background: #2e7d32; color: white; padding: 12px; text-align: center; font-size: 15px; font-weight: bold; margin-top: 20px; }';
    html += '.footer { text-align: center; font-size: 10px; color: #999; padding: 15px; border-top: 1px solid #ddd; margin-top: 15px; }';
    html += '.sub-total-row { background: #c8e6c9; font-weight: bold; }';
    html += '</style>';
    html += '</head><body>';
    
    html += '<div class="main-title">REKAP TABUNGAN SEMUA NASABAH</div>';
    html += '<div class="sub-title">';
    html += 'Bank Sampah Digital - BSI Mandiri | Desa Gunung Putri<br>';
    html += 'Periode: ' + formatTanggalIndo(new Date());
    html += ' | BSU: ' + currentUserBSU;
    html += '</div>';
    
    var grandTotalNilai = 0;
    var grandTotalBerat = 0;
    var grandTotalTransaksi = 0;
    
    // Tabel Ringkasan
    html += '<table>';
    html += '<tr><th>No</th><th>Nama Nasabah</th><th>RW/RT</th><th>Total Berat (kg)</th><th>Total Transaksi</th><th>Total Tabungan</th><th>Foto</th></tr>';
    
    for (var i = 0; i < rekapData.length; i++) {
        var n = rekapData[i];
        var fotoText = '-';
        var fotoList = [];
        if (n.fotoTimbang) fotoList.push('Timbang');
        if (n.fotoHasil) fotoList.push('Hasil');
        if (n.fotoBukti) fotoList.push('Bukti');
        if (fotoList.length > 0) fotoText = fotoList.join(', ');
        
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td class="nasabah-name">' + n.nama + '</td>' +
            '<td>' + n.rw + ' - ' + n.rt + '</td>' +
            '<td>' + n.totalBerat.toFixed(2) + '</td>' +
            '<td>' + n.totalTransaksi + '</td>' +
            '<td>' + formatRupiah(n.totalNilai) + '</td>' +
            '<td class="foto-cell">' + fotoText + '</td>' +
            '</tr>';
        grandTotalNilai += n.totalNilai;
        grandTotalBerat += n.totalBerat;
        grandTotalTransaksi += n.totalTransaksi;
    }
    
    html += '<tr class="total-row">' +
        '<td colspan="5" style="text-align:right;">GRAND TOTAL</td>' +
        '<td>' + formatRupiah(grandTotalNilai) + '</td>' +
        '<td></td>' +
        '</tr>';
    html += '</table><br>';
    
    // Detail per nasabah
    for (var i = 0; i < rekapData.length; i++) {
        var n = rekapData[i];
        html += '<div class="nasabah-title">Detail Transaksi: ' + n.nama + ' (' + n.rw + ' - ' + n.rt + ')</div>';
        html += '<table>';
        html += '<tr><th>No</th><th>Tanggal</th><th>Nama Sampah</th><th>Berat (kg)</th><th>Harga/kg</th><th>Nilai (Rp)</th><th>Timbang</th><th>Hasil</th><th>Bukti</th></tr>';
        
        for (var j = 0; j < n.detail.length; j++) {
            var d = n.detail[j];
            var fotoTimbang = d.fotoTimbang ? 'Ada' : '-';
            var fotoHasil = d.fotoHasil ? 'Ada' : '-';
            var fotoBukti = d.fotoBukti ? 'Ada' : '-';
            
            html += '<tr>' +
                '<td>' + (j + 1) + '</td>' +
                '<td>' + (d.tanggal ? formatTanggalIndo(d.tanggal) : '-') + '</td>' +
                '<td class="sampah-cell">' + d.namaSampah + '</td>' +
                '<td>' + d.berat.toFixed(2) + '</td>' +
                '<td>' + formatRupiah(d.harga) + '</td>' +
                '<td>' + formatRupiah(d.nilai) + '</td>' +
                '<td class="foto-cell">' + fotoTimbang + '</td>' +
                '<td class="foto-cell">' + fotoHasil + '</td>' +
                '<td class="foto-cell">' + fotoBukti + '</td>' +
                '</tr>';
        }
        
        html += '<tr class="sub-total-row">' +
            '<td colspan="5" style="text-align:right;">Sub Total ' + n.nama + '</td>' +
            '<td>' + formatRupiah(n.totalNilai) + '</td>' +
            '<td colspan="3"></td>' +
            '</tr>';
        html += '</table><br>';
    }
    
    html += '<div class="grand-total">';
    html += 'GRAND TOTAL KESELURUHAN<br>';
    html += formatRupiah(grandTotalNilai) + ' | Total Berat: ' + grandTotalBerat.toFixed(2) + ' kg | Total Transaksi: ' + grandTotalTransaksi;
    html += '</div>';
    
    html += '<div class="footer">';
    html += 'Dicetak: ' + formatTanggalIndo(new Date()) + '<br>';
    html += 'Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi';
    html += '</div>';
    
    html += '</body></html>';
    
    try {
        var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'Rekap_Tabungan_Nasabah.xls';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function() { URL.revokeObjectURL(url); }, 100);
        showToast('Rekap tabungan berhasil diekspor!', false);
    } catch(e) {
        showToast('Gagal ekspor: ' + e.message, true);
    }
}
function printRekapTamuPDF() {
    var dataBsu = getDataBSUWithTamu();
    var nasabahMap = {};
    
    for (var i = 0; i < dataBsu.length; i++) {
        var item = dataBsu[i];
        var nama = item.namaNasabah || '-';
        if (nama !== '-' && nama !== 'undefined' && nama !== 'null' && String(nama).trim() !== '') {
            if (!nasabahMap[nama]) {
                nasabahMap[nama] = {
                    nama: nama,
                    totalBerat: 0,
                    totalNilai: 0,
                    totalTransaksi: 0,
                    rw: item.rw || '-',
                    rt: item.rt || '-'
                };
            }
            var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
            var nilai = item.berat * harga;
            nasabahMap[nama].totalBerat += item.berat;
            nasabahMap[nama].totalNilai += nilai;
            nasabahMap[nama].totalTransaksi++;
        }
    }
    
    var rekapData = Object.values(nasabahMap);
    rekapData.sort(function(a, b) { return b.totalNilai - a.totalNilai; });
    
    if (rekapData.length === 0) {
        showToast('Tidak ada data untuk dicetak!', true);
        return;
    }
    
    var tglCetak = formatTanggalIndo(new Date().toISOString());
    var admin = sessionStorage.getItem('adminName') || 'BSU';
    
    var tabelDetail = '';
    var grandTotal = 0;
    for (var i = 0; i < rekapData.length; i++) {
        var n = rekapData[i];
        grandTotal += n.totalNilai;
        var bgColor = (i % 2 === 0) ? '#ffffff' : '#f9f9f9';
        tabelDetail += '<tr style="background:' + bgColor + ';">' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + (i + 1) + '</td>' +
            '<td style="border:1px solid #ddd;padding:8px;"><strong>' + escapeHtml(n.nama) + '</strong></td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + n.rw + ' - ' + n.rt + '</td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:right;">' + n.totalBerat.toFixed(2) + ' kg</td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + n.totalTransaksi + '</td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:right;">' + formatRupiah(n.totalNilai) + '</td>' +
            '</tr>';
    }
    
    var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Rekap Tabungan - ' + currentUserBSU + '</title><style>' +
        'body { font-family: "Times New Roman", Arial, sans-serif; padding: 30px; }' +
        '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; }' +
        'h1 { color: #2e7d32; margin-bottom: 5px; font-size: 24px; }' +
        '.subtitle { color: #666; font-size: 14px; }' +
        '.info { text-align: center; margin: 20px 0; padding: 12px; background: #e8f5e9; border-radius: 8px; }' +
        'table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }' +
        'th { background: #2e7d32; color: white; padding: 10px; text-align: center; }' +
        'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
        '.total-row { background: #e8f5e9; font-weight: bold; }' +
        '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }' +
        '.signature { margin-top: 40px; display: flex; justify-content: space-around; }' +
        '.signature-box { text-align: center; }' +
        '.signature-line { margin-top: 40px; width: 200px; border-top: 1px solid #000; margin: 0 auto; }' +
        '.signature-box p { margin-top: 8px; font-size: 12px; }' +
        '</style></head><body>' +
        '<div class="header">' +
        '<h1>BANK SAMPAH DIGITAL</h1>' +
        '<div class="subtitle">BSI Mandiri - Desa Gunung Putri</div>' +
        '</div>' +
        '<div class="info">' +
        '<strong>REKAP TABUNGAN SEMUA NASABAH</strong><br>' +
        'BSU: ' + currentUserBSU + '<br>' +
        'Periode: ' + tglCetak +
        '</div>' +
        '<table><thead><tr><th>No</th><th>Nama Nasabah</th><th>RW/RT</th><th>Total Berat</th><th>Transaksi</th><th>Total Tabungan</th></tr></thead><tbody>' +
        tabelDetail +
        '<tr class="total-row"><td colspan="5" style="text-align:right;">TOTAL KESELURUHAN</td><td style="text-align:right;">' + formatRupiah(grandTotal) + '</td></tr>' +
        '</tbody></table>' +
        '<div class="footer">' +
        '<p>Dicetak pada: ' + tglCetak + '</p>' +
        '<p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p>' +
        '</div>' +
        '<div class="signature">' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Kepala Bank Sampah</p></div>' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Ketua BSU</p></div>' +
        '</div>' +
        '</body></html>';
    
    try {
        var win = window.open('', '_blank', 'width=800,height=600');
        if (win) {
            win.document.write(htmlContent);
            win.document.close();
            setTimeout(function() { win.print(); }, 500);
            showToast('PDF siap dicetak', false);
        } else {
            showToast('Popup diblokir! Silakan izinkan popup.', true);
        }
    } catch(e) {
        showToast('Gagal cetak PDF: ' + e.message, true);
    }
}
