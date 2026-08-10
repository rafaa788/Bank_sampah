// =====================================================
// DATA HARGA SAMPAH 
// =====================================================

// Data Sampah dan Harga 
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

// HARGA SAMPAH 
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

// Fungsi untuk mendapatkan harga berdasarkan nama sampah (JANGAN DIUBAH)
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

// Export fungsi ke global
window.presetSampah = presetSampah;
window.hargaSampahDetail = hargaSampahDetail;
window.defaultHargaPerKategori = defaultHargaPerKategori;
window.getHargaByNamaSampah = getHargaByNamaSampah;
