// =====================================================
// ADMIN SCRIPT - VERSI LENGKAP DENGAN SEMUA FITUR
// =====================================================

// ==================== DEKLARASI GLOBAL ====================
var daftarSampah = [];
var currentFilter = 'all';
var currentType = 'nonorganik';
var currentFilterRW = 'all';
var currentFilterRT = 'all';
var currentFilterBSU = 'all';
var currentStatFilterRW = 'all';
var currentStatFilterRT = 'all';
var currentStatFilterBSU = 'all';
var currentStatFilterJenis = 'all';
var STORAGE_KEY = 'bankSampahData';
var DATA_TAMU_KEY = 'bankSampahTamuData';
var searchQuery = '';
var dateStart = '';
var dateEnd = '';
var selectedBSU = null;
var userRole = '';
var isAdmin = false;

// Chart instances
var jenisSampahChart = null;
var namaSampahChart = null;
var trenChart = null;

// Nama hari dan bulan
var namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// ==================== CEK LOGIN & ROLE ====================
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'menu_login.html';
}

userRole = sessionStorage.getItem('userRole') || 'tamu';
isAdmin = (userRole === 'admin');

// Jika bukan admin (tamu), redirect ke halaman tamu
if (!isAdmin) {
    window.location.href = 'tamu.html';
}

// ==================== FUNGSI GLOBAL ====================
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

function formatTanggalIndo(tanggal) {
    return namaHari[tanggal.getDay()] + ', ' + tanggal.getDate() + ' ' + namaBulan[tanggal.getMonth()] + ' ' + tanggal.getFullYear();
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
    }, 2500);
}

function showConfirm(title, message, onConfirm) {
    var modal = document.getElementById('confirmModal');
    var titleEl = document.getElementById('confirmTitle');
    var messageEl = document.getElementById('confirmMessage');
    var okBtn = document.getElementById('confirmOk');
    var cancelBtn = document.getElementById('confirmCancel');
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    var newOk = okBtn.cloneNode(true);
    var newCancel = cancelBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
    
    newOk.addEventListener('click', function() {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    });
    newCancel.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
}

// ==================== NAVIGASI ====================
// ==================== NAVIGASI ====================
function navigateTo(page) {
    console.log('Navigasi ke:', page);
    
    // DAFTAR SEMUA HALAMAN - TAMBAHKAN bsuPage, nasabahPage, userPage
    var pages = ['dashboardPage', 'kelolaPage', 'statistikPage', 'pengaturanPage', 'aktivitasPage', 'verifikasiPage', 'laporanPage', 'bsuPage', 'nasabahPage', 'userPage'];
    for (var i = 0; i < pages.length; i++) {
        var el = document.getElementById(pages[i]);
        if (el) el.classList.remove('active');
    }
    
    var targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error('Halaman tidak ditemukan:', page + 'Page');
        // Fallback: jika halaman tidak ditemukan, tetap tampilkan dashboard
        var dashboard = document.getElementById('dashboardPage');
        if (dashboard) dashboard.classList.add('active');
        return;
    }
    
    // Update active menu
    var menuItems = document.querySelectorAll('.menu-item, .nav-bot-item');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active');
        if (menuItems[i].getAttribute('data-page') === page) {
            menuItems[i].classList.add('active');
        }
    }
    
    // Update title
    var titles = { 
        dashboard: 'Dashboard', 
        kelola: 'Kelola Sampah', 
        statistik: 'Statistik',
        pengaturan: 'Pengaturan',
        aktivitas: 'Aktivitas',
        verifikasi: 'Verifikasi Data',
        laporan: 'Laporan & Tabungan',
        bsu: 'Manajemen BSU',
        nasabah: 'Manajemen Nasabah',
        user: 'Manajemen User'
    };
    var pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.innerText = titles[page] || page;
    
    // Update breadcrumb
    var breadcrumbText = document.getElementById('breadcrumbText');
    if (breadcrumbText) breadcrumbText.textContent = titles[page] || page;
    
    // FAB visibility
    setTimeout(function() {
        var fab = document.getElementById('fabBtn');
        if (fab) {
            if (page === 'kelola' && isAdmin) fab.classList.add('show');
            else fab.classList.remove('show');
        }
    }, 100);
    
    // Refresh data saat halaman tertentu
    if (page === 'statistik') {
        setTimeout(function() {
            updateStatistikPage();
            updateCharts();
        }, 200);
    }
    
    if (page === 'verifikasi') {
        setTimeout(function() {
            renderVerifikasiTableWithMassal();
            renderVerifikasiHistory();
        }, 200);
    }
    
    if (page === 'bsu') {
        setTimeout(function() {
            renderBSUTable();
        }, 200);
    }
    
    if (page === 'nasabah') {
        setTimeout(function() {
            renderAdminNasabah('', 'all');
        }, 200);
    }
    
    if (page === 'user') {
        setTimeout(function() {
            renderUserTable();
        }, 200);
    }
}

// ==================== DATA BSU ====================
var dataBSU = [
    { nama: "BSU MEDE 1", rw: "RW01", rt: "RT01" },
    { nama: "BSU MEDE 2", rw: "RW01", rt: "RT02" },
    { nama: "BSU MEDE 3", rw: "RW01", rt: "RT03" },
    { nama: "BSU MEDE 4", rw: "RW01", rt: "RT04" },
    { nama: "BSU PELANGI CERIA", rw: "RW02", rt: "RT01" },
    { nama: "BSU PELANGI 2", rw: "RW02", rt: "RT02" },
    { nama: "BSU PELANGI KENANGA", rw: "RW02", rt: "RT03" },
    { nama: "BSU PELANGI BUNDA", rw: "RW02", rt: "RT04" },
    { nama: "BSU RW03 RT01", rw: "RW03", rt: "RT01" },
    { nama: "BSU RW03 RT02", rw: "RW03", rt: "RT02" },
    { nama: "BSU RW03 RT03", rw: "RW03", rt: "RT03" },
    { nama: "BSU FORSILA", rw: "RW04", rt: "RT01" },
    { nama: "BSU BERSERI 04", rw: "RW04", rt: "RT02" },
    { nama: "BSU BINTANG KEJORA 1", rw: "RW05", rt: "RT01" },
    { nama: "BSU BINTANG KEJORA 2", rw: "RW05", rt: "RT02" },
    { nama: "BSU TERANG", rw: "RW06", rt: "RT01" },
    { nama: "BSU RW06 RT02", rw: "RW06", rt: "RT02" },
    { nama: "BSU RW06 RT03", rw: "RW06", rt: "RT03" },
    { nama: "BSU RW06 RT04", rw: "RW06", rt: "RT04" },
    { nama: "BSU RW06 RT05", rw: "RW06", rt: "RT05" },
    { nama: "BSU BERSEMI 0107", rw: "RW07", rt: "RT01" },
    { nama: "BSU BERSEMI 07", rw: "RW07", rt: "RT02" },
    { nama: "BSU RW07 RT03", rw: "RW07", rt: "RT03" },
    { nama: "BSU RW07 RT04", rw: "RW07", rt: "RT04" },
    { nama: "BSU RW07 RT05", rw: "RW07", rt: "RT05" },
    { nama: "BSU MENTARI 01", rw: "RW08", rt: "RT01" },
    { nama: "BSU MENTARI", rw: "RW08", rt: "RT02" },
    { nama: "BSU KP KIDOEL", rw: "RW09", rt: "all" },
    { nama: "BSU MAWARGA", rw: "RW10", rt: "RT01" },
    { nama: "BSU SRIKANDI", rw: "RW10", rt: "RT02" },
    { nama: "BSU RW10 RT03", rw: "RW10", rt: "RT03" },
    { nama: "BSU RW11 RT01", rw: "RW11", rt: "RT01" },
    { nama: "BSU ZALAK 2", rw: "RW11", rt: "RT02" },
    { nama: "BSU RW11 RT03", rw: "RW11", rt: "RT03" },
    { nama: "BSU RW12 RT01", rw: "RW12", rt: "RT01" },
    { nama: "BSU RW12 RT02", rw: "RW12", rt: "RT02" },
    { nama: "BSU RW12 RT03", rw: "RW12", rt: "RT03" },
    { nama: "BSU CEMERLANG 1", rw: "RW13", rt: "RT01" },
    { nama: "BSU CEMERLANG 2", rw: "RW13", rt: "RT02" },
    { nama: "BSU CEMERLANG 3", rw: "RW13", rt: "RT03" },
    { nama: "BSU RW14 RT01", rw: "RW14", rt: "RT01" },
    { nama: "BSU RW14 RT02", rw: "RW14", rt: "RT02" },
    { nama: "BSU RW14 RT03", rw: "RW14", rt: "RT03" }
];

var dataBSUWithKetua = [
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

// ==================== DATA PRESET SAMPAH DAN HARGA ====================
var presetSampah = {
    plastik: [
        "Pet A - Botol TANPA tutup dan label + Galon Le Mineral",
        "Pet B - Masih berlabel dan tutup",
        "Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)",
        "Botol Plastik Campuran Semua Warna dan Bentuk",
        "Botol Warna MILKU dan NUTRIBOOST",
        "Gelas A - Gelas plastik kemasan bening TANPA SABLON DAN LABEL",
        "Gelas B - Warna jernih DENGAN SABLON DAN LABEL",
        "Gelas Warna (Mountea, Tea Gelas, Ale2)",
        "Emberan - Semua plastik lunak YANG BUKAN HITAM",
        "Kresek / Assoy",
        "Plastik Bening Polos PP/PE",
        "Sedotan Plastik Aqua",
        "Sedotan Plastik Putih Susu",
        "Sedotan Plastik Warna Campur",
        "Sedotan Plastik Hitam",
        "Tutup Botol Plastik / HDPE",
        "Tutup Galon Aqua Plastik / LDPE",
        "Tutup Galon Isi Ulang",
        "Galon AQUA / OASIS UTUH",
        "Galon AQUA / OASIS PECAH BELAH",
        "Paralon / PVC",
        "PP Crystal Bening Transparan / Toples Nastar",
        "Slopan (kantong minyak goreng, kemasan sunlight)",
        "Kaset CD / VCD",
        "Kemasan / Tetrapak / Mika",
        "Boncos (karung bekas, tali rapiah plastik)",
        "Naso (Jerigen/Cuka, Botol Minuman Susu)",
        "Impact - Plastik keras tidak lunak (Yakult, Helm, Body Motor)",
        "HDPE (Botol shampo, pewangi pakaian, pembersih lantai)",
        "Emberan Hitam - Semua plastik lunak hitam",
        "PP Inject - Plastik keras fleksible, kuat, tidak jernih",
        "Nilek / Selang air, kabel utuh / kulit kabel"
    ],
    logam: [
        "Alumunium",
        "Besi A (besi cor-coran, padat, tebal)",
        "Besi Campur / Baja Ringan, sepeda rusak, paku",
        "Rongsok Campur (alumunium panci, softdrink, siku)",
        "Kaleng",
        "Kawat / Seng",
        "Tembaga Merah / kupas berisi padat tebal",
        "Tembaga Bakar",
        "Babet - Bekas onderdil, sperpart, besi berlapis chrome",
        "Kuningan / logam campuran berwarna kuningan kemerahan",
        "Kabin / Enamel / Besi lapis cat / Crom Warna / CPU komputer"
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

var hargaSampahDetail = {
    "Pet A - Botol TANPA tutup dan label + Galon Le Mineral": 3500,
    "Pet B - Masih berlabel dan tutup": 2000,
    "Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)": 1000,
    "Botol Plastik Campuran Semua Warna dan Bentuk": 1500,
    "Botol Warna MILKU dan NUTRIBOOST": 500,
    "Gelas A - Gelas plastik kemasan bening TANPA SABLON DAN LABEL": 3000,
    "Gelas B - Warna jernih DENGAN SABLON DAN LABEL": 1500,
    "Gelas Warna (Mountea, Tea Gelas, Ale2)": 2000,
    "Emberan - Semua plastik lunak YANG BUKAN HITAM": 1500,
    "Kresek / Assoy": 500,
    "Plastik Bening Polos PP/PE": 1000,
    "Sedotan Plastik Aqua": 1200,
    "Sedotan Plastik Putih Susu": 1200,
    "Sedotan Plastik Warna Campur": 800,
    "Sedotan Plastik Hitam": 1000,
    "Tutup Botol Plastik / HDPE": 2500,
    "Tutup Galon Aqua Plastik / LDPE": 3000,
    "Tutup Galon Isi Ulang": 2500,
    "Galon AQUA / OASIS UTUH": 2500,
    "Galon AQUA / OASIS PECAH BELAH": 1000,
    "Paralon / PVC": 1200,
    "PP Crystal Bening Transparan / Toples Nastar": 2000,
    "Slopan (kantong minyak goreng, kemasan sunlight)": 300,
    "Kaset CD / VCD": 2000,
    "Kemasan / Tetrapak / Mika": 100,
    "Boncos (karung bekas, tali rapiah plastik)": 500,
    "Naso (Jerigen/Cuka, Botol Minuman Susu)": 2500,
    "Impact - Plastik keras tidak lunak (Yakult, Helm, Body Motor)": 800,
    "HDPE (Botol shampo, pewangi pakaian, pembersih lantai)": 1900,
    "Emberan Hitam - Semua plastik lunak hitam": 1000,
    "PP Inject - Plastik keras fleksible, kuat, tidak jernih": 2500,
    "Nilek / Selang air, kabel utuh / kulit kabel": 2000,
    "Alumunium": 10000,
    "Besi A (besi cor-coran, padat, tebal)": 4000,
    "Besi Campur / Baja Ringan, sepeda rusak, paku": 2500,
    "Rongsok Campur (alumunium panci, softdrink, siku)": 6000,
    "Kaleng": 2000,
    "Kawat / Seng": 1500,
    "Tembaga Merah / kupas berisi padat tebal": 65000,
    "Tembaga Bakar": 55000,
    "Babet - Bekas onderdil, sperpart, besi berlapis chrome": 5000,
    "Kuningan / logam campuran berwarna kuningan kemerahan": 30000,
    "Kabin / Enamel / Besi lapis cat / Crom Warna / CPU komputer": 2000,
    "Kertas Koran B / Lecek tidak utuh": 100,
    "Kertas Putih / HVS bertinta hitam": 1500,
    "Kertas Semen": 1400,
    "Kertas Warna / HVS warna, tinta warna, Crayon": 800,
    "Kertas Campur / Semua kertas KECUALI KERTAS NASI": 800,
    "Kardus": 1600,
    "Duplex": 800,
    "Kornes (Gulungan Kain)": 800
};

var defaultHargaPerKategori = {
    plastik: 2000,
    logam: 5000,
    kertas: 1000
};

function getHargaByNamaSampah(namaSampah) {
    if (hargaSampahDetail[namaSampah]) {
        return hargaSampahDetail[namaSampah];
    }
    
    var namaLower = namaSampah.toLowerCase();
    for (var key in hargaSampahDetail) {
        if (namaLower.includes(key.toLowerCase()) || key.toLowerCase().includes(namaLower)) {
            return hargaSampahDetail[key];
        }
    }
    
    var plastikKeywords = ["botol", "plastik", "gelas", "kresek", "sedotan", "tutup", "galon", "paralon", "pp", "hdpe", "ldpe", "slopan", "kaset", "tetrapak", "boncos", "naso", "impact", "nilek", "emberan"];
    var logamKeywords = ["alumunium", "besi", "tembaga", "kuningan", "babet", "kabin", "enamel", "kawat", "seng", "kaleng", "logam"];
    var kertasKeywords = ["kertas", "koran", "hvs", "semen", "kardus", "duplex", "kornes", "kain"];
    
    for (var i = 0; i < plastikKeywords.length; i++) {
        if (namaLower.includes(plastikKeywords[i])) {
            return defaultHargaPerKategori.plastik;
        }
    }
    for (var i = 0; i < logamKeywords.length; i++) {
        if (namaLower.includes(logamKeywords[i])) {
            return defaultHargaPerKategori.logam;
        }
    }
    for (var i = 0; i < kertasKeywords.length; i++) {
        if (namaLower.includes(kertasKeywords[i])) {
            return defaultHargaPerKategori.kertas;
        }
    }
    
    return 2000;
}

// ==================== FILTER FUNCTIONS ====================
function filterDataByFilters(data, bsu, rw, rt) {
    var filtered = data.slice();
    if (bsu && bsu !== 'all') {
        filtered = filtered.filter(function(item) { return item.bsu === bsu; });
    }
    if (rw && rw !== 'all') {
        filtered = filtered.filter(function(item) { return item.rw === rw; });
    }
    if (rt && rt !== 'all') {
        filtered = filtered.filter(function(item) { return item.rt === rt; });
    }
    return filtered;
}

function filterDataWithSearch(data, query) {
    if (!query || query.trim() === '') return data;
    var q = query.toLowerCase().trim();
    return data.filter(function(item) {
        return (item.nama && item.nama.toLowerCase().includes(q)) ||
               (item.bsu && item.bsu && item.bsu.toLowerCase().includes(q)) ||
               (item.rw && item.rw.toLowerCase().includes(q)) ||
               (item.rt && item.rt.toLowerCase().includes(q)) ||
               (item.jenis && item.jenis.toLowerCase().includes(q));
    });
}

function filterDataWithDate(data, start, end) {
    if (!start && !end) return data;
    return data.filter(function(item) {
        if (!item.tanggal) return true;
        var itemDate = new Date(item.tanggal);
        if (start && new Date(start) > itemDate) return false;
        if (end) {
            var endDate = new Date(end);
            endDate.setHours(23, 59, 59);
            if (endDate < itemDate) return false;
        }
        return true;
    });
}

// ==================== LOCAL STORAGE FUNCTIONS ====================
function loadDataFromLocal() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        daftarSampah = JSON.parse(stored);
        for (var i = 0; i < daftarSampah.length; i++) {
            if (!daftarSampah[i].bsu) {
                daftarSampah[i].bsu = null;
            }
        }
        saveDataToLocal();
    } else {
        daftarSampah = [
            { id: Date.now() + 1, rw: "RW01", rt: "RT01", nama: "Pet A - Botol TANPA tutup dan label + Galon Le Mineral", jenis: "nonorganik", berat: 12.5, hargaPerKg: 3500, tanggal: new Date().toISOString(), bsu: "BSU MEDE 1" },
            { id: Date.now() + 2, rw: "RW01", rt: "RT02", nama: "Kardus", jenis: "nonorganik", berat: 8.2, hargaPerKg: 1600, tanggal: new Date().toISOString(), bsu: "BSU MEDE 2" },
            { id: Date.now() + 3, rw: "RW02", rt: "RT01", nama: "Alumunium", jenis: "nonorganik", berat: 5.0, hargaPerKg: 10000, tanggal: new Date().toISOString(), bsu: "BSU PELANGI CERIA" },
            { id: Date.now() + 4, rw: "RW02", rt: "RT03", nama: "Botol Plastik Campuran Semua Warna dan Bentuk", jenis: "nonorganik", berat: 7.3, hargaPerKg: 1500, tanggal: new Date().toISOString(), bsu: "BSU PELANGI KENANGA" },
            { id: Date.now() + 5, rw: "RW03", rt: "RT02", nama: "Kertas Koran B / Lecek tidak utuh", jenis: "nonorganik", berat: 3.2, hargaPerKg: 100, tanggal: new Date().toISOString(), bsu: null }
        ];
        saveDataToLocal();
    }
    refreshAll();
    populateBSUFilters();
    updateCharts();
    applyRoleBasedUI();
    updateDataCount();
}

function saveDataToLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarSampah));
    updateDataCount();
}

function populateBSUFilters() {
    var bsuNames = [];
    for (var i = 0; i < dataBSU.length; i++) {
        bsuNames.push(dataBSU[i].nama);
    }
    
    var filterBSU = document.getElementById('filterBSU');
    var statFilterBSU = document.getElementById('statFilterBSU');
    var jenisChartBSU = document.getElementById('jenisChartBSUFilter');
    var namaChartBSU = document.getElementById('namaChartBSUFilter');
    var laporanBSUFilter = document.getElementById('laporanBSUFilter');
    var laporanBSUFilter2 = document.getElementById('laporanBSUFilter2');
    var tabunganBSUFilter = document.getElementById('tabunganBSUFilter');
    var tabunganBSUFilter2 = document.getElementById('tabunganBSUFilter2');
    
    var optionHTML = '<option value="all">Semua BSU</option>';
    for (var j = 0; j < bsuNames.length; j++) {
        optionHTML += '<option value="' + bsuNames[j] + '">' + bsuNames[j] + '</option>';
    }
    
    if (filterBSU) filterBSU.innerHTML = optionHTML;
    if (statFilterBSU) statFilterBSU.innerHTML = optionHTML;
    if (jenisChartBSU) jenisChartBSU.innerHTML = optionHTML;
    if (namaChartBSU) namaChartBSU.innerHTML = optionHTML;
    if (laporanBSUFilter) laporanBSUFilter.innerHTML = optionHTML;
    if (laporanBSUFilter2) laporanBSUFilter2.innerHTML = optionHTML;
    if (tabunganBSUFilter) tabunganBSUFilter.innerHTML = optionHTML;
    if (tabunganBSUFilter2) tabunganBSUFilter2.innerHTML = optionHTML;
}

// ==================== UPDATE FUNCTIONS ====================
function updateDataCount() {
    var totalDataCount = document.getElementById('totalDataCount');
    if (totalDataCount) {
        totalDataCount.textContent = 'Total: ' + daftarSampah.length + ' data';
    }
}

function updateStats() {
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    var totalOrganik = 0, totalNonorganik = 0;
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        if (item.jenis === 'organik') {
            totalOrganik += item.berat;
        } else {
            totalNonorganik += item.berat;
        }
    }
    
    var totalSemua = totalOrganik + totalNonorganik;
    var organikPercent = totalSemua > 0 ? (totalOrganik / totalSemua) * 100 : 0;
    
    var totalOrganikEl = document.getElementById('totalOrganik');
    var totalNonorganikEl = document.getElementById('totalNonorganik');
    var totalSemuaEl = document.getElementById('totalSemua');
    
    if (totalOrganikEl) totalOrganikEl.innerText = totalOrganik.toFixed(2);
    if (totalNonorganikEl) totalNonorganikEl.innerText = totalNonorganik.toFixed(2);
    if (totalSemuaEl) totalSemuaEl.innerText = totalSemua.toFixed(2);
    
    var progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars[0]) progressBars[0].style.width = organikPercent + '%';
    if (progressBars[1]) progressBars[1].style.width = (100 - organikPercent) + '%';
    
    renderRTandRWTable();
    updateSummaryCards();
    updateRanking();
    updateAdvancedMetrics();
    updateTrenChart();
    updateWilayahVisualization();
    getNearestBSU();
    updateTamuDashboard();
}

function updateSummaryCards() {
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
    var totalOrganik = 0, totalNonorganik = 0;
    for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].jenis === 'organik') totalOrganik += filteredData[i].berat;
        else totalNonorganik += filteredData[i].berat;
    }
    var totalSemua = totalOrganik + totalNonorganik;
    var totalItems = filteredData.length;
    
    var summaryOrganik = document.getElementById('summaryOrganik');
    var summaryNonorganik = document.getElementById('summaryNonorganik');
    var summaryTotal = document.getElementById('summaryTotal');
    var summaryTransaksi = document.getElementById('summaryTransaksi');
    
    if (summaryOrganik) summaryOrganik.textContent = totalOrganik.toFixed(2) + ' kg';
    if (summaryNonorganik) summaryNonorganik.textContent = totalNonorganik.toFixed(2) + ' kg';
    if (summaryTotal) summaryTotal.textContent = totalSemua.toFixed(2) + ' kg';
    if (summaryTransaksi) summaryTransaksi.textContent = totalItems;
}

function updateAdvancedMetrics() {
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
    var totalNilai = 0;
    for (var i = 0; i < filteredData.length; i++) {
        totalNilai += (filteredData[i].berat * filteredData[i].hargaPerKg);
    }
    
    var uniqueDays = new Set();
    for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].tanggal) {
            var date = new Date(filteredData[i].tanggal).toDateString();
            uniqueDays.add(date);
        }
    }
    var totalHari = uniqueDays.size || 1;
    var rataTransaksiPerHari = (filteredData.length / totalHari).toFixed(1);
    
    var bsuPerformance = {};
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        var bsu = item.bsu || 'Tanpa BSU';
        if (!bsuPerformance[bsu]) {
            bsuPerformance[bsu] = { berat: 0, nilai: 0, count: 0 };
        }
        bsuPerformance[bsu].berat += item.berat;
        bsuPerformance[bsu].nilai += (item.berat * item.hargaPerKg);
        bsuPerformance[bsu].count++;
    }
    
    var bestBSU = null;
    var bestValue = 0;
    for (var bsu in bsuPerformance) {
        if (bsuPerformance[bsu].nilai > bestValue) {
            bestValue = bsuPerformance[bsu].nilai;
            bestBSU = bsu;
        }
    }
    
    var totalNilaiEl = document.getElementById('totalNilaiKeseluruhan');
    if (totalNilaiEl) totalNilaiEl.innerText = 'Rp ' + totalNilai.toLocaleString();
    
    var rataTransaksiEl = document.getElementById('rataTransaksiHari');
    if (rataTransaksiEl) rataTransaksiEl.innerText = rataTransaksiPerHari + ' transaksi/hari';
    
    var bestBSUEl = document.getElementById('bsuTerbaik');
    if (bestBSUEl && bestBSU) {
        bestBSUEl.innerText = bestBSU + ' (Rp ' + bestValue.toLocaleString() + ')';
    }
}

function updateRanking() {
    var containerRW = document.getElementById('rankingRWList');
    var containerRT = document.getElementById('rankingRTList');
    if (!containerRW || !containerRT) return;
    
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
    var rwMap = {};
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        if (!rwMap[item.rw]) rwMap[item.rw] = 0;
        rwMap[item.rw] += item.berat;
    }
    
    var rwSorted = Object.keys(rwMap).sort(function(a, b) { return rwMap[b] - rwMap[a]; });
    
    var rwHtml = '';
    if (rwSorted.length === 0) {
        rwHtml = '<div style="text-align:center;color:var(--text-muted);padding:10px;">Belum ada data</div>';
    } else {
        for (var i = 0; i < Math.min(rwSorted.length, 10); i++) {
            var rw = rwSorted[i];
            var medal = '';
            var rankClass = 'normal';
            if (i === 0) { medal = '🥇'; rankClass = 'gold'; }
            else if (i === 1) { medal = '🥈'; rankClass = 'silver'; }
            else if (i === 2) { medal = '🥉'; rankClass = 'bronze'; }
            
            rwHtml += '<div class="ranking-item">' +
                '<div class="rank-number ' + rankClass + '">' + (i + 1) + '</div>' +
                '<span class="rank-medal">' + medal + '</span>' +
                '<span class="rank-name">' + rw + '</span>' +
                '<span class="rank-value">' + rwMap[rw].toFixed(2) + ' kg</span>' +
                '</div>';
        }
    }
    containerRW.innerHTML = rwHtml;
    
    var rtMap = {};
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        var key = item.rw + ' - ' + item.rt;
        if (!rtMap[key]) rtMap[key] = 0;
        rtMap[key] += item.berat;
    }
    
    var rtSorted = Object.keys(rtMap).sort(function(a, b) { return rtMap[b] - rtMap[a]; });
    
    var rtHtml = '';
    if (rtSorted.length === 0) {
        rtHtml = '<div style="text-align:center;color:var(--text-muted);padding:10px;">Belum ada data</div>';
    } else {
        for (var i = 0; i < Math.min(rtSorted.length, 10); i++) {
            var rt = rtSorted[i];
            var medal = '';
            var rankClass = 'normal';
            if (i === 0) { medal = '🥇'; rankClass = 'gold'; }
            else if (i === 1) { medal = '🥈'; rankClass = 'silver'; }
            else if (i === 2) { medal = '🥉'; rankClass = 'bronze'; }
            
            rtHtml += '<div class="ranking-item">' +
                '<div class="rank-number ' + rankClass + '">' + (i + 1) + '</div>' +
                '<span class="rank-medal">' + medal + '</span>' +
                '<span class="rank-name">' + rt + '</span>' +
                '<span class="rank-value">' + rtMap[rt].toFixed(2) + ' kg</span>' +
                '</div>';
        }
    }
    containerRT.innerHTML = rtHtml;
}

function updateWilayahVisualization() {
    var container = document.getElementById('wilayahVisualisasi');
    if (!container) return;
    
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
    var rwMap = {};
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        if (!rwMap[item.rw]) rwMap[item.rw] = 0;
        rwMap[item.rw] += item.berat;
    }
    
    var maxValue = 0;
    for (var rw in rwMap) {
        if (rwMap[rw] > maxValue) maxValue = rwMap[rw];
    }
    maxValue = maxValue || 1;
    
    var rwList = ['RW01', 'RW02', 'RW03', 'RW04', 'RW05', 'RW06', 'RW07', 'RW08', 'RW09', 'RW10', 'RW11', 'RW12', 'RW13', 'RW14'];
    
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:8px;">';
    
    for (var i = 0; i < rwList.length; i++) {
        var rw = rwList[i];
        var value = rwMap[rw] || 0;
        var percent = (value / maxValue) * 100;
        var opacity = value > 0 ? Math.max(0.2, percent / 100) : 0.3;
        
        html += '<div style="text-align:center;padding:6px;border-radius:8px;background:rgba(46,125,50,' + opacity + ');border:1px solid ' + (value > 0 ? '#2e7d32' : '#e0e0e0') + ';">' +
            '<div style="font-size:0.7rem;font-weight:bold;color:#1a3a2a;">' + rw + '</div>' +
            '<div style="font-size:0.8rem;font-weight:700;color:#2e7d32;">' + (value > 0 ? value.toFixed(1) + 'kg' : '-') + '</div>' +
            '</div>';
    }
    
    html += '</div>' +
        '<div style="margin-top:8px;font-size:0.65rem;color:var(--text-muted);text-align:center;">' +
        'Warna lebih gelap = volume sampah lebih tinggi' +
        '</div>';
    
    container.innerHTML = html;
}

function getNearestBSU() {
    var rw = currentFilterRW !== 'all' ? currentFilterRW : 'RW01';
    var rt = currentFilterRT !== 'all' ? currentFilterRT : 'RT01';
    
    var nearest = null;
    for (var i = 0; i < dataBSU.length; i++) {
        if (dataBSU[i].rw === rw && (dataBSU[i].rt === rt || dataBSU[i].rt === 'all')) {
            nearest = dataBSU[i];
            break;
        }
    }
    
    if (!nearest) {
        for (var i = 0; i < dataBSU.length; i++) {
            if (dataBSU[i].rw === rw) {
                nearest = dataBSU[i];
                break;
            }
        }
    }
    
    if (!nearest && dataBSU.length > 0) {
        nearest = dataBSU[0];
    }
    
    var container = document.getElementById('bsuTerdekat');
    if (container) {
        if (nearest) {
            container.innerHTML = '📍 <strong>' + nearest.nama + '</strong><br>' +
                nearest.rw + ' - ' + (nearest.rt === 'all' ? 'Semua RT' : nearest.rt);
        } else {
            container.innerHTML = '📍 BSU tidak ditemukan';
        }
    }
}

function updateTamuDashboard() {
    if (isAdmin) return;
    
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
    var userRT = sessionStorage.getItem('userRT') || '';
    var userRW = sessionStorage.getItem('userRW') || '';
    
    if (userRT || userRW) {
        var wilayahData = daftarSampah.filter(function(item) {
            if (userRW && item.rw !== userRW) return false;
            if (userRT && item.rt !== userRT) return false;
            return true;
        });
        
        var totalWilayah = 0;
        for (var i = 0; i < wilayahData.length; i++) {
            totalWilayah += wilayahData[i].berat;
        }
        
        var tamuStatsEl = document.getElementById('tamuStatsWilayah');
        if (tamuStatsEl) {
            tamuStatsEl.innerHTML = '📊 Wilayah Anda: ' + (userRW || '-') + ' ' + (userRT || '-') + 
                '<br>Total Sampah: ' + totalWilayah.toFixed(2) + ' kg' +
                '<br>Transaksi: ' + wilayahData.length + ' item';
        }
    }
}

// ==================== RENDER FUNCTIONS ====================
function renderRTandRWTable() {
    var container = document.getElementById('rtRwTableBody');
    if (!container) return;
    
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
    if (filteredData.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align: center;">Tidak ada data</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        html += '<tr>' +
            '<td>' + (item.bsu ? escapeHtml(item.bsu) : '-') + '</td>' +
            '<td>' + item.rw + '</td>' +
            '<td>' + item.rt + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + (item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</td>' +
            '<td>' + item.berat.toFixed(2) + '</td>' +
            '<td>Rp ' + (item.berat * item.hargaPerKg).toLocaleString() + '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
    updateDataCount();
}

function renderDataList() {
    var container = document.getElementById('sampahList');
    if (!container) return;
    
    var filteredData = daftarSampah.slice();
    
    if (currentFilter !== 'all') {
        filteredData = filteredData.filter(function(item) { 
            return item.jenis === currentFilter; 
        });
    }
    
    filteredData = filterDataWithSearch(filteredData, searchQuery);
    filteredData = filterDataWithDate(filteredData, dateStart, dateEnd);
    
    if (filteredData.length === 0) {
        var msg = 'Tidak ada data';
        if (searchQuery) msg += ' untuk "' + searchQuery + '"';
        if (dateStart || dateEnd) msg += ' dengan filter tanggal';
        container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h4>' + msg + '</h4></div>';
        updateDataCount();
        return;
    }
    
    var html = '';
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        
        var actionButtons = '';
        if (isAdmin) {
            actionButtons = '<div class="data-actions">' +
                '<button class="edit-data" onclick="editSampah(' + item.id + ')"><i class="fas fa-edit"></i></button>' +
                '<button class="delete-data" onclick="deleteSampah(' + item.id + ')"><i class="fas fa-trash-alt"></i></button>' +
                '</div>';
        }
        
        var displayNama = escapeHtml(item.nama);
        if (searchQuery) {
            var regex = new RegExp('(' + searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            displayNama = escapeHtml(item.nama).replace(regex, '<span class="highlight">$1</span>');
        }
        
        html += '<div class="data-item">' +
            '<div class="data-info">' +
            '<div class="data-number">' + (i + 1) + '</div>' +
            '<div><strong>' + (item.bsu ? escapeHtml(item.bsu) : '-') + '</strong></div>' +
            '<div><small>' + item.rw + ' - ' + item.rt + '</small></div>' +
            '<div class="data-name">' + displayNama + '</div>' +
            '<span>' + (item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</span>' +
            '<div class="data-weight">' + item.berat.toFixed(2) + ' kg</div>' +
            '<div class="data-price">Rp ' + item.hargaPerKg.toLocaleString() + '/kg</div>' +
            '<div class="data-total">Rp ' + (item.berat * item.hargaPerKg).toLocaleString() + '</div>' +
            '</div>' +
            actionButtons +
            '</div>';
    }
    container.innerHTML = html;
    updateDataCount();
}

// ==================== BSU FUNCTIONS ====================
function renderBSUList(searchTerm) {
    searchTerm = searchTerm || '';
    var container = document.getElementById('bsuList');
    if (!container) return;
    
    var filteredBSU = dataBSU.slice();
    if (searchTerm) {
        var term = searchTerm.toLowerCase();
        filteredBSU = filteredBSU.filter(function(bsu) {
            return bsu.nama.toLowerCase().includes(term);
        });
    }
    
    if (filteredBSU.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Tidak ada BSU ditemukan</div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < filteredBSU.length; i++) {
        var bsu = filteredBSU[i];
        var locationText = bsu.rt === 'all' ? bsu.rw + ' (Semua RT)' : bsu.rw + ' - ' + bsu.rt;
        var isSelected = selectedBSU && selectedBSU.nama === bsu.nama && selectedBSU.rw === bsu.rw;
        html += '<div class="bsu-item ' + (isSelected ? 'selected' : '') + '" data-nama="' + bsu.nama + '" data-rw="' + bsu.rw + '" data-rt="' + bsu.rt + '">' +
                    '<div>' +
                        '<div class="bsu-name">' + escapeHtml(bsu.nama) + '</div>' +
                        '<div class="bsu-location">' + locationText + '</div>' +
                    '</div>' +
                    '<div class="bsu-badge">RW ' + bsu.rw.replace('RW', '') + '</div>' +
                '</div>';
    }
    container.innerHTML = html;
    
    var bsuItems = container.querySelectorAll('.bsu-item');
    for (var i = 0; i < bsuItems.length; i++) {
        bsuItems[i].addEventListener('click', function() {
            var nama = this.getAttribute('data-nama');
            var rw = this.getAttribute('data-rw');
            var rt = this.getAttribute('data-rt');
            selectBSU({ nama: nama, rw: rw, rt: rt });
        });
    }
}

function selectBSU(bsu) {
    selectedBSU = bsu;
    
    var inputRW = document.getElementById('inputRW');
    var inputRT = document.getElementById('inputRT');
    
    if (inputRW && bsu.rw) {
        for (var i = 0; i < inputRW.options.length; i++) {
            if (inputRW.options[i].value === bsu.rw) {
                inputRW.selectedIndex = i;
                break;
            }
        }
    }
    
    if (inputRT && bsu.rt && bsu.rt !== 'all') {
        for (var i = 0; i < inputRT.options.length; i++) {
            if (inputRT.options[i].value === bsu.rt) {
                inputRT.selectedIndex = i;
                break;
            }
        }
    }
    
    var selectedDisplay = document.getElementById('selectedBsuDisplay');
    var selectedBsuName = document.getElementById('selectedBsuName');
    var selectedBsuLocation = document.getElementById('selectedBsuLocation');
    var currentBsuInfo = document.getElementById('currentBsuInfo');
    var currentBsuText = document.getElementById('currentBsuText');
    
    if (selectedDisplay) {
        selectedDisplay.style.display = 'flex';
        if (selectedBsuName) selectedBsuName.innerText = bsu.nama;
        if (selectedBsuLocation) selectedBsuLocation.innerText = bsu.rw + ' - ' + (bsu.rt === 'all' ? 'Semua RT' : bsu.rt);
    }
    
    if (currentBsuInfo) {
        currentBsuInfo.style.display = 'flex';
        if (currentBsuText) currentBsuText.innerText = bsu.nama + ' (' + bsu.rw + ' - ' + (bsu.rt === 'all' ? 'Semua RT' : bsu.rt) + ')';
    }
    
    var searchInput = document.getElementById('bsuSearchInput');
    renderBSUList(searchInput ? searchInput.value : '');
    
    showToast('BSU ' + bsu.nama + ' dipilih', false);
}

function clearSelectedBSU() {
    selectedBSU = null;
    
    var selectedDisplay = document.getElementById('selectedBsuDisplay');
    var currentBsuInfo = document.getElementById('currentBsuInfo');
    
    if (selectedDisplay) selectedDisplay.style.display = 'none';
    if (currentBsuInfo) currentBsuInfo.style.display = 'none';
    
    var searchInput = document.getElementById('bsuSearchInput');
    renderBSUList(searchInput ? searchInput.value : '');
    
    showToast('BSU dibatalkan', false);
}

// ==================== FUNGSI UNTUK TAMU ====================

function loadTamuDataFromLocal() {
    var stored = localStorage.getItem(DATA_TAMU_KEY);
    if (stored) {
        dataTamuMenunggu = JSON.parse(stored);
    } else {
        dataTamuMenunggu = [];
        saveTamuDataToLocal();
    }
    renderTamuDataList();
    updateVerifikasiCard();
    renderVerifikasiTable();
    renderVerifikasiHistory();
}

function saveTamuDataToLocal() {
    localStorage.setItem(DATA_TAMU_KEY, JSON.stringify(dataTamuMenunggu));
}

function setUserBSUForTamu() {
    var userRT = sessionStorage.getItem('userRT') || '';
    var userRW = sessionStorage.getItem('userRW') || '';
    var userBSU = sessionStorage.getItem('userBSU') || '';
    var userName = sessionStorage.getItem('username') || 'Tamu';
    
    if (userBSU) {
        currentUserBSU = userBSU;
        currentUserRW = userRW || 'RW01';
        currentUserRT = userRT || 'RT01';
        currentUserName = userName;
        return;
    }
    
    if (userRT || userRW) {
        for (var i = 0; i < dataBSUWithKetua.length; i++) {
            var bsu = dataBSUWithKetua[i];
            if (bsu.rw === userRW && (bsu.rt === userRT || bsu.rt === 'all')) {
                currentUserBSU = bsu.nama;
                currentUserRW = bsu.rw;
                currentUserRT = bsu.rt;
                currentUserName = userName;
                sessionStorage.setItem('userBSU', bsu.nama);
                sessionStorage.setItem('userRW', bsu.rw);
                sessionStorage.setItem('userRT', bsu.rt);
                return;
            }
        }
        for (var i = 0; i < dataBSUWithKetua.length; i++) {
            if (dataBSUWithKetua[i].rw === userRW) {
                currentUserBSU = dataBSUWithKetua[i].nama;
                currentUserRW = dataBSUWithKetua[i].rw;
                currentUserRT = dataBSUWithKetua[i].rt;
                currentUserName = userName;
                sessionStorage.setItem('userBSU', dataBSUWithKetua[i].nama);
                sessionStorage.setItem('userRW', dataBSUWithKetua[i].rw);
                sessionStorage.setItem('userRT', dataBSUWithKetua[i].rt);
                return;
            }
        }
    }
    
    if (dataBSUWithKetua.length > 0) {
        currentUserBSU = dataBSUWithKetua[0].nama;
        currentUserRW = dataBSUWithKetua[0].rw;
        currentUserRT = dataBSUWithKetua[0].rt;
        currentUserName = userName;
    }
}

var dataTamuMenunggu = [];
var currentUserBSU = '';
var currentUserRW = '';
var currentUserRT = '';
var currentUserName = '';

window.tambahDataTamu = function() {
    var namaNasabah = document.getElementById('tamuNamaNasabah').value;
    var namaSampah = document.getElementById('tamuNamaSampah').value;
    var berat = parseFloat(document.getElementById('tamuBeratSampah').value);
    var bsu = document.getElementById('tamuBSU').value;
    var ketua = document.getElementById('tamuKetuaBSU').value;
    var tanggal = document.getElementById('tamuTanggal').value;
    var rwrt = document.getElementById('tamuRWRT').value;
    
    var fotoTimbang = document.getElementById('previewFotoTimbang').querySelector('img');
    var fotoHasil = document.getElementById('previewFotoHasil').querySelector('img');
    
    if (!namaNasabah.trim()) {
        showToast('Nama nasabah wajib diisi!', true);
        return;
    }
    if (!namaSampah.trim()) {
        showToast('Nama sampah wajib diisi!', true);
        return;
    }
    if (berat <= 0 || isNaN(berat)) {
        showToast('Berat harus lebih dari 0 kg!', true);
        return;
    }
    if (!ketua.trim()) {
        showToast('Nama Ketua BSU wajib diisi!', true);
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
    
    var fotoTimbangData = fotoTimbang.src;
    var fotoHasilData = fotoHasil.src;
    
    var rw = 'RW01';
    var rt = 'RT01';
    if (rwrt) {
        var parts = rwrt.split(' - ');
        if (parts.length === 2) {
            rw = parts[0].trim();
            rt = parts[1].trim();
        }
    }
    
    dataTamuMenunggu.push({
        id: Date.now(),
        namaNasabah: namaNasabah.trim(),
        nama: namaSampah.trim(),
        berat: berat,
        bsu: bsu,
        ketua: ketua.trim(),
        rw: rw,
        rt: rt,
        tanggal: tanggal || new Date().toISOString().slice(0,10),
        fotoTimbang: fotoTimbangData,
        fotoHasil: fotoHasilData,
        status: 'pending',
        hargaPerKg: 0,
        verifiedBy: null,
        verifiedAt: null,
        createdAt: new Date().toISOString()
    });
    
    saveTamuDataToLocal();
    renderTamuDataList();
    updateVerifikasiCard();
    renderVerifikasiTable();
    renderVerifikasiHistory();
    
    document.getElementById('tamuNamaNasabah').value = '';
    document.getElementById('tamuNamaSampah').value = '';
    document.getElementById('tamuBeratSampah').value = '1';
    document.getElementById('tamuKetuaBSU').value = '';
    document.getElementById('previewFotoTimbang').innerHTML = '';
    document.getElementById('previewFotoHasil').innerHTML = '';
    
    showToast('Data berhasil dikirim untuk verifikasi!', false);
    logActivity('Tambah Data Tamu', 'Tamu ' + namaNasabah.trim() + ' mengirim data: ' + namaSampah.trim() + ' (' + berat + ' kg) ke BSU ' + bsu);
};

function renderTamuDataList() {
    var container = document.getElementById('tamuDataBody');
    var count = document.getElementById('tamuDataCount');
    if (!container) return;
    
    var pendingData = dataTamuMenunggu.filter(function(item) {
        return item.status === 'pending';
    });
    
    if (count) count.textContent = 'Total: ' + pendingData.length + ' data';
    
    if (pendingData.length === 0) {
        container.innerHTML = '<tr><td colspan="9" style="text-align:center;">Tidak ada data menunggu verifikasi</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < pendingData.length; i++) {
        var item = pendingData[i];
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + escapeHtml(item.namaNasabah || '-') + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + item.berat.toFixed(2) + ' kg</td>' +
            '<td>' + escapeHtml(item.bsu) + '</td>' +
            '<td>' + escapeHtml(item.ketua) + '</td>' +
            '<td>' + item.tanggal + '</td>' +
            '<td><span class="status-badge pending">⏳ Menunggu</span></td>' +
            '<td>' +
                '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
                '<button class="btn-verify" onclick="verifikasiDataTamu(' + item.id + ', \'verified\', null)" style="padding:4px 12px;font-size:0.7rem;background:#2e7d32;color:white;border:none;border-radius:6px;cursor:pointer;">✓</button>' +
                '<button class="btn-reject" onclick="verifikasiDataTamu(' + item.id + ', \'rejected\', null)" style="padding:4px 12px;font-size:0.7rem;background:#ef5350;color:white;border:none;border-radius:6px;cursor:pointer;">✕</button>' +
                '<button class="btn-detail" onclick="lihatDetailTamu(' + item.id + ')" style="padding:4px 12px;font-size:0.7rem;background:#0d6efd;color:white;border:none;border-radius:6px;cursor:pointer;">👁</button>' +
                '</div>' +
            '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

function renderVerifikasiTable() {
    var container = document.getElementById('verifikasiTableBody');
    var count = document.getElementById('verifikasiPageCount');
    if (!container) return;
    
    var pendingData = dataTamuMenunggu.filter(function(item) {
        return item.status === 'pending';
    });
    
    if (count) count.textContent = 'Total: ' + pendingData.length + ' data';
    
    if (pendingData.length === 0) {
        container.innerHTML = '<tr><td colspan="9" style="text-align:center;">Tidak ada data menunggu verifikasi</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < pendingData.length; i++) {
        var item = pendingData[i];
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + escapeHtml(item.namaNasabah || '-') + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + item.berat.toFixed(2) + ' kg</td>' +
            '<td>' + escapeHtml(item.bsu) + '</td>' +
            '<td>' + escapeHtml(item.ketua) + '</td>' +
            '<td>' + item.tanggal + '</td>' +
            '<td>' +
                '<div style="display:flex;gap:4px;">' +
                '<button onclick="lihatDetailTamu(' + item.id + ')" style="padding:2px 8px;font-size:0.6rem;background:#0d6efd;color:white;border:none;border-radius:4px;cursor:pointer;">📷</button>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
                '<button class="btn-verify" onclick="verifikasiDataTamu(' + item.id + ', \'verified\', null)" style="padding:4px 12px;font-size:0.7rem;background:#2e7d32;color:white;border:none;border-radius:6px;cursor:pointer;">✓</button>' +
                '<button class="btn-reject" onclick="verifikasiDataTamu(' + item.id + ', \'rejected\', null)" style="padding:4px 12px;font-size:0.7rem;background:#ef5350;color:white;border:none;border-radius:6px;cursor:pointer;">✕</button>' +
                '<button class="btn-detail" onclick="verifikasiDenganHarga(' + item.id + ')" style="padding:4px 12px;font-size:0.7rem;background:#f9a825;color:white;border:none;border-radius:6px;cursor:pointer;">💰</button>' +
                '</div>' +
            '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

function renderVerifikasiHistory() {
    var container = document.getElementById('verifikasiHistoryBody');
    var count = document.getElementById('verifikasiHistoryCount');
    if (!container) return;
    
    var historyData = dataTamuMenunggu.filter(function(item) {
        return item.status === 'verified' || item.status === 'rejected';
    });
    
    if (count) count.textContent = 'Total: ' + historyData.length + ' data';
    
    if (historyData.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;">Belum ada riwayat verifikasi</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < historyData.length; i++) {
        var item = historyData[i];
        var statusText = item.status === 'verified' ? '✅ Diverifikasi' : '❌ Ditolak';
        var statusClass = item.status === 'verified' ? 'verified' : 'rejected';
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + escapeHtml(item.namaNasabah || '-') + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + item.berat.toFixed(2) + ' kg</td>' +
            '<td>' + escapeHtml(item.bsu) + '</td>' +
            '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
            '<td>' + (item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString('id-ID') : '-') + '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

window.verifikasiDataTamu = function(id, status, hargaPerKg) {
    var item = null;
    var index = -1;
    for (var i = 0; i < dataTamuMenunggu.length; i++) {
        if (dataTamuMenunggu[i].id === id) {
            item = dataTamuMenunggu[i];
            index = i;
            break;
        }
    }
    if (!item) {
        showToast('Data tidak ditemukan!', true);
        return;
    }
    
    if (status === 'verified') {
        if (!hargaPerKg || hargaPerKg <= 0) {
            hargaPerKg = getHargaByNamaSampah(item.nama);
        }
        
        daftarSampah.push({
            id: Date.now(),
            rw: item.rw || 'RW01',
            rt: item.rt || 'RT01',
            nama: item.nama,
            jenis: 'nonorganik',
            berat: item.berat,
            hargaPerKg: hargaPerKg,
            tanggal: item.tanggal,
            bsu: item.bsu,
            verifiedFromTamu: true,
            verifiedTamuId: item.id,        // <-- SIMPAN ID TAMU
            namaNasabah: item.namaNasabah || '', // <-- SIMPAN NAMA NASABAH
            verifiedBy: sessionStorage.getItem('username') || 'Admin'
        });
        
        saveDataToLocal();
        refreshAll();
        
        item.status = 'verified';
        item.hargaPerKg = hargaPerKg;
        item.verifiedBy = sessionStorage.getItem('username') || 'Admin';
        item.verifiedAt = new Date().toISOString();
        
        showToast('Data berhasil diverifikasi dan ditambahkan ke database!', false);
        logActivity('Verifikasi Data Tamu', 'Admin memverifikasi data: ' + item.nama + ' dengan harga Rp ' + hargaPerKg + ' | Nasabah: ' + (item.namaNasabah || '-'));
    } else if (status === 'rejected') {
        item.status = 'rejected';
        item.verifiedBy = sessionStorage.getItem('username') || 'Admin';
        item.verifiedAt = new Date().toISOString();
        showToast('Data ditolak!', false);
        logActivity('Tolak Data Tamu', 'Admin menolak data: ' + item.nama);
    }
    
    saveTamuDataToLocal();
    renderTamuDataList();
    updateVerifikasiCard();
    renderVerifikasiTable();
    renderVerifikasiHistory();
};
window.verifikasiDenganHarga = function(id) {
    var item = null;
    for (var i = 0; i < dataTamuMenunggu.length; i++) {
        if (dataTamuMenunggu[i].id === id) {
            item = dataTamuMenunggu[i];
            break;
        }
    }
    if (!item) {
        showToast('Data tidak ditemukan!', true);
        return;
    }
    
    var defaultHarga = getHargaByNamaSampah(item.nama);
    var harga = prompt('Masukkan harga per kg untuk ' + item.nama + ':', defaultHarga);
    if (harga === null) return;
    
    var hargaNum = parseFloat(harga);
    if (isNaN(hargaNum) || hargaNum <= 0) {
        showToast('Harga tidak valid!', true);
        return;
    }
    
    verifikasiDataTamu(id, 'verified', hargaNum);
};

window.lihatDetailTamu = function(id) {
    var item = null;
    for (var i = 0; i < dataTamuMenunggu.length; i++) {
        if (dataTamuMenunggu[i].id === id) {
            item = dataTamuMenunggu[i];
            break;
        }
    }
    if (!item) {
        showToast('Data tidak ditemukan!', true);
        return;
    }
    
    var modalContent = '<div style="padding:20px;">' +
        '<h3 style="color:var(--primary);margin-bottom:12px;">Detail Data Tamu</h3>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">' +
        '<div><strong>Nama Nasabah:</strong> ' + escapeHtml(item.namaNasabah || '-') + '</div>' +
        '<div><strong>Nama Sampah:</strong> ' + escapeHtml(item.nama) + '</div>' +
        '<div><strong>Berat:</strong> ' + item.berat.toFixed(2) + ' kg</div>' +
        '<div><strong>BSU:</strong> ' + escapeHtml(item.bsu) + '</div>' +
        '<div><strong>Ketua BSU:</strong> ' + escapeHtml(item.ketua) + '</div>' +
        '<div><strong>RW/RT:</strong> ' + (item.rw || '-') + ' - ' + (item.rt || '-') + '</div>' +
        '<div><strong>Tanggal:</strong> ' + item.tanggal + '</div>' +
        '<div><strong>Status:</strong> <span class="status-badge pending">' + item.status + '</span></div>' +
        '</div>' +
        '<div style="margin-bottom:12px;"><strong>Foto Penimbangan:</strong></div>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">' +
        '<div><img src="' + item.fotoTimbang + '" style="width:200px;height:200px;object-fit:cover;border-radius:12px;border:2px solid var(--primary-bg);"></div>' +
        '<div><img src="' + item.fotoHasil + '" style="width:200px;height:200px;object-fit:cover;border-radius:12px;border:2px solid var(--primary-bg);"></div>' +
        '</div>';
    
    if (isAdmin && item.status === 'pending') {
        modalContent += '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
            '<button onclick="verifikasiDataTamu(' + item.id + ', \'verified\', null)" style="padding:10px 24px;background:#2e7d32;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✓ Verifikasi</button>' +
            '<button onclick="verifikasiDenganHarga(' + item.id + ')" style="padding:10px 24px;background:#f9a825;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">💰 Set Harga</button>' +
            '<button onclick="verifikasiDataTamu(' + item.id + ', \'rejected\', null)" style="padding:10px 24px;background:#ef5350;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✕ Tolak</button>' +
            '</div>';
    }
    
    modalContent += '</div>';
    
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = '<div class="modal-content" style="max-width:600px;">' +
        '<div class="modal-header"><h2><i class="fas fa-eye"></i> Detail Data Tamu</h2><span class="modal-close" onclick="this.closest(\'.modal\').remove()">&times;</span></div>' +
        '<div class="modal-body">' + modalContent + '</div>' +
        '</div>';
    document.body.appendChild(modal);
};

function updateVerifikasiCard() {
    var card = document.getElementById('verifikasiCard');
    var count = document.getElementById('verifikasiCount');
    var list = document.getElementById('verifikasiList');
    
    if (!card || !count || !list) return;
    
    if (!isAdmin) {
        card.style.display = 'none';
        return;
    }
    
    var pendingData = dataTamuMenunggu.filter(function(item) {
        return item.status === 'pending';
    });
    
    if (pendingData.length === 0) {
        card.style.display = 'none';
        return;
    }
    
    card.style.display = 'block';
    count.textContent = pendingData.length + ' data menunggu';
    count.className = 'status-badge pending';
    
    var html = '';
    for (var i = 0; i < Math.min(pendingData.length, 5); i++) {
        var item = pendingData[i];
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--primary-bg);">' +
            '<div>' +
            '<div style="font-weight:600;">' + escapeHtml(item.nama) + '</div>' +
            '<div style="font-size:0.75rem;color:var(--text-muted);">' + item.berat.toFixed(2) + ' kg | ' + escapeHtml(item.bsu) + ' | ' + item.tanggal + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:4px;">' +
            '<button onclick="verifikasiDataTamu(' + item.id + ', \'verified\', null)" style="padding:4px 12px;font-size:0.65rem;background:#2e7d32;color:white;border:none;border-radius:4px;cursor:pointer;">✓</button>' +
            '<button onclick="verifikasiDenganHarga(' + item.id + ')" style="padding:4px 12px;font-size:0.65rem;background:#f9a825;color:white;border:none;border-radius:4px;cursor:pointer;">💰</button>' +
            '<button onclick="verifikasiDataTamu(' + item.id + ', \'rejected\', null)" style="padding:4px 12px;font-size:0.65rem;background:#ef5350;color:white;border:none;border-radius:4px;cursor:pointer;">✕</button>' +
            '<button onclick="lihatDetailTamu(' + item.id + ')" style="padding:4px 12px;font-size:0.65rem;background:#0d6efd;color:white;border:none;border-radius:4px;cursor:pointer;">👁</button>' +
            '</div>' +
            '</div>';
    }
    if (pendingData.length > 5) {
        html += '<div style="text-align:center;padding:8px;color:var(--text-muted);font-size:0.8rem;">+ ' + (pendingData.length - 5) + ' data lainnya</div>';
    }
    list.innerHTML = html;
}

function setupUploadFoto() {
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
                    previewTimbang.innerHTML = '<img src="' + event.target.result + '" style="max-width:150px;max-height:150px;border-radius:12px;border:2px solid var(--primary-light);">';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
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
                    previewHasil.innerHTML = '<img src="' + event.target.result + '" style="max-width:150px;max-height:150px;border-radius:12px;border:2px solid var(--primary-light);">';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// ==================== FUNGSI LAPORAN TAHUNAN BSU ====================

function generateLaporanTahunanBSU(bsuNama, tahun) {
    var filteredData = daftarSampah.filter(function(item) {
        if (bsuNama !== 'all' && item.bsu !== bsuNama) return false;
        if (item.tanggal) {
            var itemYear = new Date(item.tanggal).getFullYear();
            if (itemYear !== tahun) return false;
        }
        return true;
    });
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    var bulanData = {};
    
    for (var i = 0; i < months.length; i++) {
        bulanData[months[i]] = { berat: 0, nilai: 0, count: 0 };
    }
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        if (item.tanggal) {
            var month = new Date(item.tanggal).getMonth();
            var monthName = months[month];
            bulanData[monthName].berat += item.berat;
            bulanData[monthName].nilai += (item.berat * item.hargaPerKg);
            bulanData[monthName].count++;
        }
    }
    
    var totalBerat = 0, totalNilai = 0, totalCount = 0;
    var rows = [];
    for (var i = 0; i < months.length; i++) {
        var m = months[i];
        var data = bulanData[m];
        rows.push({
            bulan: m,
            berat: data.berat,
            nilai: data.nilai,
            count: data.count
        });
        totalBerat += data.berat;
        totalNilai += data.nilai;
        totalCount += data.count;
    }
    
    return {
        bsu: bsuNama,
        tahun: tahun,
        rows: rows,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        totalCount: totalCount
    };
}

function renderLaporanTahunanBSU(containerId, bsuNama, tahun) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    var laporan = generateLaporanTahunanBSU(bsuNama, tahun);
    var bsuDisplay = bsuNama === 'all' ? 'Semua BSU' : bsuNama;
    
    var bsuKetua = '';
    if (bsuNama !== 'all') {
        var bsuData = dataBSUWithKetua.find(function(b) { return b.nama === bsuNama; });
        if (bsuData) bsuKetua = bsuData.ketua;
    }
    
    if (laporan.totalCount === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px;">' +
            '<i class="fas fa-file-alt" style="font-size:2rem;display:block;margin-bottom:12px;"></i>' +
            'Tidak ada data untuk ' + bsuDisplay + ' tahun ' + tahun +
            '</div>';
        return;
    }
    
    var html = '<div class="laporan-bsu-card">' +
        '<div class="laporan-bsu-header">' +
        '<h4><i class="fas fa-building"></i> ' + bsuDisplay + (bsuKetua ? ' (Ketua: ' + bsuKetua + ')' : '') + '</h4>' +
        '<span class="periode-text">Laporan Tahunan ' + tahun + '</span>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="laporan-table">' +
        '<thead><tr><th>Bulan</th><th>Berat (kg)</th><th>Nilai (Rp)</th><th>Transaksi</th></tr></thead>' +
        '<tbody>';
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    for (var i = 0; i < months.length; i++) {
        var row = laporan.rows[i];
        var rowClass = (i % 2 === 0) ? '' : 'row-alt';
        html += '<tr class="' + rowClass + '">' +
            '<td><strong>' + months[i] + '</strong></td>' +
            '<td>' + row.berat.toFixed(2) + '</td>' +
            '<td>Rp ' + row.nilai.toLocaleString() + '</td>' +
            '<td>' + row.count + '</td>' +
            '</tr>';
    }
    
    html += '<tr class="total-row">' +
        '<td><strong>TOTAL</strong></td>' +
        '<td><strong>' + laporan.totalBerat.toFixed(2) + ' kg</strong></td>' +
        '<td><strong>Rp ' + laporan.totalNilai.toLocaleString() + '</strong></td>' +
        '<td><strong>' + laporan.totalCount + '</strong></td>' +
        '</tr>' +
        '</tbody></table>' +
        '</div>' +
        '<div class="export-bsu-actions">' +
        '<button class="btn-pdf-bsu" onclick="exportLaporanBSUPDF(\'' + bsuNama + '\', ' + tahun + ')"><i class="fas fa-file-pdf"></i> PDF</button>' +
        '<button class="btn-word-bsu" onclick="exportLaporanBSUWord(\'' + bsuNama + '\', ' + tahun + ')"><i class="fas fa-file-word"></i> Word</button>' +
        '<button class="btn-excel-bsu" onclick="exportLaporanBSUExcel(\'' + bsuNama + '\', ' + tahun + ')"><i class="fas fa-file-excel"></i> Excel</button>' +
        '</div>' +
        '</div>';
    
    container.innerHTML = html;
}

function exportLaporanBSUPDF(bsuNama, tahun) {
    var laporan = generateLaporanTahunanBSU(bsuNama, tahun);
    var bsuDisplay = bsuNama === 'all' ? 'Semua BSU' : bsuNama;
    
    var printWindow = window.open('', '_blank');
    var tglCetak = formatTanggalIndo(new Date());
    var admin = sessionStorage.getItem('adminName') || 'Admin';
    
    var bsuKetua = '';
    if (bsuNama !== 'all') {
        var bsuData = dataBSUWithKetua.find(function(b) { return b.nama === bsuNama; });
        if (bsuData) bsuKetua = bsuData.ketua;
    }
    
    var tabelDetail = '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    for (var i = 0; i < months.length; i++) {
        var row = laporan.rows[i];
        var bgColor = (i % 2 === 0) ? '#f9f9f9' : '#ffffff';
        tabelDetail += '<tr style="background:' + bgColor + ';">' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + months[i] + '</td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:right;">' + row.berat.toFixed(2) + '</td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:right;">Rp ' + row.nilai.toLocaleString() + '</td>' +
            '<td style="border:1px solid #ddd;padding:8px;text-align:center;">' + row.count + '</td>' +
            '</tr>';
    }
    
    var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Laporan Tahunan BSU</title><style>' +
        'body { font-family: "Times New Roman", Arial, sans-serif; padding: 40px; }' +
        '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; }' +
        'h1 { color: #2e7d32; margin-bottom: 5px; font-size: 24px; }' +
        '.subtitle { color: #666; font-size: 14px; }' +
        '.periode { background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold; }' +
        '.bsu-info { text-align: center; font-size: 18px; margin: 10px 0; color: #1a5e2a; }' +
        'table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }' +
        'th { background: #2e7d32; color: white; padding: 10px; text-align: center; }' +
        'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
        '.total-row { background: #e8f5e9; font-weight: bold; }' +
        '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }' +
        '.signature { margin-top: 40px; display: flex; justify-content: space-between; }' +
        '.signature-box { text-align: center; }' +
        '.signature-line { margin-top: 40px; width: 200px; border-top: 1px solid #000; margin: 0 auto; }' +
        '.signature-box p { margin-top: 8px; font-size: 12px; }' +
        '.no-print { display: block; } @media print { .no-print { display: none; } }' +
        '</style></head><body>' +
        '<div class="header">' +
        '<h1>BANK SAMPAH DIGITAL</h1>' +
        '<div class="subtitle">BSI Mandiri - Desa Gunung Putri</div>' +
        '</div>' +
        '<div class="bsu-info"><strong>' + bsuDisplay + '</strong>' + (bsuKetua ? ' (Ketua: ' + bsuKetua + ')' : '') + '</div>' +
        '<div class="periode">Laporan Tahunan ' + tahun + '</div>' +
        '<table><thead><tr><th>Bulan</th><th>Berat (kg)</th><th>Nilai (Rp)</th><th>Transaksi</th></tr></thead><tbody>' + tabelDetail +
        '<tr class="total-row"><td><strong>TOTAL</strong></td><td><strong>' + laporan.totalBerat.toFixed(2) + ' kg</strong></td><td><strong>Rp ' + laporan.totalNilai.toLocaleString() + '</strong></td><td><strong>' + laporan.totalCount + '</strong></td></tr>' +
        '</tbody></table>' +
        '<div class="footer"><p>Dicetak: ' + tglCetak + ' | Dicetak oleh: ' + admin + '</p></div>' +
        '<div class="signature">' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Kepala Bank Sampah</p></div>' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Ketua BSU</p></div>' +
        '</div>' +
        '<div class="no-print" style="text-align:center;margin-top:20px;">' +
        '<button onclick="window.print()" style="padding:10px 30px;background:#2e7d32;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;">🖨️ Cetak / Simpan PDF</button>' +
        '</div>' +
        '</body></html>';
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(function() {
        printWindow.focus();
        printWindow.print();
    }, 500);
    showToast('Laporan PDF siap dicetak', false);
}

function exportLaporanBSUWord(bsuNama, tahun) {
    var laporan = generateLaporanTahunanBSU(bsuNama, tahun);
    var bsuDisplay = bsuNama === 'all' ? 'Semua BSU' : bsuNama;
    
    var bsuKetua = '';
    if (bsuNama !== 'all') {
        var bsuData = dataBSUWithKetua.find(function(b) { return b.nama === bsuNama; });
        if (bsuData) bsuKetua = bsuData.ketua;
    }
    
    var tabelDetail = '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    for (var i = 0; i < months.length; i++) {
        var row = laporan.rows[i];
        var bgColor = (i % 2 === 0) ? '#f9f9f9' : '#ffffff';
        tabelDetail += '<tr style="background:' + bgColor + ';"><td>' + months[i] + '</td><td>' + row.berat.toFixed(2) + '</td><td>Rp ' + row.nilai.toLocaleString() + '</td><td>' + row.count + '</td></tr>';
    }
    
    var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Laporan Tahunan BSU</title><style>' +
        'body { font-family: Calibri, Arial, sans-serif; padding: 40px; }' +
        'h1 { color: #2e7d32; text-align: center; }' +
        '.periode { background: #e8f5e9; padding: 10px; margin: 20px 0; text-align: center; }' +
        '.bsu-info { text-align: center; font-size: 16px; margin: 10px 0; }' +
        'table { width: 100%; border-collapse: collapse; margin: 20px 0; }' +
        'th { background: #2e7d32; color: white; padding: 10px; }' +
        'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
        '.total-row { background: #e8f5e9; font-weight: bold; }' +
        '.footer { margin-top: 40px; text-align: center; font-size: 11px; }' +
        '</style></head><body>' +
        '<h1>BANK SAMPAH DIGITAL</h1>' +
        '<div class="bsu-info"><strong>' + bsuDisplay + '</strong>' + (bsuKetua ? ' (Ketua: ' + bsuKetua + ')' : '') + '</div>' +
        '<div class="periode"><strong>Laporan Tahunan ' + tahun + '</strong></div>' +
        '<table><thead><tr><th>Bulan</th><th>Berat (kg)</th><th>Nilai (Rp)</th><th>Transaksi</th></tr></thead><tbody>' +
        tabelDetail +
        '<tr class="total-row"><td><strong>TOTAL</strong></td><td><strong>' + laporan.totalBerat.toFixed(2) + ' kg</strong></td><td><strong>Rp ' + laporan.totalNilai.toLocaleString() + '</strong></td><td><strong>' + laporan.totalCount + '</strong></td></tr>' +
        '</tbody></table>' +
        '<div class="footer"><p>Dicetak: ' + formatTanggalIndo(new Date()) + ' | Dicetak oleh: ' + (sessionStorage.getItem('adminName') || 'Admin') + '</p></div>' +
        '</body></html>';
    
    var blob = new Blob([htmlContent], { type: 'application/msword' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'Laporan_Tahunan_BSU_' + bsuDisplay + '_' + tahun + '.doc';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Laporan Word berhasil diekspor', false);
}

function exportLaporanBSUExcel(bsuNama, tahun) {
    var laporan = generateLaporanTahunanBSU(bsuNama, tahun);
    var bsuDisplay = bsuNama === 'all' ? 'Semua BSU' : bsuNama;
    
    var bsuKetua = '';
    if (bsuNama !== 'all') {
        var bsuData = dataBSUWithKetua.find(function(b) { return b.nama === bsuNama; });
        if (bsuData) bsuKetua = bsuData.ketua;
    }
    
    var headers = ['No', 'Bulan', 'Berat (kg)', 'Nilai (Rp)', 'Transaksi'];
    var rows = [];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    for (var i = 0; i < months.length; i++) {
        var row = laporan.rows[i];
        rows.push([i+1, months[i], row.berat.toFixed(2), row.nilai, row.count]);
    }
    
    rows.push(['', 'TOTAL', laporan.totalBerat.toFixed(2), laporan.totalNilai, laporan.totalCount]);
    
    var csvContent = '\uFEFF';
    csvContent += 'Laporan Tahunan BSU\n';
    csvContent += 'Nama BSU: ' + bsuDisplay + (bsuKetua ? ' (Ketua: ' + bsuKetua + ')' : '') + '\n';
    csvContent += 'Tahun: ' + tahun + '\n\n';
    csvContent += headers.join(',') + '\n';
    
    for (var i = 0; i < rows.length; i++) {
        csvContent += rows[i].join(',') + '\n';
    }
    
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'Laporan_Tahunan_BSU_' + bsuDisplay + '_' + tahun + '.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Laporan Excel berhasil diekspor', false);
}

// ==================== FUNGSI BUKU TABUNGAN ====================

function generateTabunganNasabah(bsuNama) {
    var filteredData = daftarSampah.filter(function(item) {
        if (bsuNama !== 'all' && item.bsu !== bsuNama) return false;
        return true;
    });
    
    filteredData.sort(function(a, b) {
        return new Date(a.tanggal) - new Date(b.tanggal);
    });
    
    var saldo = 0;
    var history = [];
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        var nilai = item.berat * item.hargaPerKg;
        saldo += nilai;
        history.push({
            tanggal: item.tanggal || '-',
            nama: item.nama,
            berat: item.berat,
            hargaPerKg: item.hargaPerKg,
            nilai: nilai,
            saldo: saldo
        });
    }
    
    return {
        bsu: bsuNama,
        history: history,
        totalSaldo: saldo,
        totalTransaksi: history.length
    };
}

function renderBukuTabungan(containerId, bsuNama) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    var data = generateTabunganNasabah(bsuNama);
    var bsuDisplay = bsuNama === 'all' ? 'Semua BSU' : bsuNama;
    
    var bsuKetua = '';
    if (bsuNama !== 'all') {
        var bsuData = dataBSUWithKetua.find(function(b) { return b.nama === bsuNama; });
        if (bsuData) bsuKetua = bsuData.ketua;
    }
    
    if (data.history.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px;">' +
            '<i class="fas fa-wallet" style="font-size:2rem;display:block;margin-bottom:12px;"></i>' +
            'Tidak ada data untuk ' + bsuDisplay +
            '</div>';
        return;
    }
    
    var html = '<div class="tabungan-card">' +
        '<div class="tabungan-header">' +
        '<h3><i class="fas fa-wallet"></i> Buku Tabungan</h3>' +
        '<span class="no-rek">' + bsuDisplay + (bsuKetua ? ' | Ketua: ' + bsuKetua : '') + '</span>' +
        '</div>' +
        '<div class="tabungan-saldo">' +
        '<div class="saldo-label">Total Saldo</div>' +
        '<div class="saldo-value">Rp ' + data.totalSaldo.toLocaleString() + '</div>' +
        '<div style="font-size:0.7rem;color:var(--text-muted);">Total Transaksi: ' + data.totalTransaksi + '</div>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="tabungan-table">' +
        '<thead><tr><th>Tanggal</th><th>Nama Sampah</th><th>Berat (kg)</th><th>Harga/kg</th><th>Nilai (Debit)</th><th>Saldo</th></tr></thead>' +
        '<tbody>';
    
    for (var i = 0; i < data.history.length; i++) {
        var item = data.history[i];
        var tgl = item.tanggal ? item.tanggal : '-';
        var rowClass = (i % 2 === 0) ? '' : 'row-alt';
        html += '<tr class="' + rowClass + '">' +
            '<td>' + tgl + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + item.berat.toFixed(2) + '</td>' +
            '<td>Rp ' + item.hargaPerKg.toLocaleString() + '</td>' +
            '<td class="debit">Rp ' + item.nilai.toLocaleString() + '</td>' +
            '<td><strong>Rp ' + item.saldo.toLocaleString() + '</strong></td>' +
            '</tr>';
    }
    
    html += '</tbody></table>' +
        '</div>' +
        '<div style="margin-top:16px;text-align:right;font-size:0.7rem;color:var(--text-muted);">' +
        'Dicetak: ' + formatTanggalIndo(new Date()) +
        '</div>' +
        '</div>';
    
    container.innerHTML = html;
}

function exportTabunganExcel(bsuNama) {
    var data = generateTabunganNasabah(bsuNama);
    var bsuDisplay = bsuNama === 'all' ? 'Semua BSU' : bsuNama;
    
    var bsuKetua = '';
    if (bsuNama !== 'all') {
        var bsuData = dataBSUWithKetua.find(function(b) { return b.nama === bsuNama; });
        if (bsuData) bsuKetua = bsuData.ketua;
    }
    
    if (data.history.length === 0) {
        showToast('Tidak ada data untuk diekspor!', true);
        return;
    }
    
    var headers = ['Tanggal', 'Nama Sampah', 'Berat (kg)', 'Harga/kg (Rp)', 'Nilai (Rp)', 'Saldo (Rp)'];
    var rows = [];
    
    for (var i = 0; i < data.history.length; i++) {
        var item = data.history[i];
        rows.push([
            item.tanggal || '-',
            '"' + item.nama + '"',
            item.berat.toFixed(2),
            item.hargaPerKg,
            item.nilai,
            item.saldo
        ]);
    }
    
    var csvContent = '\uFEFF';
    csvContent += 'BUKU TABUNGAN NASABAH\n';
    csvContent += 'Nama BSU: ' + bsuDisplay + (bsuKetua ? ' (Ketua: ' + bsuKetua + ')' : '') + '\n';
    csvContent += 'Total Saldo: Rp ' + data.totalSaldo.toLocaleString() + '\n';
    csvContent += 'Total Transaksi: ' + data.totalTransaksi + '\n\n';
    csvContent += headers.join(',') + '\n';
    
    for (var i = 0; i < rows.length; i++) {
        csvContent += rows[i].join(',') + '\n';
    }
    
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'Buku_Tabungan_' + bsuDisplay + '_' + new Date().toISOString().slice(0,10) + '.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Buku tabungan berhasil diekspor!', false);
}

// ==================== CRUD OPERATIONS ====================
window.tambahSampah = function() {
    if (!isAdmin) {
        showToast('Hanya Admin yang dapat menambah data!', true);
        return;
    }
    
    var rw = document.getElementById('inputRW').value;
    var rt = document.getElementById('inputRT').value;
    var nama = document.getElementById('namaSampah').value;
    var jenis = document.getElementById('jenisSampah').value;
    var berat = parseFloat(document.getElementById('beratSampah').value);
    var harga = parseInt(document.getElementById('hargaSampah').value);
    
    if (selectedBSU) {
        rw = selectedBSU.rw;
        if (selectedBSU.rt !== 'all') {
            rt = selectedBSU.rt;
        }
    }
    
    if (!nama.trim()) {
        showToast('Nama sampah wajib diisi!', true);
        return;
    }
    if (berat <= 0) {
        showToast('Berat harus lebih dari 0 kg!', true);
        return;
    }
    
    if (!harga || harga <= 0) {
        harga = getHargaByNamaSampah(nama);
    }
    
    daftarSampah.push({
        id: Date.now(),
        rw: rw,
        rt: rt,
        nama: nama.trim(),
        jenis: jenis,
        berat: berat,
        hargaPerKg: harga,
        tanggal: new Date().toISOString(),
        bsu: selectedBSU ? selectedBSU.nama : null
    });
    
    saveDataToLocal();
    refreshAll();
    logActivity('Tambah Data', 'Menambah data: ' + nama.trim());
    
    document.getElementById('namaSampah').value = '';
    document.getElementById('beratSampah').value = '1';
    document.getElementById('hargaSampah').value = '2000';
    
    showToast('Data berhasil ditambahkan!', false);
};

window.editSampah = function(id) {
    if (!isAdmin) {
        showToast('Hanya Admin yang dapat mengedit data!', true);
        return;
    }
    
    var item = null;
    for (var i = 0; i < daftarSampah.length; i++) {
        if (daftarSampah[i].id === id) {
            item = daftarSampah[i];
            break;
        }
    }
    if (!item) return;
    
    var newBSU = prompt('Edit BSU (atau kosongkan):', item.bsu || '');
    var newRW = prompt('Edit RW:', item.rw);
    if (!newRW) return;
    var newRT = prompt('Edit RT:', item.rt);
    if (!newRT) return;
    var newNama = prompt('Edit Nama Sampah:', item.nama);
    if (!newNama) return;
    var newJenis = prompt('Jenis (organik/nonorganik):', item.jenis);
    if (newJenis !== 'organik' && newJenis !== 'nonorganik') {
        showToast('Jenis harus organik atau nonorganik', true);
        return;
    }
    var newBerat = parseFloat(prompt('Berat (kg):', item.berat));
    if (isNaN(newBerat) || newBerat <= 0) {
        showToast('Berat tidak valid', true);
        return;
    }
    var newHarga = parseInt(prompt('Harga per Kg (Rp):', item.hargaPerKg));
    if (isNaN(newHarga) || newHarga < 0) {
        newHarga = getHargaByNamaSampah(newNama);
    }
    
    item.bsu = newBSU || null;
    item.rw = newRW;
    item.rt = newRT;
    item.nama = newNama.trim();
    item.jenis = newJenis;
    item.berat = newBerat;
    item.hargaPerKg = newHarga;
    
    saveDataToLocal();
    refreshAll();
    logActivity('Edit Data', 'Mengedit data: ' + item.nama);
    showToast('Data berhasil diupdate!', false);
};

window.deleteSampah = function(id) {
    if (!isAdmin) {
        showToast('Hanya Admin yang dapat menghapus data!', true);
        return;
    }
    
    var item = null;
    for (var i = 0; i < daftarSampah.length; i++) {
        if (daftarSampah[i].id === id) {
            item = daftarSampah[i];
            break;
        }
    }
    
    showConfirm('Hapus Data', 'Yakin ingin menghapus data "' + (item ? item.nama : '') + '"?', function() {
        var newArray = [];
        for (var i = 0; i < daftarSampah.length; i++) {
            if (daftarSampah[i].id !== id) {
                newArray.push(daftarSampah[i]);
            }
        }
        daftarSampah = newArray;
        saveDataToLocal();
        refreshAll();
        logActivity('Hapus Data', 'Menghapus data: ' + (item ? item.nama : 'id:' + id));
        showToast('Data berhasil dihapus!', false);
    });
};

// ==================== STATISTIK PAGE ====================
function updateStatistikPage() {
    var filteredData = filterDataByFilters(daftarSampah, currentStatFilterBSU, currentStatFilterRW, currentStatFilterRT);
    
    if (currentStatFilterJenis !== 'all') {
        filteredData = filteredData.filter(function(item) { return item.jenis === currentStatFilterJenis; });
    }
    
    var totalOrganik = 0, totalNonorganik = 0;
    var itemOrganik = 0, itemNonorganik = 0;
    var jenisSampahMap = {};
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        if (item.jenis === 'organik') {
            totalOrganik += item.berat;
            itemOrganik++;
        } else {
            totalNonorganik += item.berat;
            itemNonorganik++;
        }
        
        if (!jenisSampahMap[item.jenis]) {
            jenisSampahMap[item.jenis] = { berat: 0, count: 0, nilai: 0 };
        }
        jenisSampahMap[item.jenis].berat += item.berat;
        jenisSampahMap[item.jenis].count++;
        jenisSampahMap[item.jenis].nilai += (item.berat * item.hargaPerKg);
    }
    
    var totalSemua = totalOrganik + totalNonorganik;
    var totalItems = filteredData.length;
    
    var statOrganikBerat = document.getElementById('statOrganikBerat');
    var statOrganikItem = document.getElementById('statOrganikItem');
    var statNonorganikBerat = document.getElementById('statNonorganikBerat');
    var statNonorganikItem = document.getElementById('statNonorganikItem');
    var statTotalBerat = document.getElementById('statTotalBerat');
    var statTotalItem = document.getElementById('statTotalItem');
    
    if (statOrganikBerat) statOrganikBerat.innerText = totalOrganik.toFixed(2) + ' kg';
    if (statOrganikItem) statOrganikItem.innerText = itemOrganik;
    if (statNonorganikBerat) statNonorganikBerat.innerText = totalNonorganik.toFixed(2) + ' kg';
    if (statNonorganikItem) statNonorganikItem.innerText = itemNonorganik;
    if (statTotalBerat) statTotalBerat.innerText = totalSemua.toFixed(2) + ' kg';
    if (statTotalItem) statTotalItem.innerText = totalItems;
    
    renderJenisSampahTable(jenisSampahMap);
    updateCharts();
}

function renderJenisSampahTable(jenisSampahMap) {
    var container = document.getElementById('jenisSampahTableBody');
    if (!container) return;
    
    var html = '';
    for (var jenis in jenisSampahMap) {
        if (jenisSampahMap.hasOwnProperty(jenis)) {
            var data = jenisSampahMap[jenis];
            html += '<tr>' +
                '<td>' + (jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</td>' +
                '<td>' + data.berat.toFixed(2) + ' kg</td>' +
                '<td>' + data.count + ' item</td>' +
                '<td>Rp ' + data.nilai.toLocaleString() + '</td>' +
                '</tr>';
        }
    }
    
    if (html === '') {
        html = '<tr><td colspan="4" style="text-align: center;">Tidak ada data</td></tr>';
    }
    container.innerHTML = html;
}

// ==================== GRAFIK FUNGSI ====================
function updateCharts() {
    updateJenisSampahChart();
    updateNamaSampahChart();
    updateTrenChart();
}

function updateJenisSampahChart() {
    var selectedBSU = document.getElementById('jenisChartBSUFilter') ? document.getElementById('jenisChartBSUFilter').value : 'all';
    var filteredData = filterDataByFilters(daftarSampah, selectedBSU, currentStatFilterRW, currentStatFilterRT);
    
    var totalOrganik = 0;
    var totalNonorganik = 0;
    
    for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].jenis === 'organik') {
            totalOrganik += filteredData[i].berat;
        } else {
            totalNonorganik += filteredData[i].berat;
        }
    }
    
    var ctx = document.getElementById('jenisSampahChart');
    if (!ctx) return;
    var ctx2d = ctx.getContext('2d');
    
    if (jenisSampahChart) {
        jenisSampahChart.destroy();
    }
    
    jenisSampahChart = new Chart(ctx2d, {
        type: 'pie',
        data: {
            labels: ['Organik', 'Nonorganik'],
            datasets: [{
                data: [totalOrganik, totalNonorganik],
                backgroundColor: ['#2e7d32', '#f9a825'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var label = context.label || '';
                            var value = context.raw || 0;
                            var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                            var percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return label + ': ' + value.toFixed(2) + ' kg (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

function updateNamaSampahChart() {
    var selectedBSU = document.getElementById('namaChartBSUFilter') ? document.getElementById('namaChartBSUFilter').value : 'all';
    var filteredData = filterDataByFilters(daftarSampah, selectedBSU, currentStatFilterRW, currentStatFilterRT);
    
    var sampahMap = {};
    for (var i = 0; i < filteredData.length; i++) {
        var nama = filteredData[i].nama;
        if (!sampahMap[nama]) {
            sampahMap[nama] = 0;
        }
        sampahMap[nama] += filteredData[i].berat;
    }
    
    var sortedItems = [];
    for (var nama in sampahMap) {
        sortedItems.push({ nama: nama, berat: sampahMap[nama] });
    }
    sortedItems.sort(function(a, b) { return b.berat - a.berat; });
    var topItems = sortedItems.slice(0, 10);
    
    var labels = topItems.map(function(item) { return item.nama.length > 25 ? item.nama.substring(0, 22) + '...' : item.nama; });
    var data = topItems.map(function(item) { return item.berat; });
    
    var ctx = document.getElementById('namaSampahChart');
    if (!ctx) return;
    var ctx2d = ctx.getContext('2d');
    
    if (namaSampahChart) {
        namaSampahChart.destroy();
    }
    
    namaSampahChart = new Chart(ctx2d, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Berat (kg)',
                data: data,
                backgroundColor: '#2e7d32',
                borderRadius: 8,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw.toFixed(2) + ' kg';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Berat (kg)', font: { size: 12 } }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

function updateTrenChart() {
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    
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
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
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
    
    var ctx = document.getElementById('trenChart');
    if (!ctx) return;
    var ctx2d = ctx.getContext('2d');
    
    if (trenChart) {
        trenChart.destroy();
    }
    
    trenChart = new Chart(ctx2d, {
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
                    pointRadius: 4
                },
                {
                    label: 'Nonorganik',
                    data: nonorganikData,
                    borderColor: '#f9a825',
                    backgroundColor: 'rgba(249,168,37,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Total',
                    data: totalData,
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(21,101,192,0.05)',
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5],
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 11 },
                        boxWidth: 12
                    }
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
                    title: {
                        display: true,
                        text: 'Berat (kg)',
                        font: { size: 10 }
                    },
                    ticks: {
                        font: { size: 10 }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

// ==================== FUNGSI EKSPOR PDF DAN WORD (DIPERBAIKI) ====================

function getRekapPerNamaSampah(data) {
    var rekap = {};
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var nama = item.nama;
        if (!rekap[nama]) {
            rekap[nama] = {
                nama: nama,
                totalBerat: 0,
                totalNilai: 0,
                jumlahTransaksi: 0
            };
        }
        rekap[nama].totalBerat += item.berat;
        rekap[nama].totalNilai += (item.berat * item.hargaPerKg);
        rekap[nama].jumlahTransaksi++;
    }
    var result = Object.values(rekap);
    result.sort(function(a, b) { return b.totalBerat - a.totalBerat; });
    return result;
}

function getFilterText() {
    var parts = [];
    if (currentFilterBSU && currentFilterBSU !== 'all') parts.push('BSU: ' + currentFilterBSU);
    if (currentFilterRW && currentFilterRW !== 'all') parts.push('RW: ' + currentFilterRW);
    if (currentFilterRT && currentFilterRT !== 'all') parts.push('RT: ' + currentFilterRT);
    if (parts.length === 0) return 'Semua Data';
    return parts.join(' | ');
}

function generateLaporanMingguan(data, bsu, rw, rt) {
    var filtered = filterDataByFilters(data || daftarSampah, bsu || currentFilterBSU, rw || currentFilterRW, rt || currentFilterRT);
    var today = new Date();
    var weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    for (var i = 0; i < filtered.length; i++) {
        var item = filtered[i];
        if (item.jenis === 'organik') totalOrganik += item.berat;
        else totalNonorganik += item.berat;
        totalNilai += (item.berat * item.hargaPerKg);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    return {
        title: 'Laporan Mingguan Bank Sampah Digital',
        periode: formatTanggalIndo(weekStart) + ' s/d ' + formatTanggalIndo(today),
        data: filtered,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: filtered.length,
        filterInfo: getFilterText()
    };
}

function generateLaporanBulanan(data, bsu, rw, rt) {
    var filtered = filterDataByFilters(data || daftarSampah, bsu || currentFilterBSU, rw || currentFilterRW, rt || currentFilterRT);
    var today = new Date();
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    for (var i = 0; i < filtered.length; i++) {
        var item = filtered[i];
        if (item.jenis === 'organik') totalOrganik += item.berat;
        else totalNonorganik += item.berat;
        totalNilai += (item.berat * item.hargaPerKg);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    return {
        title: 'Laporan Bulanan Bank Sampah Digital',
        periode: namaBulan[today.getMonth()] + ' ' + today.getFullYear(),
        data: filtered,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: filtered.length,
        filterInfo: getFilterText()
    };
}

function generateLaporanTahunan(data, bsu, rw, rt) {
    var filtered = filterDataByFilters(data || daftarSampah, bsu || currentFilterBSU, rw || currentFilterRW, rt || currentFilterRT);
    var today = new Date();
    var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
    for (var i = 0; i < filtered.length; i++) {
        var item = filtered[i];
        if (item.jenis === 'organik') totalOrganik += item.berat;
        else totalNonorganik += item.berat;
        totalNilai += (item.berat * item.hargaPerKg);
    }
    var totalBerat = totalOrganik + totalNonorganik;
    
    return {
        title: 'Laporan Tahunan Bank Sampah Digital',
        periode: 'Tahun ' + today.getFullYear(),
        data: filtered,
        totalOrganik: totalOrganik,
        totalNonorganik: totalNonorganik,
        totalBerat: totalBerat,
        totalNilai: totalNilai,
        jumlahItem: filtered.length,
        filterInfo: getFilterText()
    };
}

function exportFullPDF(laporan, jenisLaporan) {
    var printWindow = window.open('', '_blank');
    var tglCetak = formatTanggalIndo(new Date());
    var admin = sessionStorage.getItem('adminName') || 'Admin';
    
    var tabelDetail = '';
    for (var i = 0; i < laporan.data.length; i++) {
        var item = laporan.data[i];
        tabelDetail += '<tr>' +
            '<td style="border:1px solid #ddd; padding:8px; text-align:center;">' + (i+1) + '</td>' +
            '<td style="border:1px solid #ddd; padding:8px;">' + (item.bsu ? escapeHtml(item.bsu) : '-') + '</td>' +
            '<td style="border:1px solid #ddd; padding:8px;">' + item.rw + ' - ' + item.rt + '</td>' +
            '<td style="border:1px solid #ddd; padding:8px;"><strong>' + escapeHtml(item.nama) + '</strong></td>' +
            '<td style="border:1px solid #ddd; padding:8px;">' + (item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</td>' +
            '<td style="border:1px solid #ddd; padding:8px; text-align:right;">' + item.berat.toFixed(2) + ' kg</td>' +
            '<td style="border:1px solid #ddd; padding:8px; text-align:right;">Rp ' + item.hargaPerKg.toLocaleString() + '</td>' +
            '<td style="border:1px solid #ddd; padding:8px; text-align:right;">Rp ' + (item.berat * item.hargaPerKg).toLocaleString() + '</td>' +
            '</tr>';
    }
    
    var rekapHtml = '';
    var rekapData = getRekapPerNamaSampah(laporan.data);
    for (var i = 0; i < rekapData.length; i++) {
        var r = rekapData[i];
        rekapHtml += '<tr>' +
            '<td style="border:1px solid #ddd; padding:6px; text-align:center;">' + (i+1) + '</td>' +
            '<td style="border:1px solid #ddd; padding:6px;">' + escapeHtml(r.nama) + '</td>' +
            '<td style="border:1px solid #ddd; padding:6px; text-align:right;">' + r.totalBerat.toFixed(2) + ' kg</td>' +
            '<td style="border:1px solid #ddd; padding:6px; text-align:center;">' + r.jumlahTransaksi + '</td>' +
            '<td style="border:1px solid #ddd; padding:6px; text-align:right;">Rp ' + r.totalNilai.toLocaleString() + '</td>' +
            '</tr>';
    }
    
    var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + laporan.title + '</title><style>' +
        'body { font-family: "Times New Roman", Arial, sans-serif; padding: 40px; }' +
        '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; }' +
        'h1 { color: #2e7d32; margin-bottom: 5px; font-size: 24px; }' +
        '.subtitle { color: #666; font-size: 14px; }' +
        '.periode { background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold; }' +
        '.filter-info { background: #e3f2fd; padding: 10px; border-radius: 8px; text-align: center; margin: 10px 0; font-size: 12px; color: #1565c0; }' +
        '.stats { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }' +
        '.stat-card { flex: 1; min-width: 150px; background: #f5f5f5; border-radius: 12px; padding: 15px; text-align: center; }' +
        '.stat-card.organik { border-top: 4px solid #2e7d32; }' +
        '.stat-card.nonorganik { border-top: 4px solid #f9a825; }' +
        '.stat-card.total { border-top: 4px solid #7b1fa2; }' +
        '.stat-value { font-size: 22px; font-weight: bold; color: #2e7d32; }' +
        '.stat-label { font-size: 12px; color: #666; }' +
        '.info-box { background: #e3f2fd; border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center; }' +
        '.section-title { margin-top: 30px; font-size: 18px; color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 8px; }' +
        'table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }' +
        'th { background: #2e7d32; color: white; padding: 10px; text-align: left; }' +
        'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
        '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }' +
        '.signature { margin-top: 40px; display: flex; justify-content: space-between; }' +
        '.signature-box { text-align: center; }' +
        '.signature-line { margin-top: 40px; width: 200px; border-top: 1px solid #000; margin: 0 auto; }' +
        '.signature-box p { margin-top: 8px; font-size: 12px; }' +
        '@media print { body { padding: 20px; } .no-print { display: none; } }' +
        '</style></head><body>' +
        '<div class="header">' +
        '<h1>BANK SAMPAH DIGITAL</h1>' +
        '<div class="subtitle">BSI Mandiri - Desa Gunung Putri</div>' +
        '</div>' +
        '<h2 style="text-align:center;">' + laporan.title + '</h2>' +
        '<div class="periode">Periode Laporan: ' + laporan.periode + '</div>' +
        '<div class="filter-info">Filter: ' + laporan.filterInfo + '</div>' +
        '<div class="stats">' +
        '<div class="stat-card organik"><div class="stat-value">' + laporan.totalOrganik.toFixed(2) + ' kg</div><div class="stat-label">Total Sampah Organik</div></div>' +
        '<div class="stat-card nonorganik"><div class="stat-value">' + laporan.totalNonorganik.toFixed(2) + ' kg</div><div class="stat-label">Total Sampah Nonorganik</div></div>' +
        '<div class="stat-card total"><div class="stat-value">' + laporan.totalBerat.toFixed(2) + ' kg</div><div class="stat-label">Total Keseluruhan</div></div>' +
        '</div>' +
        '<div class="info-box">' +
        '<strong>Total Nilai Sampah:</strong> Rp ' + laporan.totalNilai.toLocaleString() + ' | ' +
        '<strong>Jumlah Transaksi:</strong> ' + laporan.jumlahItem + ' item' +
        '</div>' +
        '<div class="section-title"> Detail Data Sampah</div>' +
        '<table><thead><tr><th>No</th><th>BSU</th><th>RW/RT</th><th>Nama Sampah</th><th>Jenis</th><th>Berat</th><th>Harga per Kg</th><th>Total Nilai</th></tr></thead><tbody>' + tabelDetail + '</tbody></table>' +
        '<div class="section-title"> Rekap per Nama Sampah</div>' +
        '<table><thead><tr><th>No</th><th>Nama Sampah</th><th>Total Berat</th><th>Transaksi</th><th>Total Nilai</th></tr></thead><tbody>' + rekapHtml + '</tbody></table>' +
        '<div class="footer">' +
        '<p>Dicetak pada: ' + tglCetak + '</p>' +
        '<p>Dicetak oleh: ' + admin + '</p>' +
        '<p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p>' +
        '</div>' +
        '<div class="signature">' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Kepala Bank Sampah</p></div>' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Ketua RW</p></div>' +
        '</div>' +
        '<div class="no-print" style="text-align:center;margin-top:20px;">' +
        '<button onclick="window.print()" style="padding:10px 30px;background:#2e7d32;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;">🖨️ Cetak / Simpan PDF</button>' +
        '</div>' +
        '</body></html>';
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(function() {
        printWindow.focus();
        printWindow.print();
    }, 500);
    
    showToast('Laporan siap dicetak atau disimpan sebagai PDF', false);
}

function exportFullWord(laporan, jenisLaporan) {
    var tglCetak = formatTanggalIndo(new Date());
    var admin = sessionStorage.getItem('adminName') || 'Admin';
    
    var tabelDetail = '';
    for (var i = 0; i < laporan.data.length; i++) {
        var item = laporan.data[i];
        var rowBg = (i % 2 === 0) ? '#ffffff' : '#f9f9f9';
        tabelDetail += '<tr style="background:' + rowBg + ';">' +
            '<td>' + (i+1) + '</td>' +
            '<td>' + (item.bsu ? escapeHtml(item.bsu) : '-') + '</td>' +
            '<td>' + item.rw + ' - ' + item.rt + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td>' +
            '<td style="text-align:right;">' + item.berat.toFixed(2) + ' kg</td>' +
            '<td style="text-align:right;">Rp ' + item.hargaPerKg.toLocaleString() + '</td>' +
            '<td style="text-align:right;">Rp ' + (item.berat * item.hargaPerKg).toLocaleString() + '</td>' +
            '</tr>';
    }
    
    var rekapHtml = '';
    var rekapData = getRekapPerNamaSampah(laporan.data);
    for (var i = 0; i < rekapData.length; i++) {
        var r = rekapData[i];
        var rowBg = (i % 2 === 0) ? '#ffffff' : '#f9f9f9';
        rekapHtml += '<tr style="background:' + rowBg + ';">' +
            '<td style="text-align:center;">' + (i+1) + '</td>' +
            '<td>' + escapeHtml(r.nama) + '</td>' +
            '<td style="text-align:right;">' + r.totalBerat.toFixed(2) + ' kg</td>' +
            '<td style="text-align:center;">' + r.jumlahTransaksi + '</td>' +
            '<td style="text-align:right;">Rp ' + r.totalNilai.toLocaleString() + '</td>' +
            '</tr>';
    }
    
    var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + laporan.title + '</title><style>' +
        'body { font-family: Calibri, Arial, sans-serif; padding: 40px; }' +
        'h1 { color: #2e7d32; text-align: center; font-size: 24px; }' +
        'h2 { text-align: center; font-size: 18px; }' +
        '.periode { background: #e8f5e9; padding: 10px; margin: 20px 0; text-align: center; font-weight: bold; }' +
        '.filter-info { background: #e3f2fd; padding: 8px; margin: 10px 0; text-align: center; font-size: 11px; }' +
        '.stats { display: flex; gap: 20px; margin: 20px 0; }' +
        '.stat-card { flex: 1; background: #f5f5f5; padding: 15px; text-align: center; border-radius: 8px; }' +
        '.stat-value { font-size: 20px; font-weight: bold; color: #2e7d32; }' +
        '.stat-label { font-size: 11px; color: #666; }' +
        '.info-box { background: #e3f2fd; padding: 10px; margin: 20px 0; text-align: center; border-radius: 8px; }' +
        '.section-title { margin-top: 30px; font-size: 16px; color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 6px; }' +
        'table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; }' +
        'th { background: #2e7d32; color: white; padding: 8px 10px; text-align: left; }' +
        'td { padding: 6px 10px; border-bottom: 1px solid #ddd; }' +
        '.footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }' +
        '.signature { margin-top: 40px; display: flex; justify-content: space-around; }' +
        '.signature-box { text-align: center; }' +
        '.signature-line { margin-top: 40px; width: 200px; border-top: 1px solid #000; margin: 0 auto; }' +
        '.signature-box p { margin-top: 8px; font-size: 11px; }' +
        '</style></head><body>' +
        '<h1>BANK SAMPAH DIGITAL</h1>' +
        '<p style="text-align:center;font-size:12px;color:#666;">BSI Mandiri - Desa Gunung Putri</p>' +
        '<h2>' + laporan.title + '</h2>' +
        '<div class="periode">Periode: ' + laporan.periode + '</div>' +
        '<div class="filter-info">Filter: ' + laporan.filterInfo + '</div>' +
        '<div class="stats">' +
        '<div class="stat-card"><div class="stat-value">' + laporan.totalOrganik.toFixed(2) + ' kg</div><div class="stat-label">Sampah Organik</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + laporan.totalNonorganik.toFixed(2) + ' kg</div><div class="stat-label">Sampah Nonorganik</div></div>' +
        '<div class="stat-card"><div class="stat-value">' + laporan.totalBerat.toFixed(2) + ' kg</div><div class="stat-label">Total Semua</div></div>' +
        '</div>' +
        '<div class="info-box"><strong>Total Nilai: Rp ' + laporan.totalNilai.toLocaleString() + '</strong> | Jumlah Item: ' + laporan.jumlahItem + '</div>' +
        '<div class="section-title">📋 Detail Data Sampah</div>' +
        '<table><thead><tr><th>No</th><th>BSU</th><th>RW/RT</th><th>Nama Sampah</th><th>Jenis</th><th>Berat</th><th>Harga</th><th>Total</th></tr></thead><tbody>' +
        tabelDetail + '</tbody></table>' +
        '<div class="section-title">📊 Rekap per Nama Sampah</div>' +
        '<table><thead><tr><th>No</th><th>Nama Sampah</th><th>Total Berat</th><th>Transaksi</th><th>Total Nilai</th></tr></thead><tbody>' +
        rekapHtml + '</tbody></table>' +
        '<div class="footer"><p>Dicetak: ' + tglCetak + '</p><p>Dicetak oleh: ' + admin + '</p><p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p></div>' +
        '<div class="signature">' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Kepala Bank Sampah</p></div>' +
        '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Ketua RW</p></div>' +
        '</div>' +
        '</body></html>';
    
    var blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    var fileName = 'Laporan_Bank_Sampah_' + (jenisLaporan === 'mingguan' ? 'Mingguan' : (jenisLaporan === 'bulanan' ? 'Bulanan' : 'Tahunan')) + '_' + new Date().toISOString().slice(0,10) + '.doc';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function() { URL.revokeObjectURL(url); }, 100);
    
    showToast('Laporan berhasil diekspor ke Word', false);
}

function printLaporanLangusng() {
    var laporan = generateLaporanMingguan(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    exportFullPDF(laporan, 'mingguan');
}

function exportDataTamu() {
    var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    filteredData = filterDataWithSearch(filteredData, searchQuery || '');
    filteredData = filterDataWithDate(filteredData, dateStart || '', dateEnd || '');
    
    if (filteredData.length === 0) {
        showToast('Tidak ada data untuk diekspor!', true);
        return;
    }
    
    var headers = ['No', 'BSU', 'RW', 'RT', 'Nama Sampah', 'Jenis', 'Berat (kg)', 'Harga/Kg (Rp)', 'Total Nilai (Rp)'];
    var rows = [];
    
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        rows.push([
            i + 1,
            item.bsu || '-',
            item.rw,
            item.rt,
            '"' + item.nama + '"',
            item.jenis === 'organik' ? 'Organik' : 'Nonorganik',
            item.berat.toFixed(2),
            item.hargaPerKg,
            (item.berat * item.hargaPerKg).toFixed(2)
        ]);
    }
    
    var csvContent = headers.join(',') + '\n';
    for (var i = 0; i < rows.length; i++) {
        csvContent += rows[i].join(',') + '\n';
    }
    
    var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'Data_Sampah_' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logActivity('Export Data (Tamu)', 'Tamu mengekspor ' + filteredData.length + ' data');
    showToast('Data berhasil diekspor!', false);
}

function shareLaporan() {
    var laporan = generateLaporanMingguan(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    var message = '📊 *Laporan Bank Sampah Digital*\n' +
        'Periode: ' + laporan.periode + '\n' +
        'Total Organik: ' + laporan.totalOrganik.toFixed(2) + ' kg\n' +
        'Total Nonorganik: ' + laporan.totalNonorganik.toFixed(2) + ' kg\n' +
        'Total Semua: ' + laporan.totalBerat.toFixed(2) + ' kg\n' +
        'Total Nilai: ' + formatRupiah(laporan.totalNilai) + '\n' +
        'Jumlah Transaksi: ' + laporan.jumlahItem + '\n' +
        'Filter: ' + laporan.filterInfo + '\n' +
        '\n🏷️ Bank Sampah Digital - BSI Mandiri\n🌱 Kelola Sampah, Selamatkan Bumi';
    
    if (navigator.share) {
        navigator.share({
            title: 'Laporan Bank Sampah Digital',
            text: message,
        }).catch(function(err) {
            copyToClipboard(message);
        });
    } else {
        copyToClipboard(message);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Laporan disalin ke clipboard! Bisa di-paste ke WhatsApp/Email', false);
    }).catch(function() {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Laporan disalin ke clipboard!', false);
    });
}

// ==================== ACTIVITY LOG ====================
function logActivity(action, detail) {
    var logs = JSON.parse(localStorage.getItem('bankSampahLogs') || '[]');
    logs.unshift({
        timestamp: new Date().toISOString(),
        user: sessionStorage.getItem('username') || 'system',
        action: action,
        detail: detail || '-'
    });
    if (logs.length > 500) logs = logs.slice(0, 500);
    localStorage.setItem('bankSampahLogs', JSON.stringify(logs));
    renderActivityLogs();
}

function renderActivityLogs() {
    var logs = JSON.parse(localStorage.getItem('bankSampahLogs') || '[]');
    var container = document.getElementById('activityLogBody');
    var fullContainer = document.getElementById('fullActivityLogBody');
    var logCount = document.getElementById('logCount');
    
    if (logCount) logCount.textContent = 'Total: ' + logs.length + ' log';
    
    var html = '';
    var limit = 20;
    for (var i = 0; i < Math.min(logs.length, limit); i++) {
        var log = logs[i];
        var date = new Date(log.timestamp);
        var timeStr = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID');
        html += '<tr><td>' + timeStr + '</td><td>' + escapeHtml(log.user) + '</td><td>' + escapeHtml(log.action) + '</td><td>' + escapeHtml(log.detail) + '</td></tr>';
    }
    if (container) container.innerHTML = html || '<tr><td colspan="4" style="text-align:center;">Tidak ada aktivitas</td></tr>';
    
    var fullHtml = '';
    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var date = new Date(log.timestamp);
        var timeStr = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID');
        fullHtml += '<tr><td>' + timeStr + '</td><td>' + escapeHtml(log.user) + '</td><td>' + escapeHtml(log.action) + '</td><td>' + escapeHtml(log.detail) + '</td></tr>';
    }
    if (fullContainer) fullContainer.innerHTML = fullHtml || '<tr><td colspan="4" style="text-align:center;">Tidak ada aktivitas</td></tr>';
}

// ==================== BACKUP & RESTORE ====================
function backupData() {
    var data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        sampah: localStorage.getItem('bankSampahData'),
        users: localStorage.getItem('bankSampahUsers'),
        bsu: localStorage.getItem('bankSampahBSU'),
        logs: localStorage.getItem('bankSampahLogs')
    };
    
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'backup_bank_sampah_' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logActivity('Backup Data', 'Backup data berhasil');
    showToast('Backup berhasil!', false);
}

function restoreData(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            if (data.sampah) localStorage.setItem('bankSampahData', data.sampah);
            if (data.users) localStorage.setItem('bankSampahUsers', data.users);
            if (data.bsu) localStorage.setItem('bankSampahBSU', data.bsu);
            if (data.logs) localStorage.setItem('bankSampahLogs', data.logs);
            
            logActivity('Restore Data', 'Restore data dari backup ' + (data.timestamp || ''));
            showToast('Restore data berhasil! Halaman akan reload...', false);
            setTimeout(function() { location.reload(); }, 1500);
        } catch(err) {
            showToast('File backup tidak valid!', true);
        }
    };
    reader.readAsText(file);
}

// ==================== PRESET SAMPAH ====================
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

function renderPresetSampah() {
    var container = document.getElementById('presetSampahContainer');
    if (!container) return;
    
    var html = '<div style="margin-bottom: 8px;"><small style="color:#666;">📋 Klik untuk memilih nama sampah:</small></div>';
    html += '<div style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 200px; overflow-y: auto; padding: 8px;">';
    
    html += '<div style="width: 100%; margin-top: 4px;"><small style="color:#1565c0;">🥤 PLASTIK:</small></div>';
    for (var i = 0; i < presetSampah.plastik.length; i++) {
        html += '<button type="button" class="preset-btn preset-plastik" data-nama="' + escapeHtml(presetSampah.plastik[i]) + '" data-jenis="nonorganik" data-harga="' + (hargaSampahDetail[presetSampah.plastik[i]] || 2000) + '">' + (presetSampah.plastik[i].length > 30 ? presetSampah.plastik[i].substring(0, 27) + '...' : presetSampah.plastik[i]) + '</button>';
    }
    
    html += '<div style="width: 100%; margin-top: 8px;"><small style="color:#f9a825;">🔩 LOGAM:</small></div>';
    for (var i = 0; i < presetSampah.logam.length; i++) {
        html += '<button type="button" class="preset-btn preset-logam" data-nama="' + escapeHtml(presetSampah.logam[i]) + '" data-jenis="nonorganik" data-harga="' + (hargaSampahDetail[presetSampah.logam[i]] || 5000) + '">' + presetSampah.logam[i] + '</button>';
    }
    
    html += '<div style="width: 100%; margin-top: 8px;"><small style="color:#7b1fa2;">📄 KERTAS:</small></div>';
    for (var i = 0; i < presetSampah.kertas.length; i++) {
        html += '<button type="button" class="preset-btn preset-kertas" data-nama="' + escapeHtml(presetSampah.kertas[i]) + '" data-jenis="nonorganik" data-harga="' + (hargaSampahDetail[presetSampah.kertas[i]] || 1000) + '">' + presetSampah.kertas[i] + '</button>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    var presetBtns = container.querySelectorAll('.preset-btn');
    for (var i = 0; i < presetBtns.length; i++) {
        presetBtns[i].addEventListener('click', function() {
            var nama = this.getAttribute('data-nama');
            var jenis = this.getAttribute('data-jenis');
            var harga = parseInt(this.getAttribute('data-harga'));
            
            var namaInput = document.getElementById('namaSampah');
            var jenisInput = document.getElementById('jenisSampah');
            var hargaInput = document.getElementById('hargaSampah');
            
            if (namaInput) namaInput.value = nama;
            if (jenisInput) jenisInput.value = jenis;
            
            var typeOptions = document.querySelectorAll('.type-option');
            for (var j = 0; j < typeOptions.length; j++) {
                typeOptions[j].classList.remove('active');
                if (typeOptions[j].getAttribute('data-type') === jenis) {
                    typeOptions[j].classList.add('active');
                }
            }
            
            if (hargaInput && harga) {
                hargaInput.value = harga;
            }
            
            showToast('Nama sampah "' + (nama.length > 40 ? nama.substring(0, 37) + '...' : nama) + '" dipilih', false);
        });
    }
}

function setupAutoHarga() {
    var namaInput = document.getElementById('namaSampah');
    var typeOptions = document.querySelectorAll('.type-option');
    var hargaInput = document.getElementById('hargaSampah');
    
    if (namaInput) {
        namaInput.addEventListener('input', function() {
            var hargaOtomatisValue = getHargaByNamaSampah(this.value);
            if (hargaInput && hargaOtomatisValue) {
                hargaInput.value = hargaOtomatisValue;
            }
        });
    }
    
    for (var i = 0; i < typeOptions.length; i++) {
        typeOptions[i].addEventListener('click', function() {
            var nama = namaInput ? namaInput.value : '';
            var hargaOtomatisValue = getHargaByNamaSampah(nama);
            if (hargaInput && hargaOtomatisValue) {
                hargaInput.value = hargaOtomatisValue;
            }
        });
    }
    
    populateSampahDatalist();
    renderPresetSampah();
}

// ==================== SETUP FILTERS ====================
function setupFilters() {
    var filterBSU = document.getElementById('filterBSU');
    var filterRW = document.getElementById('filterRW');
    var filterRT = document.getElementById('filterRT');
    var statFilterBSU = document.getElementById('statFilterBSU');
    var statFilterRW = document.getElementById('statFilterRW');
    var statFilterRT = document.getElementById('statFilterRT');
    var statFilterJenis = document.getElementById('statFilterJenisSampah');
    var jenisChartBSU = document.getElementById('jenisChartBSUFilter');
    var namaChartBSU = document.getElementById('namaChartBSUFilter');
    
    if (filterBSU) {
        filterBSU.addEventListener('change', function(e) {
            currentFilterBSU = e.target.value;
            refreshAll();
        });
    }
    
    if (filterRW) {
        filterRW.addEventListener('change', function(e) {
            currentFilterRW = e.target.value;
            refreshAll();
        });
    }
    
    if (filterRT) {
        filterRT.addEventListener('change', function(e) {
            currentFilterRT = e.target.value;
            refreshAll();
        });
    }
    
    if (statFilterBSU) {
        statFilterBSU.addEventListener('change', function(e) {
            currentStatFilterBSU = e.target.value;
            updateStatistikPage();
        });
    }
    
    if (statFilterRW) {
        statFilterRW.addEventListener('change', function(e) {
            currentStatFilterRW = e.target.value;
            updateStatistikPage();
        });
    }
    
    if (statFilterRT) {
        statFilterRT.addEventListener('change', function(e) {
            currentStatFilterRT = e.target.value;
            updateStatistikPage();
        });
    }
    
    if (statFilterJenis) {
        statFilterJenis.addEventListener('change', function(e) {
            currentStatFilterJenis = e.target.value;
            updateStatistikPage();
        });
    }
    
    if (jenisChartBSU) {
        jenisChartBSU.addEventListener('change', function() {
            updateJenisSampahChart();
        });
    }
    
    if (namaChartBSU) {
        namaChartBSU.addEventListener('change', function() {
            updateNamaSampahChart();
        });
    }
}

// ==================== SETUP LAPORAN MODAL ====================
function setupLaporanModal() {
    var modal = document.getElementById('laporanModal');
    var modalPeriode = document.getElementById('modalPeriode');
    var modalFilterInfo = document.getElementById('modalFilterInfo');
    var exportPDFBtn = document.getElementById('exportPDFBtn');
    var exportWordBtn = document.getElementById('exportWordBtn');
    var closeBtn = document.querySelector('.modal-close');
    var btnMingguan = document.getElementById('btnLaporanMingguan');
    var btnBulanan = document.getElementById('btnLaporanBulanan');
    var btnTahunan = document.getElementById('btnLaporanTahunan');
    
    var currentLaporan = null;
    var currentJenis = null;
    
    function showModal(laporan, jenis) {
        currentLaporan = laporan;
        currentJenis = jenis;
        if (modalPeriode) modalPeriode.innerHTML = '<strong>Periode:</strong> ' + laporan.periode;
        if (modalFilterInfo) modalFilterInfo.innerHTML = '<strong>Filter:</strong> ' + laporan.filterInfo;
        modal.style.display = 'block';
    }
    
    if (btnMingguan) {
        btnMingguan.addEventListener('click', function() {
            var laporan = generateLaporanMingguan(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
            showModal(laporan, 'mingguan');
        });
    }
    
    if (btnBulanan) {
        btnBulanan.addEventListener('click', function() {
            var laporan = generateLaporanBulanan(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
            showModal(laporan, 'bulanan');
        });
    }
    
    if (btnTahunan) {
        btnTahunan.addEventListener('click', function() {
            var laporan = generateLaporanTahunan(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
            showModal(laporan, 'tahunan');
        });
    }
    
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', function() {
            if (currentLaporan) {
                exportFullPDF(currentLaporan, currentJenis);
                modal.style.display = 'none';
            }
        });
    }
    
    if (exportWordBtn) {
        exportWordBtn.addEventListener('click', function() {
            if (currentLaporan) {
                exportFullWord(currentLaporan, currentJenis);
                modal.style.display = 'none';
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ==================== SETUP FAB ====================
function setupFAB() {
    var fab = document.getElementById('fabBtn');
    if (!fab) return;
    
    function toggleFAB() {
        var kelolaPage = document.getElementById('kelolaPage');
        if (kelolaPage && kelolaPage.classList.contains('active') && isAdmin) {
            fab.classList.add('show');
        } else {
            fab.classList.remove('show');
        }
    }
    
    fab.addEventListener('click', function() {
        if (isAdmin) {
            var form = document.getElementById('formTambahData');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('namaSampah').focus();
            }
        } else {
            showToast('Hanya Admin yang dapat menambah data!', true);
        }
    });
    
    var navItems = document.querySelectorAll('.menu-item, .nav-bot-item');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function() {
            setTimeout(toggleFAB, 100);
        });
    }
    toggleFAB();
}

// ==================== SETUP SIDEBAR ====================
function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var menuToggle = document.getElementById('menuToggle');
    
    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function toggleSidebar() {
        if (sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    var touchStartX = 0;
    var touchEndX = 0;
    var touchStartTime = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = new Date().getTime();
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var touchDuration = new Date().getTime() - touchStartTime;
        var swipeDistance = touchEndX - touchStartX;
        
        if (touchStartX < 50 && swipeDistance > 70 && touchDuration < 300) {
            if (sidebar && !sidebar.classList.contains('open')) {
                openSidebar();
            }
        }
        
        if (sidebar && sidebar.classList.contains('open') && swipeDistance < -50) {
            closeSidebar();
        }
        
        touchStartX = 0;
        touchEndX = 0;
    }, false);
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

// ==================== APPLY ROLE UI ====================
function applyRoleBasedUI() {
    var roleDisplay = document.getElementById('roleDisplay');
    var roleBadge = document.getElementById('roleBadge');
    var roleWelcomeText = document.getElementById('roleWelcomeText');
    var kelolaSubtext = document.getElementById('kelolaSubtext');
    var formTambahData = document.getElementById('formTambahData');
    var formTamuInput = document.getElementById('formTamuInput');
    var laporanTahunanBSU = document.getElementById('laporanTahunanBSU');
    var bukuTabunganCard = document.getElementById('bukuTabunganCard');
    
    var menuVerifikasi = document.getElementById('menuVerifikasi');
    var menuLaporan = document.getElementById('menuLaporan');
    
    if (roleDisplay) {
        if (isAdmin) {
            roleDisplay.innerHTML = ' Admin (Akses Penuh)';
            roleDisplay.style.color = '#2e7d32';
        } else {
            roleDisplay.innerHTML = ' Tamu (Hanya Lihat)';
            roleDisplay.style.color = '#f9a825';
        }
    }
    
    if (roleBadge) {
        if (isAdmin) {
            roleBadge.innerHTML = ' Admin';
            roleBadge.style.background = 'rgba(46,125,50,0.15)';
            roleBadge.style.color = '#2e7d32';
        } else {
            roleBadge.innerHTML = ' Tamu';
            roleBadge.style.background = 'rgba(249,168,37,0.15)';
            roleBadge.style.color = '#f9a825';
        }
    }
    
    if (roleWelcomeText) {
        if (isAdmin) {
            roleWelcomeText.innerHTML = ' Anda login sebagai <strong>Administrator</strong> dengan akses penuh';
        } else {
            roleWelcomeText.innerHTML = ' Anda login sebagai <strong>Tamu</strong> - hanya dapat melihat data';
        }
    }
    
    if (kelolaSubtext) {
        if (isAdmin) {
            kelolaSubtext.innerHTML = 'Tambah, edit, atau hapus data sampah';
        } else {
            kelolaSubtext.innerHTML = ' Mode Tamu - Anda hanya dapat melihat data sampah';
        }
    }
    
    if (formTambahData) {
        formTambahData.style.display = isAdmin ? 'block' : 'none';
    }
    
    if (formTamuInput) {
        formTamuInput.style.display = isAdmin ? 'none' : 'block';
    }
    
    if (laporanTahunanBSU) {
        laporanTahunanBSU.style.display = isAdmin ? 'block' : 'none';
    }
    
    if (bukuTabunganCard) {
        bukuTabunganCard.style.display = isAdmin ? 'block' : 'none';
    }
    
    if (menuVerifikasi) {
        menuVerifikasi.style.display = isAdmin ? 'flex' : 'none';
    }
    if (menuLaporan) {
        menuLaporan.style.display = isAdmin ? 'flex' : 'none';
    }
    
    var menuKelolaTamu = document.getElementById('menuKelolaTamu');
    if (menuKelolaTamu) {
        menuKelolaTamu.style.display = isAdmin ? 'flex' : 'none';
    }
    
    var navKelolaTamu = document.getElementById('navKelolaTamu');
    if (navKelolaTamu) {
        navKelolaTamu.style.display = isAdmin ? 'flex' : 'none';
    }
}

// ==================== REFRESH ALL ====================
function refreshAll() {
    updateStats();
    updateStatistikPage();
    renderDataList();
    updateDataCount();
    updateSummaryCards();
    updateRanking();
    updateAdvancedMetrics();
    updateTrenChart();
    updateWilayahVisualization();
    getNearestBSU();
    updateTamuDashboard();
    renderActivityLogs();
}

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    // Ambil semua menu items
    var menuItems = document.querySelectorAll('.menu-item, .nav-bot-item');
    
    for (var i = 0; i < menuItems.length; i++) {
        // HAPUS listener lama dengan clone (mencegah duplikasi)
        var newEl = menuItems[i].cloneNode(true);
        menuItems[i].parentNode.replaceChild(newEl, menuItems[i]);
        
        // TAMBAHKAN listener baru
        newEl.addEventListener('click', function(e) {
            e.preventDefault();
            var page = this.getAttribute('data-page');
            
            if (page && page !== 'keluar') {
                // CEK AKSES - SEMUA halaman admin
                var adminPages = ['kelola', 'verifikasi', 'laporan', 'bsu', 'nasabah', 'user'];
                if (adminPages.indexOf(page) !== -1 && !isAdmin) {
                    showToast('Hanya Admin yang dapat mengakses halaman ini!', true);
                    return;
                }
                
                // Navigasi
                navigateTo(page);
            }
        });
    }
    
    var tambahBtn = document.getElementById('tambahSampahBtn');
    if (tambahBtn) {
        tambahBtn.addEventListener('click', window.tambahSampah);
    }
    
    var tambahTamuBtn = document.getElementById('tambahTamuBtn');
    if (tambahTamuBtn) {
        tambahTamuBtn.addEventListener('click', window.tambahDataTamu);
    }
    
    var filterJenis = document.getElementById('filterJenis');
    if (filterJenis) {
        filterJenis.addEventListener('change', function(e) {
            currentFilter = e.target.value;
            renderDataList();
        });
    }
    
    var typeOptions = document.querySelectorAll('.type-option');
    for (var i = 0; i < typeOptions.length; i++) {
        typeOptions[i].addEventListener('click', function() {
            for (var j = 0; j < typeOptions.length; j++) {
                typeOptions[j].classList.remove('active');
            }
            this.classList.add('active');
            currentType = this.getAttribute('data-type');
            var jenisInput = document.getElementById('jenisSampah');
            if (jenisInput) jenisInput.value = currentType;
        });
    }
    
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('adminName');
            sessionStorage.removeItem('username');
            window.location.href = 'menu_login.html';
        });
    }
    
    var logoutMobileBtn = document.getElementById('logoutMobileBtn');
    if (logoutMobileBtn) {
        logoutMobileBtn.addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('adminName');
            sessionStorage.removeItem('username');
            window.location.href = 'menu_login.html';
        });
    }
    
    var bsuSearchInput = document.getElementById('bsuSearchInput');
    if (bsuSearchInput) {
        bsuSearchInput.addEventListener('input', function(e) {
            renderBSUList(e.target.value);
        });
    }
    
    var clearBsuBtn = document.getElementById('clearBsuBtn');
    if (clearBsuBtn) {
        clearBsuBtn.addEventListener('click', clearSelectedBSU);
    }
    
    var searchInput = document.getElementById('searchDataInput');
    var searchClear = document.getElementById('searchClearBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value;
            if (searchClear) {
                searchClear.classList.toggle('show', this.value.length > 0);
            }
            renderDataList();
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                searchQuery = '';
                if (searchClear) searchClear.classList.remove('show');
                renderDataList();
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                this.classList.remove('show');
                renderDataList();
                searchInput.focus();
            }
        });
    }
    
    var dateStartInput = document.getElementById('filterDateStart');
    var dateEndInput = document.getElementById('filterDateEnd');
    var applyDateBtn = document.getElementById('applyDateFilter');
    var clearDateBtn = document.getElementById('clearDateFilter');
    
    if (applyDateBtn) {
        applyDateBtn.addEventListener('click', function() {
            dateStart = dateStartInput ? dateStartInput.value : '';
            dateEnd = dateEndInput ? dateEndInput.value : '';
            renderDataList();
            if (dateStart || dateEnd) {
                showToast('Filter tanggal diterapkan', false);
            }
        });
    }
    
    if (clearDateBtn) {
        clearDateBtn.addEventListener('click', function() {
            if (dateStartInput) dateStartInput.value = '';
            if (dateEndInput) dateEndInput.value = '';
            dateStart = '';
            dateEnd = '';
            renderDataList();
            showToast('Filter tanggal direset', false);
        });
    }
    
    var exportExcelBtn = document.getElementById('exportExcelBtn');
    var exportCSVBtn = document.getElementById('exportCSVBtn');
    var exportTamuBtn = document.getElementById('exportTamuBtn');
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportDataTamu);
    }
    
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportDataTamu);
    }
    
    if (exportTamuBtn) {
        exportTamuBtn.addEventListener('click', exportDataTamu);
    }
    
    var shareBtn = document.getElementById('shareLaporanBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareLaporan);
    }
    
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen();
        });
    }
    
    var presentationBtn = document.getElementById('presentationBtn');
    if (presentationBtn) {
        presentationBtn.addEventListener('click', function() {
            togglePresentationMode();
        });
    }
    
    var backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', backupData);
    }
    
    var restoreInput = document.getElementById('restoreInput');
    if (restoreInput) {
        restoreInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                restoreData(this.files[0]);
            }
        });
    }
    
    var printBtn = document.getElementById('btnPrintLaporan');
    if (printBtn) {
        printBtn.addEventListener('click', printLaporanLangusng);
    }
    
    var clearLogsBtn = document.getElementById('clearLogsBtn');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', function() {
            showConfirm('Hapus Log', 'Yakin ingin menghapus semua log aktivitas?', function() {
                localStorage.removeItem('bankSampahLogs');
                renderActivityLogs();
                showToast('Log aktivitas berhasil dihapus', false);
                logActivity('Hapus Log', 'Menghapus semua log aktivitas');
            });
        });
    }
    
    var genLaporanBtn = document.getElementById('generateLaporanBSUBtn');
    if (genLaporanBtn) {
        genLaporanBtn.addEventListener('click', function() {
            var bsu = document.getElementById('laporanBSUFilter').value;
            var tahun = parseInt(document.getElementById('laporanTahunFilter').value);
            renderLaporanTahunanBSU('laporanBSUContainer', bsu, tahun);
        });
    }
    
    var genLaporanBtn2 = document.getElementById('generateLaporanBSUBtn2');
    if (genLaporanBtn2) {
        genLaporanBtn2.addEventListener('click', function() {
            var bsu = document.getElementById('laporanBSUFilter2').value;
            var tahun = parseInt(document.getElementById('laporanTahunFilter2').value);
            renderLaporanTahunanBSU('laporanBSUContainer2', bsu, tahun);
        });
    }
    
    var genTabunganBtn = document.getElementById('generateTabunganBtn');
    if (genTabunganBtn) {
        genTabunganBtn.addEventListener('click', function() {
            var bsu = document.getElementById('tabunganBSUFilter').value;
            renderBukuTabungan('tabunganContainer', bsu);
        });
    }
    
    var genTabunganBtn2 = document.getElementById('generateTabunganBtn2');
    if (genTabunganBtn2) {
        genTabunganBtn2.addEventListener('click', function() {
            var bsu = document.getElementById('tabunganBSUFilter2').value;
            renderBukuTabungan('tabunganContainer2', bsu);
        });
    }
    
    var exportTabunganBtn = document.getElementById('exportTabunganBtn');
    if (exportTabunganBtn) {
        exportTabunganBtn.addEventListener('click', function() {
            var bsu = document.getElementById('tabunganBSUFilter').value;
            exportTabunganExcel(bsu);
        });
    }
    
    var exportTabunganBtn2 = document.getElementById('exportTabunganBtn2');
    if (exportTabunganBtn2) {
        exportTabunganBtn2.addEventListener('click', function() {
            var bsu = document.getElementById('tabunganBSUFilter2').value;
            exportTabunganExcel(bsu);
        });
    }
}

// ==================== FULLSCREEN & PRESENTATION ====================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(err) {
            showToast('Fullscreen tidak didukung', true);
        });
        showToast('Mode Fullscreen aktif', false);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            showToast('Keluar dari Fullscreen', false);
        }
    }
}

function togglePresentationMode() {
    var body = document.body;
    body.classList.toggle('presentation-mode');
    
    if (body.classList.contains('presentation-mode')) {
        showToast('📽️ Mode Presentasi aktif - Font lebih besar', false);
        document.querySelectorAll('.data-table, .stat-card, .summary-card, .ranking-card').forEach(function(el) {
            el.style.fontSize = '1.1rem';
        });
    } else {
        document.querySelectorAll('.data-table, .stat-card, .summary-card, .ranking-card').forEach(function(el) {
            el.style.fontSize = '';
        });
        showToast('Mode Presentasi dinonaktifkan', false);
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (isAdmin && document.getElementById('kelolaPage').classList.contains('active')) {
                window.tambahSampah();
            } else if (isAdmin) {
                navigateTo('kelola');
                setTimeout(function() {
                    document.getElementById('namaSampah').focus();
                }, 300);
            }
        }
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            var searchInput2 = document.querySelector('.bsu-search input');
            if (searchInput2) {
                searchInput2.focus();
                searchInput2.select();
            }
        }
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            var laporan = generateLaporanMingguan(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
            exportFullPDF(laporan, 'mingguan');
        }
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportDataTamu();
        }
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        if (e.key === 'Escape') {
            var modals = document.querySelectorAll('.modal');
            for (var i = 0; i < modals.length; i++) {
                modals[i].style.display = 'none';
            }
        }
    });
}

// ==================== INISIALISASI ULANG ====================
// Hapus duplikasi inisialisasi, gabungkan semua

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing admin with all features...');
    
    // 1. Set nama admin
    var adminName = sessionStorage.getItem('adminName') || 'Admin';
    var adminNameSpan = document.getElementById('adminName');
    var welcomeNameSpan = document.getElementById('welcomeName');
    if (adminNameSpan) adminNameSpan.innerText = adminName;
    if (welcomeNameSpan) welcomeNameSpan.innerText = adminName;
    
    // 2. Inisialisasi sidebar
    initSidebar();
    
    // 3. Load data BSU dari localStorage
    loadBSUData();
    
    // 4. Render BSU list di kelola
    renderBSUList('');
    
    // 5. Setup auto harga
    setupAutoHarga();
    
    // 6. Setup filters
    setupFilters();
    
    // 7. Setup laporan modal
    setupLaporanModal();
    
    // 8. Setup FAB
    setupFAB();
    
    // 9. Setup event listeners utama
    setupEventListeners();
    
    // 10. Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // 11. Load data dari localStorage
    loadDataFromLocal();
    
    // 12. Apply role UI
    applyRoleBasedUI();
    
    // 13. Setup upload foto (untuk tamu)
    setupUploadFoto();
    setUserBSUForTamu();
    
    // 14. Setup data tamu
    loadTamuDataFromLocal();
    
    // 15. RENDER SEMUA HALAMAN MANAJEMEN
    renderBSUTable();          // Halaman BSU
    renderUserTable();         // Halaman User
    renderAdminNasabah('', 'all'); // Halaman Nasabah
    renderVerifikasiTableWithMassal(); // Halaman Verifikasi dengan massal
    
    // 16. Populate semua filter
    populateUserBSUFilter();
    populateLogFilters();
    populateBSUFiltersAdmin();
    populateBSUFilters();
    
    // 17. Update badges
    updateNasabahBadge();
    updateLogBadge();
    updateBSUBadge();
    updateVerifikasiBadge();
    
    // 18. Render Top BSU di dashboard
    renderTopBSU();
    
    // 19. Setup additional event listeners (manajemen)
    setupAdditionalEventListeners();
    
    // 20. Log aktivitas login
    logActivity('Login', 'User ' + sessionStorage.getItem('username') + ' login');
    
    // 21. Auto refresh setiap 30 detik
    setInterval(function() {
        loadDataFromLocal();
        loadTamuDataFromLocal();
        // Update halaman yang aktif
        var activePage = document.querySelector('.page.active');
        if (activePage) {
            var id = activePage.id;
            if (id === 'bsuPage') renderBSUTable();
            else if (id === 'nasabahPage') renderAdminNasabah('', 'all');
            else if (id === 'userPage') renderUserTable();
            else if (id === 'verifikasiPage') renderVerifikasiTableWithMassal();
        }
        updateVerifikasiBadge();
    }, 30000);
    
    console.log('Admin initialization complete. User role:', userRole);
});

// =====================================================
// ADMIN SCRIPT - TAMBAHAN FUNGSI MANAJEMEN
// =====================================================

// ==================== MANAJEMEN BSU ====================

// Data BSU disimpan di localStorage
var BSU_STORAGE_KEY = 'bankSampahBSU';

function loadBSUData() {
    var stored = localStorage.getItem(BSU_STORAGE_KEY);
    if (stored) {
        try {
            dataBSU = JSON.parse(stored);
            return dataBSU;
        } catch(e) {
            dataBSU = getDefaultBSU();
        }
    } else {
        dataBSU = getDefaultBSU();
        saveBSUData();
    }
    return dataBSU;
}

function getDefaultBSU() {
    return [
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
}

function saveBSUData() {
    localStorage.setItem(BSU_STORAGE_KEY, JSON.stringify(dataBSU));
}

function renderBSUTable() {
    var container = document.getElementById('bsuTableBody');
    var count = document.getElementById('bsuListCount');
    if (!container) return;
    
    if (count) count.textContent = 'Total: ' + dataBSU.length + ' BSU';
    
    if (dataBSU.length === 0) {
        container.innerHTML = '<tr><td colspan="8" style="text-align:center;">Tidak ada BSU</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < dataBSU.length; i++) {
        var bsu = dataBSU[i];
        // Hitung statistik
        var stats = getBSUStats(bsu.nama);
        
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td><strong>' + escapeHtml(bsu.nama) + '</strong></td>' +
            '<td>' + bsu.rw + '</td>' +
            '<td>' + (bsu.rt === 'all' ? 'Semua RT' : bsu.rt) + '</td>' +
            '<td>' + escapeHtml(bsu.ketua || '-') + '</td>' +
            '<td>' + stats.count + '</td>' +
            '<td>' + stats.berat.toFixed(2) + ' kg</td>' +
            '<td>' +
                '<button class="btn-edit-bsu" onclick="editBSU(\'' + bsu.nama + '\')" style="padding:4px 10px;background:#f9a825;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;margin-right:4px;">✏️</button>' +
                '<button class="btn-delete-bsu" onclick="deleteBSU(\'' + bsu.nama + '\')" style="padding:4px 10px;background:#ef5350;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;">🗑️</button>' +
            '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

function getBSUStats(bsuNama) {
    var filtered = daftarSampah.filter(function(item) {
        return item.bsu === bsuNama;
    });
    var berat = 0;
    for (var i = 0; i < filtered.length; i++) {
        berat += filtered[i].berat;
    }
    return { count: filtered.length, berat: berat };
}

window.tambahBSU = function() {
    var nama = document.getElementById('bsuNamaInput').value.trim();
    var rw = document.getElementById('bsuRWInput').value;
    var rt = document.getElementById('bsuRTInput').value;
    var ketua = document.getElementById('bsuKetuaInput').value.trim();
    
    if (!nama) {
        showToast('Nama BSU wajib diisi!', true);
        return;
    }
    
    // Cek duplikat
    for (var i = 0; i < dataBSU.length; i++) {
        if (dataBSU[i].nama === nama) {
            showToast('BSU dengan nama tersebut sudah ada!', true);
            return;
        }
    }
    
    dataBSU.push({ nama: nama, rw: rw, rt: rt, ketua: ketua || '-' });
    saveBSUData();
    renderBSUTable();
    populateBSUFilters();
    renderBSUList('');
    
    document.getElementById('bsuNamaInput').value = '';
    document.getElementById('bsuKetuaInput').value = '';
    
    showToast('BSU ' + nama + ' berhasil ditambahkan!', false);
    logActivity('Tambah BSU', 'Menambah BSU: ' + nama);
};

window.editBSU = function(namaLama) {
    var bsu = null;
    for (var i = 0; i < dataBSU.length; i++) {
        if (dataBSU[i].nama === namaLama) {
            bsu = dataBSU[i];
            break;
        }
    }
    if (!bsu) {
        showToast('BSU tidak ditemukan!', true);
        return;
    }
    
    var namaBaru = prompt('Nama BSU:', bsu.nama);
    if (!namaBaru) return;
    var rwBaru = prompt('RW:', bsu.rw);
    if (!rwBaru) return;
    var rtBaru = prompt('RT:', bsu.rt);
    if (!rtBaru) return;
    var ketuaBaru = prompt('Ketua BSU:', bsu.ketua || '');
    
    // Cek duplikat jika nama berubah
    if (namaBaru !== namaLama) {
        for (var i = 0; i < dataBSU.length; i++) {
            if (dataBSU[i].nama === namaBaru) {
                showToast('BSU dengan nama tersebut sudah ada!', true);
                return;
            }
        }
        // Update nama di data sampah
        for (var j = 0; j < daftarSampah.length; j++) {
            if (daftarSampah[j].bsu === namaLama) {
                daftarSampah[j].bsu = namaBaru;
            }
        }
        saveDataToLocal();
    }
    
    bsu.nama = namaBaru;
    bsu.rw = rwBaru;
    bsu.rt = rtBaru;
    bsu.ketua = ketuaBaru || '-';
    
    saveBSUData();
    renderBSUTable();
    populateBSUFilters();
    renderBSUList('');
    refreshAll();
    
    showToast('BSU berhasil diupdate!', false);
    logActivity('Edit BSU', 'Mengedit BSU: ' + namaBaru);
};

window.deleteBSU = function(nama) {
    showConfirm('Hapus BSU', 'Yakin ingin menghapus BSU "' + nama + '"? Data yang terkait akan tetap ada.', function() {
        var newArray = [];
        for (var i = 0; i < dataBSU.length; i++) {
            if (dataBSU[i].nama !== nama) {
                newArray.push(dataBSU[i]);
            }
        }
        dataBSU = newArray;
        saveBSUData();
        renderBSUTable();
        populateBSUFilters();
        renderBSUList('');
        refreshAll();
        showToast('BSU berhasil dihapus!', false);
        logActivity('Hapus BSU', 'Menghapus BSU: ' + nama);
    });
};

// ==================== MANAJEMEN NASABAH ====================

function getNasabahUnikAdmin(bsuFilter) {
    var nasabahMap = {};
    
    for (var i = 0; i < daftarSampah.length; i++) {
        var item = daftarSampah[i];
        var nama = item.namaNasabah || '-';
        if (nama !== '-' && nama !== 'undefined' && nama !== 'null') {
            if (bsuFilter && bsuFilter !== 'all') {
                if (item.bsu !== bsuFilter) continue;
            }
            if (!nasabahMap[nama]) {
                nasabahMap[nama] = {
                    nama: nama,
                    totalBerat: 0,
                    totalNilai: 0,
                    totalTransaksi: 0,
                    bsu: item.bsu || '-'
                };
            }
            var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
            var nilai = item.berat * harga;
            nasabahMap[nama].totalBerat += item.berat;
            nasabahMap[nama].totalNilai += nilai;
            nasabahMap[nama].totalTransaksi++;
        }
    }
    
    var result = Object.values(nasabahMap);
    result.sort(function(a, b) { return b.totalNilai - a.totalNilai; });
    return result;
}

function renderAdminNasabah(searchTerm, bsuFilter) {
    var container = document.getElementById('adminNasabahBody');
    var count = document.getElementById('adminNasabahCount');
    if (!container) return;
    
    var nasabahList = getNasabahUnikAdmin(bsuFilter);
    
    if (searchTerm) {
        var term = searchTerm.toLowerCase();
        nasabahList = nasabahList.filter(function(n) {
            return n.nama.toLowerCase().includes(term);
        });
    }
    
    if (count) count.textContent = 'Total: ' + nasabahList.length + ' nasabah';
    
    if (nasabahList.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;">Tidak ada nasabah</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < nasabahList.length; i++) {
        var n = nasabahList[i];
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td><strong>' + escapeHtml(n.nama) + '</strong></td>' +
            '<td>' + escapeHtml(n.bsu) + '</td>' +
            '<td>' + n.totalBerat.toFixed(2) + ' kg</td>' +
            '<td>' + n.totalTransaksi + '</td>' +
            '<td class="nasabah-total-value">' + formatRupiah(n.totalNilai) + '</td>' +
            '<td><button onclick="lihatDetailNasabah(\'' + escapeHtml(n.nama) + '\')" style="padding:4px 12px;background:#0d6efd;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;">👁 Detail</button></td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

window.lihatDetailNasabah = function(nama) {
    var modal = document.getElementById('detailNasabahModal');
    var body = document.getElementById('detailNasabahBody');
    if (!modal || !body) return;
    
    // Cari semua transaksi nasabah
    var transaksi = [];
    var totalNilai = 0;
    for (var i = 0; i < daftarSampah.length; i++) {
        var item = daftarSampah[i];
        if (item.namaNasabah === nama) {
            var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
            var nilai = item.berat * harga;
            totalNilai += nilai;
            transaksi.push({
                tanggal: item.tanggal || '-',
                nama: item.nama,
                bsu: item.bsu || '-',
                rw: item.rw || '-',
                rt: item.rt || '-',
                berat: item.berat,
                hargaPerKg: harga,
                nilai: nilai
            });
        }
    }
    
    transaksi.sort(function(a, b) {
        return new Date(a.tanggal) - new Date(b.tanggal);
    });
    
    var html = '<div style="margin-bottom:16px;">' +
        '<h3 style="color:var(--primary);">' + escapeHtml(nama) + '</h3>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;">Total Transaksi: ' + transaksi.length + ' | Total Nilai: ' + formatRupiah(totalNilai) + '</p>' +
        '</div>';
    
    if (transaksi.length === 0) {
        html += '<p style="text-align:center;color:var(--text-muted);">Tidak ada transaksi</p>';
    } else {
        html += '<div style="overflow-x:auto;"><table class="data-table" style="font-size:0.8rem;">' +
            '<thead><tr><th>Tanggal</th><th>Nama Sampah</th><th>BSU</th><th>RW/RT</th><th>Berat</th><th>Harga</th><th>Nilai</th></tr></thead><tbody>';
        
        for (var i = 0; i < transaksi.length; i++) {
            var t = transaksi[i];
            var tgl = t.tanggal ? formatTanggalIndo(t.tanggal) : '-';
            html += '<tr>' +
                '<td>' + tgl + '</td>' +
                '<td>' + escapeHtml(t.nama) + '</td>' +
                '<td>' + escapeHtml(t.bsu) + '</td>' +
                '<td>' + escapeHtml(t.rw) + ' - ' + escapeHtml(t.rt) + '</td>' +
                '<td>' + t.berat.toFixed(2) + ' kg</td>' +
                '<td>' + formatRupiah(t.hargaPerKg) + '</td>' +
                '<td class="nasabah-total-value">' + formatRupiah(t.nilai) + '</td>' +
                '</tr>';
        }
        
        html += '</tbody></table></div>';
    }
    
    body.innerHTML = html;
    modal.style.display = 'block';
};

function closeDetailNasabah() {
    document.getElementById('detailNasabahModal').style.display = 'none';
}

// ==================== MANAJEMEN USER ====================

var USERS_STORAGE_KEY = 'bankSampahUsers';

function loadUsersData() {
    var stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch(e) {
            return getDefaultUsers();
        }
    }
    return getDefaultUsers();
}

function getDefaultUsers() {
    var users = [
        { username: 'admin', password: 'admin123', nama: 'Administrator', role: 'admin', bsuId: null, bsuNama: null, bsuRW: null, bsuRT: null }
    ];
    for (var i = 0; i < dataBSU.length; i++) {
        var bsu = dataBSU[i];
        var usernameBSU = bsu.nama.toLowerCase().replace(/ /g, '_');
        users.push({
            username: usernameBSU,
            password: 'bsu123',
            nama: bsu.ketua || 'Ketua BSU',
            role: 'tamu',
            bsuId: 'bsu_' + bsu.nama.toLowerCase().replace(/ /g, '_'),
            bsuNama: bsu.nama,
            bsuRW: bsu.rw,
            bsuRT: bsu.rt
        });
    }
    return users;
}

function saveUsersData(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function renderUserTable() {
    var container = document.getElementById('userTableBody');
    var count = document.getElementById('userListCount');
    if (!container) return;
    
    var users = loadUsersData();
    
    if (count) count.textContent = 'Total: ' + users.length + ' user';
    
    if (users.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;">Tidak ada user</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var roleLabel = user.role === 'admin' ? '👑 Admin' : '👤 BSU';
        var bsuLabel = user.bsuNama || '-';
        var rwrtLabel = user.bsuRW ? user.bsuRW + ' - ' + (user.bsuRT || 'all') : '-';
        
        html += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td><strong>' + escapeHtml(user.username) + '</strong></td>' +
            '<td>' + escapeHtml(user.nama || '-') + '</td>' +
            '<td>' + roleLabel + '</td>' +
            '<td>' + escapeHtml(bsuLabel) + '</td>' +
            '<td>' + rwrtLabel + '</td>' +
            '<td>' +
                '<button onclick="resetPasswordUser(\'' + escapeHtml(user.username) + '\')" style="padding:4px 10px;background:#f9a825;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;margin-right:4px;">🔑</button>' +
                '<button onclick="deleteUser(\'' + escapeHtml(user.username) + '\')" style="padding:4px 10px;background:#ef5350;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;">🗑️</button>' +
            '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

window.tambahUser = function() {
    var username = document.getElementById('userUsernameInput').value.trim();
    var password = document.getElementById('userPasswordInput').value.trim();
    var role = document.getElementById('userRoleInput').value;
    var bsuNama = document.getElementById('userBSUInput').value;
    var nama = document.getElementById('userNamaInput').value.trim();
    
    if (!username) {
        showToast('Username wajib diisi!', true);
        return;
    }
    if (!password) {
        showToast('Password wajib diisi!', true);
        return;
    }
    if (role === 'tamu' && !bsuNama) {
        showToast('Pilih BSU untuk role Tamu!', true);
        return;
    }
    
    var users = loadUsersData();
    
    // Cek duplikat
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            showToast('Username sudah digunakan!', true);
            return;
        }
    }
    
    var bsuData = null;
    if (bsuNama) {
        for (var i = 0; i < dataBSU.length; i++) {
            if (dataBSU[i].nama === bsuNama) {
                bsuData = dataBSU[i];
                break;
            }
        }
    }
    
    users.push({
        username: username,
        password: password,
        nama: nama || (bsuData ? bsuData.ketua : 'User'),
        role: role,
        bsuId: bsuData ? 'bsu_' + bsuData.nama.toLowerCase().replace(/ /g, '_') : null,
        bsuNama: bsuData ? bsuData.nama : null,
        bsuRW: bsuData ? bsuData.rw : null,
        bsuRT: bsuData ? bsuData.rt : null
    });
    
    saveUsersData(users);
    renderUserTable();
    populateUserBSUFilter();
    
    document.getElementById('userUsernameInput').value = '';
    document.getElementById('userPasswordInput').value = 'bsu123';
    document.getElementById('userNamaInput').value = '';
    
    showToast('User berhasil ditambahkan!', false);
    logActivity('Tambah User', 'Menambah user: ' + username);
};

window.resetPasswordUser = function(username) {
    showConfirm('Reset Password', 'Reset password untuk user "' + username + '" ke "bsu123"?', function() {
        var users = loadUsersData();
        for (var i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                users[i].password = 'bsu123';
                break;
            }
        }
        saveUsersData(users);
        renderUserTable();
        showToast('Password berhasil direset!', false);
        logActivity('Reset Password', 'Reset password user: ' + username);
    });
};

window.deleteUser = function(username) {
    if (username === 'admin') {
        showToast('Tidak bisa menghapus user admin utama!', true);
        return;
    }
    showConfirm('Hapus User', 'Yakin ingin menghapus user "' + username + '"?', function() {
        var users = loadUsersData();
        var newUsers = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i].username !== username) {
                newUsers.push(users[i]);
            }
        }
        saveUsersData(newUsers);
        renderUserTable();
        showToast('User berhasil dihapus!', false);
        logActivity('Hapus User', 'Menghapus user: ' + username);
    });
};

function populateUserBSUFilter() {
    var select = document.getElementById('userBSUInput');
    if (!select) return;
    
    var html = '<option value="">Pilih BSU</option>';
    for (var i = 0; i < dataBSU.length; i++) {
        html += '<option value="' + escapeHtml(dataBSU[i].nama) + '">' + escapeHtml(dataBSU[i].nama) + '</option>';
    }
    select.innerHTML = html;
}

function populateLogFilters() {
    var logs = JSON.parse(localStorage.getItem('bankSampahLogs') || '[]');
    
    var userSelect = document.getElementById('logUserFilter');
    var actionSelect = document.getElementById('logActionFilter');
    
    if (userSelect) {
        var users = {};
        for (var i = 0; i < logs.length; i++) {
            users[logs[i].user] = true;
        }
        var html = '<option value="all">Semua User</option>';
        for (var user in users) {
            html += '<option value="' + escapeHtml(user) + '">' + escapeHtml(user) + '</option>';
        }
        userSelect.innerHTML = html;
    }
    
    if (actionSelect) {
        var actions = {};
        for (var i = 0; i < logs.length; i++) {
            actions[logs[i].action] = true;
        }
        var html = '<option value="all">Semua Aksi</option>';
        for (var action in actions) {
            html += '<option value="' + escapeHtml(action) + '">' + escapeHtml(action) + '</option>';
        }
        actionSelect.innerHTML = html;
    }
}

// ==================== VERIFIKASI MASSAL ====================

function renderVerifikasiTableWithMassal() {
    var container = document.getElementById('verifikasiTableBody');
    var count = document.getElementById('verifikasiPageCount');
    if (!container) return;
    
    var statusFilter = document.getElementById('verifikasiStatusFilter') ? document.getElementById('verifikasiStatusFilter').value : 'all';
    var bsuFilter = document.getElementById('verifikasiBSUFilter') ? document.getElementById('verifikasiBSUFilter').value : 'all';
    
    var filtered = dataTamuMenunggu.slice();
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(function(item) { return item.status === statusFilter; });
    }
    if (bsuFilter !== 'all') {
        filtered = filtered.filter(function(item) { return item.bsu === bsuFilter; });
    }
    
    filtered.sort(function(a, b) {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    if (count) count.textContent = 'Total: ' + filtered.length + ' data';
    
    if (filtered.length === 0) {
        container.innerHTML = '<tr><td colspan="10" style="text-align:center;">Tidak ada data</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var item = filtered[i];
        var statusText = '';
        var statusClass = '';
        if (item.status === 'pending') {
            statusText = '⏳ Menunggu';
            statusClass = 'pending';
        } else if (item.status === 'verified') {
            statusText = '✅ Diverifikasi';
            statusClass = 'verified';
        } else if (item.status === 'rejected') {
            statusText = '❌ Ditolak';
            statusClass = 'rejected';
        }
        
        var isPending = item.status === 'pending';
        
        html += '<tr>' +
            '<td><input type="checkbox" class="verifikasi-checkbox" data-id="' + item.id + '" ' + (isPending ? '' : 'disabled') + '></td>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + escapeHtml(item.namaNasabah || '-') + '</td>' +
            '<td>' + escapeHtml(item.nama) + '</td>' +
            '<td>' + item.berat.toFixed(2) + ' kg</td>' +
            '<td>' + escapeHtml(item.bsu) + '</td>' +
            '<td>' + escapeHtml(item.ketua) + '</td>' +
            '<td>' + item.tanggal + '</td>' +
            '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
            '<td>' +
                (isPending ? 
                    '<button onclick="verifikasiDataTamu(' + item.id + ', \'verified\', null)" style="padding:2px 8px;font-size:0.6rem;background:#2e7d32;color:white;border:none;border-radius:4px;cursor:pointer;">✓</button> ' +
                    '<button onclick="verifikasiDenganHarga(' + item.id + ')" style="padding:2px 8px;font-size:0.6rem;background:#f9a825;color:white;border:none;border-radius:4px;cursor:pointer;">💰</button> ' +
                    '<button onclick="verifikasiDataTamu(' + item.id + ', \'rejected\', null)" style="padding:2px 8px;font-size:0.6rem;background:#ef5350;color:white;border:none;border-radius:4px;cursor:pointer;">✕</button> ' +
                    '<button onclick="lihatDetailTamu(' + item.id + ')" style="padding:2px 8px;font-size:0.6rem;background:#0d6efd;color:white;border:none;border-radius:4px;cursor:pointer;">👁</button>'
                : 
                    '<button onclick="lihatDetailTamu(' + item.id + ')" style="padding:2px 8px;font-size:0.6rem;background:#0d6efd;color:white;border:none;border-radius:4px;cursor:pointer;">👁</button>'
                ) +
            '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

window.verifikasiMassal = function() {
    var checkboxes = document.querySelectorAll('.verifikasi-checkbox:checked');
    if (checkboxes.length === 0) {
        showToast('Pilih data yang akan diverifikasi!', true);
        return;
    }
    
    showConfirm('Verifikasi Massal', 'Verifikasi ' + checkboxes.length + ' data sekaligus?', function() {
        var count = 0;
        for (var i = 0; i < checkboxes.length; i++) {
            var id = parseInt(checkboxes[i].getAttribute('data-id'));
            for (var j = 0; j < dataTamuMenunggu.length; j++) {
                if (dataTamuMenunggu[j].id === id && dataTamuMenunggu[j].status === 'pending') {
                    var item = dataTamuMenunggu[j];
                    var harga = getHargaByNamaSampah(item.nama);
                    
                    daftarSampah.push({
                        id: Date.now() + count,
                        rw: item.rw || 'RW01',
                        rt: item.rt || 'RT01',
                        nama: item.nama,
                        jenis: 'nonorganik',
                        berat: item.berat,
                        hargaPerKg: harga,
                        tanggal: item.tanggal || new Date().toISOString(),
                        bsu: item.bsu,
                        verifiedFromTamu: true,
                        verifiedTamuId: item.id,
                        namaNasabah: item.namaNasabah || '',
                        verifiedBy: sessionStorage.getItem('username') || 'Admin',
                        verifiedAt: new Date().toISOString()
                    });
                    
                    item.status = 'verified';
                    item.hargaPerKg = harga;
                    item.verifiedBy = sessionStorage.getItem('username') || 'Admin';
                    item.verifiedAt = new Date().toISOString();
                    count++;
                }
            }
        }
        
        saveDataToLocal();
        saveTamuDataToLocal();
        refreshAll();
        renderVerifikasiTableWithMassal();
        renderVerifikasiHistory();
        updateVerifikasiCard();
        
        showToast(count + ' data berhasil diverifikasi!', false);
        logActivity('Verifikasi Massal', 'Memverifikasi ' + count + ' data secara massal');
    });
};

// ==================== TOP 5 BSU ====================

function renderTopBSU() {
    var container = document.getElementById('topBSUList');
    if (!container) return;
    
    var bsuPerformance = {};
    for (var i = 0; i < daftarSampah.length; i++) {
        var item = daftarSampah[i];
        var bsu = item.bsu || 'Tanpa BSU';
        if (!bsuPerformance[bsu]) {
            bsuPerformance[bsu] = { berat: 0, nilai: 0, count: 0 };
        }
        var harga = item.hargaPerKg || getHargaByNamaSampah(item.nama);
        bsuPerformance[bsu].berat += item.berat;
        bsuPerformance[bsu].nilai += (item.berat * harga);
        bsuPerformance[bsu].count++;
    }
    
    var sorted = Object.keys(bsuPerformance).sort(function(a, b) {
        return bsuPerformance[b].nilai - bsuPerformance[a].nilai;
    });
    
    var top = sorted.slice(0, 5);
    
    if (top.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px;">Belum ada data</div>';
        return;
    }
    
    var maxValue = 0;
    for (var i = 0; i < top.length; i++) {
        if (bsuPerformance[top[i]].nilai > maxValue) {
            maxValue = bsuPerformance[top[i]].nilai;
        }
    }
    maxValue = maxValue || 1;
    
    var html = '';
    for (var i = 0; i < top.length; i++) {
        var bsu = top[i];
        var data = bsuPerformance[bsu];
        var percent = (data.nilai / maxValue) * 100;
        var medal = '';
        if (i === 0) medal = '🥇';
        else if (i === 1) medal = '🥈';
        else if (i === 2) medal = '🥉';
        
        html += '<div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid var(--primary-bg);">' +
            '<div style="font-size:1.2rem;font-weight:700;min-width:40px;color:var(--text-muted);">' + medal + '</div>' +
            '<div style="flex:1;">' +
                '<div style="font-weight:600;font-size:0.9rem;">' + escapeHtml(bsu) + '</div>' +
                '<div style="font-size:0.7rem;color:var(--text-muted);">' + data.count + ' transaksi | ' + data.berat.toFixed(2) + ' kg</div>' +
            '</div>' +
            '<div style="text-align:right;min-width:120px;">' +
                '<div style="font-weight:700;color:var(--primary);font-size:0.9rem;">' + formatRupiah(data.nilai) + '</div>' +
            '</div>' +
            '<div style="width:80px;height:8px;background:var(--primary-bg);border-radius:4px;overflow:hidden;">' +
                '<div style="height:100%;width:' + percent + '%;background:linear-gradient(90deg,var(--primary-light),var(--primary-lighter));border-radius:4px;"></div>' +
            '</div>' +
        '</div>';
    }
    container.innerHTML = html;
}

// ==================== FUNGSI RESET DATA ====================

window.resetAllData = function() {
    showConfirm('Reset Semua Data', '⚠️ Tindakan ini akan menghapus SEMUA data termasuk sampah, user, dan log. Lanjutkan?', function() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(DATA_TAMU_KEY);
        localStorage.removeItem('bankSampahLogs');
        localStorage.removeItem('bankSampahUsers');
        
        // Reset BSU ke default
        dataBSU = getDefaultBSU();
        saveBSUData();
        
        // Reset users
        var defaultUsers = getDefaultUsers();
        saveUsersData(defaultUsers);
        
        // Reload data
        daftarSampah = [];
        dataTamuMenunggu = [];
        saveDataToLocal();
        saveTamuDataToLocal();
        
        showToast('Semua data berhasil direset! Halaman akan reload...', false);
        logActivity('Reset Data', 'Merreset semua data sistem');
        setTimeout(function() { location.reload(); }, 1500);
    });
};

// ==================== UPDATE FUNGSI YANG SUDAH ADA ====================

// Update fungsi refreshAll untuk include top BSU
var originalRefreshAll = refreshAll;
refreshAll = function() {
    originalRefreshAll();
    renderTopBSU();
    updateNasabahBadge();
    updateLogBadge();
    updateBSUBadge();
};

// Update fungsi updateDashboard untuk include total nasabah
var originalUpdateDashboard = updateDashboard;
updateDashboard = function() {
    originalUpdateDashboard();
    var nasabah = getNasabahUnikAdmin('all');
    var totalNasabahEl = document.getElementById('totalNasabahAll');
    if (totalNasabahEl) totalNasabahEl.textContent = nasabah.length;
};

// ==================== BADGE UPDATE ====================

function updateNasabahBadge() {
    var nasabah = getNasabahUnikAdmin('all');
    var badge = document.getElementById('nasabahBadge');
    if (badge) badge.textContent = nasabah.length;
}

function updateLogBadge() {
    var logs = JSON.parse(localStorage.getItem('bankSampahLogs') || '[]');
    var badge = document.getElementById('logBadge');
    if (badge) badge.textContent = logs.length;
}

function updateBSUBadge() {
    var badge = document.getElementById('bsuBadge');
    if (badge) badge.textContent = dataBSU.length;
}

function updateVerifikasiBadge() {
    var pending = dataTamuMenunggu.filter(function(item) { return item.status === 'pending'; });
    var badge = document.getElementById('verifikasiBadge');
    if (badge) {
        badge.textContent = pending.length;
        badge.style.display = pending.length > 0 ? 'inline-block' : 'none';
    }
}

// Override updateVerifikasiCard untuk badge
var originalUpdateVerifikasiCard = updateVerifikasiCard;
updateVerifikasiCard = function() {
    originalUpdateVerifikasiCard();
    updateVerifikasiBadge();
};

// ==================== SETUP EVENT LISTENERS (TAMBAHAN) ====================

function setupAdditionalEventListeners() {
    // BSU Management
    var tambahBSUBtn = document.getElementById('tambahBSUBtn');
    if (tambahBSUBtn) {
        tambahBSUBtn.addEventListener('click', window.tambahBSU);
    }
    
    // Nasabah Management
    var nasabahSearchBtn = document.getElementById('adminNasabahSearchBtn');
    if (nasabahSearchBtn) {
        nasabahSearchBtn.addEventListener('click', function() {
            var search = document.getElementById('adminNasabahSearch').value || '';
            var bsu = document.getElementById('adminNasabahBSUFilter').value || 'all';
            renderAdminNasabah(search, bsu);
        });
    }
    
    var nasabahResetBtn = document.getElementById('adminNasabahResetBtn');
    if (nasabahResetBtn) {
        nasabahResetBtn.addEventListener('click', function() {
            document.getElementById('adminNasabahSearch').value = '';
            document.getElementById('adminNasabahBSUFilter').value = 'all';
            renderAdminNasabah('', 'all');
        });
    }
    
    var nasabahSearchInput = document.getElementById('adminNasabahSearch');
    if (nasabahSearchInput) {
        nasabahSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                var search = document.getElementById('adminNasabahSearch').value || '';
                var bsu = document.getElementById('adminNasabahBSUFilter').value || 'all';
                renderAdminNasabah(search, bsu);
            }
        });
    }
    
    // User Management
    var tambahUserBtn = document.getElementById('tambahUserBtn');
    if (tambahUserBtn) {
        tambahUserBtn.addEventListener('click', window.tambahUser);
    }
    
    // Verifikasi Massal
    var verifikasiMassalBtn = document.getElementById('verifikasiMassalBtn');
    if (verifikasiMassalBtn) {
        verifikasiMassalBtn.addEventListener('click', window.verifikasiMassal);
    }
    
    var selectAllCheckbox = document.getElementById('verifikasiSelectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            var checkboxes = document.querySelectorAll('.verifikasi-checkbox:not(:disabled)');
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = this.checked;
            }
        });
    }
    
    // Verifikasi Filter
    var verifikasiFilterBtn = document.getElementById('verifikasiFilterBtn');
    if (verifikasiFilterBtn) {
        verifikasiFilterBtn.addEventListener('click', renderVerifikasiTableWithMassal);
    }
    
    var verifikasiResetBtn = document.getElementById('verifikasiResetBtn');
    if (verifikasiResetBtn) {
        verifikasiResetBtn.addEventListener('click', function() {
            document.getElementById('verifikasiStatusFilter').value = 'all';
            document.getElementById('verifikasiBSUFilter').value = 'all';
            renderVerifikasiTableWithMassal();
        });
    }
    
    // Log Filter
    var logFilterBtn = document.getElementById('logFilterBtn');
    if (logFilterBtn) {
        logFilterBtn.addEventListener('click', renderFilteredLogs);
    }
    
    var logResetBtn = document.getElementById('logResetBtn');
    if (logResetBtn) {
        logResetBtn.addEventListener('click', function() {
            document.getElementById('logUserFilter').value = 'all';
            document.getElementById('logActionFilter').value = 'all';
            renderFilteredLogs();
        });
    }
    
    var logExportBtn = document.getElementById('logExportBtn');
    if (logExportBtn) {
        logExportBtn.addEventListener('click', exportLogs);
    }
    
    // Reset All Data
    var resetAllDataBtn = document.getElementById('resetAllDataBtn');
    if (resetAllDataBtn) {
        resetAllDataBtn.addEventListener('click', window.resetAllData);
    }
    
    // Clear Logs
    var clearLogsBtn2 = document.getElementById('clearLogsBtn2');
    if (clearLogsBtn2) {
        clearLogsBtn2.addEventListener('click', function() {
            showConfirm('Hapus Log', 'Yakin ingin menghapus semua log aktivitas?', function() {
                localStorage.removeItem('bankSampahLogs');
                renderActivityLogs();
                renderFilteredLogs();
                updateLogBadge();
                showToast('Log aktivitas berhasil dihapus', false);
                logActivity('Hapus Log', 'Menghapus semua log aktivitas');
            });
        });
    }
}

// ==================== FILTERED LOGS ====================

function renderFilteredLogs() {
    var container = document.getElementById('fullActivityLogBody');
    var count = document.getElementById('logCount');
    if (!container) return;
    
    var logs = JSON.parse(localStorage.getItem('bankSampahLogs') || '[]');
    
    var userFilter = document.getElementById('logUserFilter') ? document.getElementById('logUserFilter').value : 'all';
    var actionFilter = document.getElementById('logActionFilter') ? document.getElementById('logActionFilter').value : 'all';
    
    if (userFilter !== 'all') {
        logs = logs.filter(function(log) { return log.user === userFilter; });
    }
    if (actionFilter !== 'all') {
        logs = logs.filter(function(log) { return log.action === actionFilter; });
    }
    
    if (count) count.textContent = 'Total: ' + logs.length + ' log';
    
    if (logs.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align:center;">Tidak ada aktivitas</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var date = new Date(log.timestamp);
        var timeStr = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID');
        html += '<tr>' +
            '<td>' + timeStr + '</td>' +
            '<td>' + escapeHtml(log.user) + '</td>' +
            '<td>' + escapeHtml(log.action) + '</td>' +
            '<td>' + escapeHtml(log.detail || '-') + '</td>' +
            '</tr>';
    }
    container.innerHTML = html;
}

function exportLogs() {
    var logs = JSON.parse(localStorage.getItem('bankSampahLogs') || '[]');
    
    var userFilter = document.getElementById('logUserFilter') ? document.getElementById('logUserFilter').value : 'all';
    var actionFilter = document.getElementById('logActionFilter') ? document.getElementById('logActionFilter').value : 'all';
    
    if (userFilter !== 'all') {
        logs = logs.filter(function(log) { return log.user === userFilter; });
    }
    if (actionFilter !== 'all') {
        logs = logs.filter(function(log) { return log.action === actionFilter; });
    }
    
    if (logs.length === 0) {
        showToast('Tidak ada log untuk diekspor!', true);
        return;
    }
    
    var headers = ['Waktu', 'User', 'Aksi', 'Detail'];
    var rows = [];
    for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        var date = new Date(log.timestamp);
        var timeStr = date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID');
        rows.push([
            '"' + timeStr + '"',
            '"' + log.user + '"',
            '"' + log.action + '"',
            '"' + (log.detail || '-') + '"'
        ]);
    }
    
    var csvContent = '\uFEFF' + headers.join(',') + '\n';
    for (var i = 0; i < rows.length; i++) {
        csvContent += rows[i].join(',') + '\n';
    }
    
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'Log_Aktivitas_' + new Date().toISOString().slice(0,10) + '.csv';
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('Log berhasil diekspor!', false);
}

// ==================== UPDATE INISIALISASI ====================

// Override inisialisasi
var originalInit = function() {
    console.log('Initializing admin with new features...');
    
    // Load BSU data
    loadBSUData();
    
    // Render BSU table
    renderBSUTable();
    
    // Render User table
    renderUserTable();
    
    // Render Nasabah table
    renderAdminNasabah('', 'all');
    
    // Populate filters
    populateUserBSUFilter();
    populateLogFilters();
    populateBSUFiltersAdmin();
    
    // Render Verifikasi
    renderVerifikasiTableWithMassal();
    
    // Setup additional events
    setupAdditionalEventListeners();
    
    // Update badges
    updateNasabahBadge();
    updateLogBadge();
    updateBSUBadge();
    updateVerifikasiBadge();
    
    // Render Top BSU
    renderTopBSU();
    
    console.log('Admin initialization complete');
};

// Panggil inisialisasi setelah DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Tunggu inisialisasi utama selesai
    setTimeout(function() {
        originalInit();
    }, 500);
});

// ==================== POPULATE BSU FILTERS ADMIN ====================

function populateBSUFiltersAdmin() {
    var filterSelects = document.querySelectorAll('#adminNasabahBSUFilter, #verifikasiBSUFilter');
    for (var s = 0; s < filterSelects.length; s++) {
        var select = filterSelects[s];
        if (!select) continue;
        var html = '<option value="all">Semua BSU</option>';
        for (var i = 0; i < dataBSU.length; i++) {
            html += '<option value="' + escapeHtml(dataBSU[i].nama) + '">' + escapeHtml(dataBSU[i].nama) + '</option>';
        }
        select.innerHTML = html;
    }
}
