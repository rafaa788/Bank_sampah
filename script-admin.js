// ADMIN SCRIPT - VERSI LENGKAP DENGAN BSU, PRESET SAMPAH, DAN FILTER LAPORAN

document.addEventListener('DOMContentLoaded', function() {
    // ==================== SIDEBAR & SWIPE GESTURE ====================
    initSidebar();
    
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
        
        // SWIPE GESTURE
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
        
        var menuItems = document.querySelectorAll('.menu-item');
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            });
        }
    }
    
    // ==================== CEK LOGIN ====================
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'menu_login.html';
        return;
    }
    
    // Data Model
    let daftarSampah = [];
    let currentFilter = 'all';
    let currentType = 'organik';
    let currentFilterRW = 'all';
    let currentFilterRT = 'all';
    let currentFilterBSU = 'all';
    let currentStatFilterRW = 'all';
    let currentStatFilterRT = 'all';
    let currentStatFilterBSU = 'all';
    let currentStatFilterJenis = 'all';
    const STORAGE_KEY = 'bankSampahData';
    
    // Nama hari dan bulan
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    // ==================== DATA BSU (BANK SAMPAH UNIT) ====================
    const dataBSU = [
        { nama: "BSU MEDE 1", rw: "RW01", rt: "RT01" },
        { nama: "BSU MEDE 2", rw: "RW01", rt: "RT02" },
        { nama: "BSU MEDE 3", rw: "RW01", rt: "RT03" },
        { nama: "BSU MEDE 4", rw: "RW01", rt: "RT04" },
        { nama: "BSU PELANGI CERIA", rw: "RW02", rt: "RT01" },
        { nama: "BSU PELANGI 2", rw: "RW02", rt: "RT02" },
        { nama: "BSU PELANGI KENANGA", rw: "RW02", rt: "RT03" },
        { nama: "BSU PELANGI BUNDA", rw: "RW02", rt: "RT04" },
        { nama: "BSU KP KIDOEL", rw: "RW09", rt: "all" },
        { nama: "BSU MAWARGA", rw: "RW10", rt: "RT01" },
        { nama: "BSU SRIKANDI", rw: "RW10", rt: "RT02" },
        { nama: "BSU ZALAK 2", rw: "RW11", rt: "RT02" },
        { nama: "BSU CEMERLANG 1", rw: "RW13", rt: "RT01" },
        { nama: "BSU CEMERLANG 2", rw: "RW13", rt: "RT02" },
        { nama: "BSU CEMERLANG 3", rw: "RW13", rt: "RT03" },
        { nama: "BSU FORSILA", rw: "RW04", rt: "RT01" },
        { nama: "BSU BERSERI 04", rw: "RW04", rt: "RT02" },
        { nama: "BSU BINTANG KEJORA 1", rw: "RW05", rt: "RT01" },
        { nama: "BSU BINTANG KEJORA 2", rw: "RW05", rt: "RT02" },
        { nama: "BSU TERANG", rw: "RW06", rt: "RT01" },
        { nama: "BSU BERSEMI 0107", rw: "RW07", rt: "RT01" },
        { nama: "BSU BERSEMI 07", rw: "RW07", rt: "RT02" },
        { nama: "BSU MENTARI 01", rw: "RW08", rt: "RT01" },
        { nama: "BSU MENTARI", rw: "RW08", rt: "RT02" }
    ];
    
    // Data preset nama sampah
    const presetSampah = {
        organik: [
            "Daun Kering", "Sisa Makanan", "Sayuran Busuk", "Buah Busuk", 
            "Ampas Kopi", "Kulit Telur", "Ranting Pohon", "Kompos", 
            "Limbah Dapur", "Kertas Basah", "Ampas Tahu", "Ampas Kelapa",
            "Eceng Gondok", "Rumput", "Jerami", "Kotoran Ternak"
        ],
        nonorganik: [
            "Botol Plastik", "Kardus Bekas", "Kaleng Minuman", "Kertas HVS", 
            "Koran Bekas", "Besi Tua", "Kaca Beling", "Alumunium", 
            "Tembaga", "Kuningan", "Plastik Kresek", "Baterai Bekas", 
            "Ban Bekas", "Kain Perca", "Sterofoam", "Gelas Plastik", 
            "Sendok Plastik", "Sedotan", "Kabel", "Mainan Rusak"
        ]
    };
    
    let selectedBSU = null;
    let currentLaporanFilter = { bsu: 'all', rw: 'all', rt: 'all' };
    
    // Data harga otomatis
    const hargaOtomatis = {
        organik: {
            default: 2000,
            list: {
                "daun": 1500,
                "sayur": 1200,
                "buah": 1800,
                "makanan": 1200,
                "kompos": 1500,
                "sisa": 1200,
                "organik": 2000,
                "ampas": 1000,
                "kulit": 1500,
                "ranting": 1000,
                "rumput": 800,
                "jerami": 900
            }
        },
        nonorganik: {
            default: 3500,
            list: {
                "plastik": 4000,
                "botol": 4500,
                "kardus": 2800,
                "kertas": 2500,
                "kaleng": 5000,
                "besi": 6000,
                "kaca": 3000,
                "alumunium": 10000,
                "tembaga": 65000,
                "kuningan": 30000,
                "nonorganik": 3500,
                "kabel": 25000,
                "ban": 2000,
                "kain": 1500
            }
        }
    };
    
    function getHargaOtomatis(namaSampah, jenis) {
        var namaLower = namaSampah.toLowerCase();
        var hargaData = hargaOtomatis[jenis];
        
        for (var keyword in hargaData.list) {
            if (hargaData.list.hasOwnProperty(keyword)) {
                if (namaLower.includes(keyword)) {
                    return hargaData.list[keyword];
                }
            }
        }
        return hargaData.default;
    }
    
    function formatRupiah(angka) {
        return 'Rp ' + angka.toLocaleString('id-ID');
    }
    
    function formatTanggalIndo(tanggal) {
        return namaHari[tanggal.getDay()] + ', ' + tanggal.getDate() + ' ' + namaBulan[tanggal.getMonth()] + ' ' + tanggal.getFullYear();
    }
    
    // Set admin name
    var adminName = sessionStorage.getItem('adminName') || 'Admin';
    var adminNameSpan = document.getElementById('adminName');
    var welcomeNameSpan = document.getElementById('welcomeName');
    if (adminNameSpan) adminNameSpan.innerText = adminName;
    if (welcomeNameSpan) welcomeNameSpan.innerText = adminName;
    
    // Load data dari localStorage
    function loadData() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            daftarSampah = JSON.parse(stored);
            // Migrasi data lama untuk menambahkan field bsu jika belum ada
            for (var i = 0; i < daftarSampah.length; i++) {
                if (!daftarSampah[i].bsu) {
                    daftarSampah[i].bsu = null;
                }
            }
            saveData();
        } else {
            daftarSampah = [
                { id: Date.now() + 1, rw: "RW01", rt: "RT01", nama: "Daun Kering", jenis: "organik", berat: 12.5, hargaPerKg: 1500, tanggal: new Date().toISOString(), bsu: "BSU MEDE 1" },
                { id: Date.now() + 2, rw: "RW01", rt: "RT02", nama: "Sisa Makanan", jenis: "organik", berat: 8.2, hargaPerKg: 1200, tanggal: new Date().toISOString(), bsu: "BSU MEDE 2" },
                { id: Date.now() + 3, rw: "RW02", rt: "RT01", nama: "Botol Plastik", jenis: "nonorganik", berat: 5.0, hargaPerKg: 3500, tanggal: new Date().toISOString(), bsu: "BSU PELANGI CERIA" },
                { id: Date.now() + 4, rw: "RW02", rt: "RT03", nama: "Kardus Bekas", jenis: "nonorganik", berat: 7.3, hargaPerKg: 2800, tanggal: new Date().toISOString(), bsu: "BSU PELANGI KENANGA" },
                { id: Date.now() + 5, rw: "RW03", rt: "RT02", nama: "Kaleng Minuman", jenis: "nonorganik", berat: 3.2, hargaPerKg: 4200, tanggal: new Date().toISOString(), bsu: null }
            ];
            saveData();
        }
        refreshAll();
        populateBSUFilters();
    }
    
    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarSampah));
    }
    
    // Populate BSU dropdown filters
    function populateBSUFilters() {
        var bsuNames = [];
        for (var i = 0; i < dataBSU.length; i++) {
            bsuNames.push(dataBSU[i].nama);
        }
        
        var filterBSU = document.getElementById('filterBSU');
        var statFilterBSU = document.getElementById('statFilterBSU');
        
        if (filterBSU) {
            var currentHTML = '<option value="all">Semua BSU</option>';
            for (var j = 0; j < bsuNames.length; j++) {
                currentHTML += '<option value="' + bsuNames[j] + '">' + bsuNames[j] + '</option>';
            }
            filterBSU.innerHTML = currentHTML;
        }
        
        if (statFilterBSU) {
            var statHTML = '<option value="all">Semua BSU</option>';
            for (var k = 0; k < bsuNames.length; k++) {
                statHTML += '<option value="' + bsuNames[k] + '">' + bsuNames[k] + '</option>';
            }
            statFilterBSU.innerHTML = statHTML;
        }
    }
    
    // Filter data berdasarkan BSU, RW, dan RT
    function filterDataByFilters(data, bsu, rw, rt) {
        var filtered = data.slice();
        if (bsu !== 'all') {
            filtered = filtered.filter(function(item) { return item.bsu === bsu; });
        }
        if (rw !== 'all') {
            filtered = filtered.filter(function(item) { return item.rw === rw; });
        }
        if (rt !== 'all') {
            filtered = filtered.filter(function(item) { return item.rt === rt; });
        }
        return filtered;
    }
    
    // Update stats dengan filter
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
    }
    
    // Render tabel RT/RW dengan BSU
    function renderRTandRWTable() {
        var container = document.getElementById('rtRwTableBody');
        if (!container) return;
        
        var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
        
        if (filteredData.length === 0) {
            container.innerHTML = '<tr><td colspan="7" style="text-align: center;">Tidak ada数据</td></tr>';
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
    }
    
    // Update statistik page dengan filter BSU, RW, RT, dan jenis
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
                jenisSampahMap[item.jenis] = {
                    berat: 0,
                    count: 0,
                    nilai: 0
                };
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
        
        var organikDeg = totalSemua > 0 ? (totalOrganik / totalSemua) * 360 : 0;
        var organikSegment = document.querySelector('.organik-segment');
        var nonorganikSegment = document.querySelector('.nonorganik-segment');
        var pieTotal = document.getElementById('pieTotal');
        var legendOrganik = document.getElementById('legendOrganik');
        var legendNonorganik = document.getElementById('legendNonorganik');
        
        if (organikSegment) {
            organikSegment.style.background = 'conic-gradient(#2e7d32 ' + organikDeg + 'deg, #2e7d32 ' + organikDeg + 'deg, transparent ' + organikDeg + 'deg)';
        }
        if (nonorganikSegment) {
            nonorganikSegment.style.background = 'conic-gradient(#f9a825 ' + (360 - organikDeg) + 'deg, #f9a825 ' + (360 - organikDeg) + 'deg, transparent ' + (360 - organikDeg) + 'deg)';
        }
        if (pieTotal) pieTotal.innerText = totalSemua.toFixed(1);
        if (legendOrganik) legendOrganik.innerText = totalOrganik.toFixed(2);
        if (legendNonorganik) legendNonorganik.innerText = totalNonorganik.toFixed(2);
        
        renderJenisSampahTable(jenisSampahMap);
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
    
    function renderDataList() {
        var container = document.getElementById('sampahList');
        if (!container) return;
        
        var filteredData = daftarSampah.slice();
        if (currentFilter !== 'all') {
            filteredData = filteredData.filter(function(item) { return item.jenis === currentFilter; });
        }
        
        if (filteredData.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>Tidak ada data sampah</p></div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < filteredData.length; i++) {
            var item = filteredData[i];
            html += '<div class="data-item">' +
                '<div class="data-info" style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">' +
                '<div class="data-number">' + (i + 1) + '</div>' +
                '<div><strong>' + (item.bsu ? item.bsu : '-') + '</strong></div>' +
                '<div><small>' + item.rw + ' - ' + item.rt + '</small></div>' +
                '<div class="data-name">' + escapeHtml(item.nama) + '</div>' +
                '<span class="preview-badge">' + (item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</span>' +
                '<div class="data-weight">' + item.berat.toFixed(2) + ' kg</div>' +
                '<div class="data-price">Rp ' + item.hargaPerKg.toLocaleString() + '/kg</div>' +
                '<div class="data-total">Rp ' + (item.berat * item.hargaPerKg).toLocaleString() + '</div>' +
                '</div>' +
                '<div class="data-actions">' +
                '<button class="edit-data" onclick="editSampah(' + item.id + ')"><i class="fas fa-edit"></i></button>' +
                '<button class="delete-data" onclick="deleteSampah(' + item.id + ')"><i class="fas fa-trash-alt"></i></button>' +
                '</div>' +
                '</div>';
        }
        container.innerHTML = html;
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
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
        }, 2500);
    }
    
    // ==================== FUNGSI BSU ====================
    function renderBSUList(searchTerm = '') {
        const container = document.getElementById('bsuList');
        if (!container) return;
        
        let filteredBSU = [...dataBSU];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredBSU = filteredBSU.filter(bsu => bsu.nama.toLowerCase().includes(term));
        }
        
        if (filteredBSU.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">Tidak ada BSU ditemukan</div>';
            return;
        }
        
        let html = '';
        for (let i = 0; i < filteredBSU.length; i++) {
            const bsu = filteredBSU[i];
            const locationText = bsu.rt === 'all' ? bsu.rw + ' (Semua RT)' : bsu.rw + ' - ' + bsu.rt;
            const isSelected = selectedBSU && selectedBSU.nama === bsu.nama && selectedBSU.rw === bsu.rw;
            html += `<div class="bsu-item ${isSelected ? 'selected' : ''}" data-nama="${bsu.nama}" data-rw="${bsu.rw}" data-rt="${bsu.rt}">
                        <div>
                            <div class="bsu-name">${escapeHtml(bsu.nama)}</div>
                            <div class="bsu-location">${locationText}</div>
                        </div>
                        <div class="bsu-badge">RW ${bsu.rw.replace('RW', '')}</div>
                    </div>`;
        }
        container.innerHTML = html;
        
        const bsuItems = document.querySelectorAll('.bsu-item');
        for (let i = 0; i < bsuItems.length; i++) {
            bsuItems[i].addEventListener('click', function() {
                const nama = this.getAttribute('data-nama');
                const rw = this.getAttribute('data-rw');
                const rt = this.getAttribute('data-rt');
                selectBSU({ nama: nama, rw: rw, rt: rt });
            });
        }
    }
    
    function selectBSU(bsu) {
        selectedBSU = bsu;
        
        const inputRW = document.getElementById('inputRW');
        const inputRT = document.getElementById('inputRT');
        
        if (inputRW && bsu.rw) {
            for (let i = 0; i < inputRW.options.length; i++) {
                if (inputRW.options[i].value === bsu.rw) {
                    inputRW.selectedIndex = i;
                    break;
                }
            }
        }
        
        if (inputRT && bsu.rt && bsu.rt !== 'all') {
            for (let i = 0; i < inputRT.options.length; i++) {
                if (inputRT.options[i].value === bsu.rt) {
                    inputRT.selectedIndex = i;
                    break;
                }
            }
        }
        
        const selectedDisplay = document.getElementById('selectedBsuDisplay');
        const selectedBsuName = document.getElementById('selectedBsuName');
        const selectedBsuLocation = document.getElementById('selectedBsuLocation');
        const currentBsuInfo = document.getElementById('currentBsuInfo');
        const currentBsuText = document.getElementById('currentBsuText');
        
        if (selectedDisplay) {
            selectedDisplay.style.display = 'flex';
            if (selectedBsuName) selectedBsuName.innerText = bsu.nama;
            if (selectedBsuLocation) selectedBsuLocation.innerText = `${bsu.rw} - ${bsu.rt === 'all' ? 'Semua RT' : bsu.rt}`;
        }
        
        if (currentBsuInfo) {
            currentBsuInfo.style.display = 'flex';
            if (currentBsuText) currentBsuText.innerText = `${bsu.nama} (${bsu.rw} - ${bsu.rt === 'all' ? 'Semua RT' : bsu.rt})`;
        }
        
        const searchInput = document.getElementById('bsuSearchInput');
        renderBSUList(searchInput ? searchInput.value : '');
        
        showToast(`BSU ${bsu.nama} dipilih`, false);
    }
    
    function clearSelectedBSU() {
        selectedBSU = null;
        
        const selectedDisplay = document.getElementById('selectedBsuDisplay');
        const currentBsuInfo = document.getElementById('currentBsuInfo');
        
        if (selectedDisplay) selectedDisplay.style.display = 'none';
        if (currentBsuInfo) currentBsuInfo.style.display = 'none';
        
        const searchInput = document.getElementById('bsuSearchInput');
        renderBSUList(searchInput ? searchInput.value : '');
        
        showToast('BSU dibatalkan', false);
    }
    
    // Populate datalist untuk input nama sampah
    function populateSampahDatalist() {
        const datalist = document.getElementById('sampahDatalist');
        if (!datalist) return;
        
        let allSampah = [...presetSampah.organik, ...presetSampah.nonorganik];
        let html = '';
        for (let i = 0; i < allSampah.length; i++) {
            html += `<option value="${allSampah[i]}">`;
        }
        datalist.innerHTML = html;
    }
    
    function renderPresetSampah() {
        const container = document.getElementById('presetSampahContainer');
        if (!container) return;
        
        let html = '<div style="margin-bottom: 8px;"><small style="color:#666;">📋 Klik untuk memilih nama sampah:</small></div>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        
        html += '<div style="width: 100%; margin-top: 4px;"><small style="color:#2e7d32;">🌿 Organik:</small></div>';
        for (let i = 0; i < presetSampah.organik.length; i++) {
            html += `<button type="button" class="preset-btn preset-organik" data-nama="${presetSampah.organik[i]}" data-jenis="organik">${presetSampah.organik[i]}</button>`;
        }
        
        html += '<div style="width: 100%; margin-top: 8px;"><small style="color:#f9a825;">📦 Nonorganik:</small></div>';
        for (let i = 0; i < presetSampah.nonorganik.length; i++) {
            html += `<button type="button" class="preset-btn preset-nonorganik" data-nama="${presetSampah.nonorganik[i]}" data-jenis="nonorganik">${presetSampah.nonorganik[i]}</button>`;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        const presetBtns = document.querySelectorAll('.preset-btn');
        for (let i = 0; i < presetBtns.length; i++) {
            presetBtns[i].addEventListener('click', function() {
                const nama = this.getAttribute('data-nama');
                const jenis = this.getAttribute('data-jenis');
                
                const namaInput = document.getElementById('namaSampah');
                const jenisInput = document.getElementById('jenisSampah');
                const hargaInput = document.getElementById('hargaSampah');
                
                if (namaInput) namaInput.value = nama;
                if (jenisInput) jenisInput.value = jenis;
                
                const typeOptions = document.querySelectorAll('.type-option');
                for (let j = 0; j < typeOptions.length; j++) {
                    typeOptions[j].classList.remove('active');
                    if (typeOptions[j].getAttribute('data-type') === jenis) {
                        typeOptions[j].classList.add('active');
                    }
                }
                
                if (hargaInput) {
                    const hargaOtomatisValue = getHargaOtomatis(nama, jenis);
                    hargaInput.value = hargaOtomatisValue;
                }
                
                showToast(`Nama sampah "${nama}" dipilih`, false);
            });
        }
    }
    
    // ==================== FITUR LAPORAN DENGAN FILTER ====================
    
    function getFilteredLaporanData() {
        var filteredData = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
        return filteredData;
    }
    
    function generateLaporanMingguan() {
        var today = new Date();
        var weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        var filteredData = getFilteredLaporanData();
        var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
        
        for (var i = 0; i < filteredData.length; i++) {
            var item = filteredData[i];
            if (item.jenis === 'organik') totalOrganik += item.berat;
            else totalNonorganik += item.berat;
            totalNilai += (item.berat * item.hargaPerKg);
        }
        var totalBerat = totalOrganik + totalNonorganik;
        
        var filterText = getFilterText();
        
        return {
            title: 'Laporan Mingguan Bank Sampah Digital',
            periode: formatTanggalIndo(weekStart) + ' s/d ' + formatTanggalIndo(today),
            data: filteredData,
            totalOrganik: totalOrganik,
            totalNonorganik: totalNonorganik,
            totalBerat: totalBerat,
            totalNilai: totalNilai,
            jumlahItem: filteredData.length,
            filterInfo: filterText
        };
    }
    
    function generateLaporanBulanan() {
        var today = new Date();
        var filteredData = getFilteredLaporanData();
        var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
        
        for (var i = 0; i < filteredData.length; i++) {
            var item = filteredData[i];
            if (item.jenis === 'organik') totalOrganik += item.berat;
            else totalNonorganik += item.berat;
            totalNilai += (item.berat * item.hargaPerKg);
        }
        var totalBerat = totalOrganik + totalNonorganik;
        
        var filterText = getFilterText();
        
        return {
            title: 'Laporan Bulanan Bank Sampah Digital',
            periode: namaBulan[today.getMonth()] + ' ' + today.getFullYear(),
            data: filteredData,
            totalOrganik: totalOrganik,
            totalNonorganik: totalNonorganik,
            totalBerat: totalBerat,
            totalNilai: totalNilai,
            jumlahItem: filteredData.length,
            filterInfo: filterText
        };
    }
    
    function getFilterText() {
        var parts = [];
        if (currentFilterBSU !== 'all') parts.push('BSU: ' + currentFilterBSU);
        if (currentFilterRW !== 'all') parts.push('RW: ' + currentFilterRW);
        if (currentFilterRT !== 'all') parts.push('RT: ' + currentFilterRT);
        if (parts.length === 0) return 'Semua Data';
        return parts.join(' | ');
    }
    
    function exportToPDF(laporan, jenisLaporan) {
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
                '<td style="border:1px solid #ddd; padding:8px;">' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td>' +
                '<td style="border:1px solid #ddd; padding:8px; text-align:right;">' + item.berat.toFixed(2) + ' kg</td>' +
                '<td style="border:1px solid #ddd; padding:8px; text-align:right;">' + formatRupiah(item.hargaPerKg) + '</td>' +
                '<td style="border:1px solid #ddd; padding:8px; text-align:right;">' + formatRupiah(item.berat * item.hargaPerKg) + '</td>' +
                '</tr>';
        }
        
        var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + laporan.title + '</title><style>' +
            'body { font-family: "Times New Roman", Arial, sans-serif; padding: 40px; }' +
            '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; }' +
            'h1 { color: #2e7d32; margin-bottom: 5px; }' +
            '.subtitle { color: #666; font-size: 14px; }' +
            '.periode { background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold; }' +
            '.filter-info { background: #e3f2fd; padding: 10px; border-radius: 8px; text-align: center; margin: 10px 0; font-size: 12px; color: #1565c0; }' +
            '.stats { display: flex; gap: 20px; margin: 20px 0; }' +
            '.stat-card { flex: 1; background: #f5f5f5; border-radius: 12px; padding: 15px; text-align: center; }' +
            '.stat-card.organik { border-top: 4px solid #2e7d32; }' +
            '.stat-card.nonorganik { border-top: 4px solid #f9a825; }' +
            '.stat-card.total { border-top: 4px solid #7b1fa2; }' +
            '.stat-value { font-size: 22px; font-weight: bold; color: #2e7d32; }' +
            '.stat-label { font-size: 12px; color: #666; }' +
            '.info-box { background: #e3f2fd; border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center; }' +
            'table { width: 100%; border-collapse: collapse; margin: 20px 0; }' +
            'th { background: #2e7d32; color: white; padding: 10px; text-align: left; }' +
            'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
            '.footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }' +
            '.signature { margin-top: 40px; display: flex; justify-content: space-between; }' +
            '.signature-box { text-align: center; }' +
            '.signature-line { margin-top: 40px; width: 200px; border-top: 1px solid #000; }' +
            '</style></head><body>' +
            '<div class="header">' +
            '<h1>BANK SAMPAH DIGITAL</h1>' +
            '<div class="subtitle">Mengelola Sampah untuk Bumi yang Lebih Baik</div>' +
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
            '<strong>Total Nilai Sampah:</strong> ' + formatRupiah(laporan.totalNilai) + ' | ' +
            '<strong>Jumlah Transaksi:</strong> ' + laporan.jumlahItem + ' item' +
            '</div>' +
            '<h3>Detail Data Sampah</h3>' +
            '<table><thead><tr>' +
            '<th>No</th><th>BSU</th><th>RW/RT</th><th>Nama Sampah</th><th>Jenis</th><th>Berat</th><th>Harga per Kg</th><th>Total Nilai</th>' +
            '</tr></thead><tbody>' + tabelDetail + '</tbody></tr>' +
            '<div class="footer">' +
            '<p>Dicetak pada: ' + tglCetak + '</p>' +
            '<p>Dicetak oleh: ' + admin + '</p>' +
            '<p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p>' +
            '</div>' +
            '<div class="signature">' +
            '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Kepala Bank Sampah</p></div>' +
            '<div class="signature-box"><div class="signature-line"></div><p>Mengetahui,<br>Ketua RW</p></div>' +
            '</div>' +
            '</body></html>';
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        showToast('Laporan siap dicetak', false);
    }
    
    function exportToWord(laporan, jenisLaporan) {
        var tglCetak = formatTanggalIndo(new Date());
        var admin = sessionStorage.getItem('adminName') || 'Admin';
        
        var tabelDetail = '';
        for (var i = 0; i < laporan.data.length; i++) {
            var item = laporan.data[i];
            tabelDetail += '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td>' + (item.bsu ? escapeHtml(item.bsu) : '-') + '</td>' +
                '<td>' + item.rw + ' - ' + item.rt + '</td>' +
                '<td>' + escapeHtml(item.nama) + '</td>' +
                '<td>' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td>' +
                '<td>' + item.berat.toFixed(2) + ' kg</td>' +
                '<td>' + formatRupiah(item.hargaPerKg) + '</td>' +
                '<td>' + formatRupiah(item.berat * item.hargaPerKg) + '</td>' +
                '</tr>';
        }
        
        var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + laporan.title + '</title><style>' +
            'body { font-family: Calibri, Arial, sans-serif; padding: 40px; }' +
            'h1 { color: #2e7d32; text-align: center; }' +
            '.periode { background: #e8f5e9; padding: 10px; margin: 20px 0; text-align: center; }' +
            '.filter-info { background: #e3f2fd; padding: 8px; margin: 10px 0; text-align: center; font-size: 11px; }' +
            '.stats { display: flex; gap: 20px; margin: 20px 0; }' +
            '.stat-card { flex: 1; background: #f5f5f5; padding: 15px; text-align: center; }' +
            '.stat-value { font-size: 20px; font-weight: bold; color: #2e7d32; }' +
            '.info-box { background: #e3f2fd; padding: 10px; margin: 20px 0; text-align: center; }' +
            'table { width: 100%; border-collapse: collapse; margin: 20px 0; }' +
            'th { background: #2e7d32; color: white; padding: 10px; }' +
            'td { padding: 8px; border-bottom: 1px solid #ddd; }' +
            '.footer { margin-top: 40px; text-align: center; font-size: 11px; }' +
            '</style></head><body>' +
            '<h1>BANK SAMPAH DIGITAL</h1>' +
            '<h2 style="text-align:center;">' + laporan.title + '</h2>' +
            '<div class="periode"><strong>Periode:</strong> ' + laporan.periode + '</div>' +
            '<div class="filter-info"><strong>Filter:</strong> ' + laporan.filterInfo + '</div>' +
            '<div class="stats">' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalOrganik.toFixed(2) + ' kg</div><div>Sampah Organik</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalNonorganik.toFixed(2) + ' kg</div><div>Sampah Nonorganik</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalBerat.toFixed(2) + ' kg</div><div>Total Semua</div></div>' +
            '</div>' +
            '<div class="info-box"><strong>Total Nilai: ' + formatRupiah(laporan.totalNilai) + '</strong> | Jumlah Item: ' + laporan.jumlahItem + '</div>' +
            '<h3>Detail Data Sampah</h3>' +
            '<table><thead><tr><th>No</th><th>BSU</th><th>RW/RT</th><th>Nama Sampah</th><th>Jenis</th><th>Berat</th><th>Harga</th><th>Total</th></tr></thead><tbody>' +
            tabelDetail + '</tbody></table>' +
            '<div class="footer"><p>Dicetak: ' + tglCetak + '</p><p>Dicetak oleh: ' + admin + '</p><p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p></div>' +
            '</body></html>';
        
        var blob = new Blob([htmlContent], { type: 'application/msword' });
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.href = url;
        var fileName = 'Laporan_Bank_Sampah_' + (jenisLaporan === 'mingguan' ? 'Mingguan' : 'Bulanan') + '_' + new Date().toISOString().slice(0,10) + '.doc';
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Laporan berhasil diekspor ke Word', false);
    }
    
    function setupLaporanModal() {
        var modal = document.getElementById('laporanModal');
        var modalPeriode = document.getElementById('modalPeriode');
        var modalFilterInfo = document.getElementById('modalFilterInfo');
        var exportPDFBtn = document.getElementById('exportPDFBtn');
        var exportWordBtn = document.getElementById('exportWordBtn');
        var closeBtn = document.querySelector('.modal-close');
        var btnMingguan = document.getElementById('btnLaporanMingguan');
        var btnBulanan = document.getElementById('btnLaporanBulanan');
        
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
                var laporan = generateLaporanMingguan();
                showModal(laporan, 'mingguan');
            });
        }
        
        if (btnBulanan) {
            btnBulanan.addEventListener('click', function() {
                var laporan = generateLaporanBulanan();
                showModal(laporan, 'bulanan');
            });
        }
        
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', function() {
                if (currentLaporan) {
                    exportToPDF(currentLaporan, currentJenis);
                    modal.style.display = 'none';
                }
            });
        }
        
        if (exportWordBtn) {
            exportWordBtn.addEventListener('click', function() {
                if (currentLaporan) {
                    exportToWord(currentLaporan, currentJenis);
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
    
    // ==================== CRUD OPERATIONS ====================
    
    window.tambahSampah = function() {
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
            harga = getHargaOtomatis(nama, jenis);
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
        
        saveData();
        refreshAll();
        
        document.getElementById('namaSampah').value = '';
        document.getElementById('beratSampah').value = '1';
        document.getElementById('hargaSampah').value = '2000';
        
        showToast('Data berhasil ditambahkan!', false);
    };
    
    window.editSampah = function(id) {
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
            newHarga = getHargaOtomatis(newNama, newJenis);
        }
        
        item.bsu = newBSU || null;
        item.rw = newRW;
        item.rt = newRT;
        item.nama = newNama.trim();
        item.jenis = newJenis;
        item.berat = newBerat;
        item.hargaPerKg = newHarga;
        
        saveData();
        refreshAll();
        showToast('Data berhasil diupdate!', false);
    };
    
    window.deleteSampah = function(id) {
        if (confirm('Yakin ingin menghapus data ini?')) {
            var newArray = [];
            for (var i = 0; i < daftarSampah.length; i++) {
                if (daftarSampah[i].id !== id) {
                    newArray.push(daftarSampah[i]);
                }
            }
            daftarSampah = newArray;
            saveData();
            refreshAll();
            showToast('Data berhasil dihapus!', false);
        }
    };
    
    function setupAutoHarga() {
        var namaInput = document.getElementById('namaSampah');
        var jenisSelect = document.querySelectorAll('.type-option');
        var hargaInput = document.getElementById('hargaSampah');
        
        if (namaInput) {
            namaInput.addEventListener('input', function() {
                var jenis = document.getElementById('jenisSampah').value;
                var hargaOtomatisValue = getHargaOtomatis(this.value, jenis);
                if (hargaInput && hargaOtomatisValue) {
                    hargaInput.value = hargaOtomatisValue;
                }
            });
        }
        
        for (var i = 0; i < jenisSelect.length; i++) {
            jenisSelect[i].addEventListener('click', function() {
                var jenis = this.getAttribute('data-type');
                var nama = namaInput ? namaInput.value : '';
                var hargaOtomatisValue = getHargaOtomatis(nama, jenis);
                if (hargaInput && hargaOtomatisValue) {
                    hargaInput.value = hargaOtomatisValue;
                }
            });
        }
        
        populateSampahDatalist();
        renderPresetSampah();
    }
    
    function refreshAll() {
        updateStats();
        updateStatistikPage();
        renderDataList();
    }
    
    function navigateTo(page) {
        var pages = ['dashboardPage', 'kelolaPage', 'statistikPage'];
        for (var i = 0; i < pages.length; i++) {
            var el = document.getElementById(pages[i]);
            if (el) el.classList.remove('active');
        }
        var targetPage = document.getElementById(page + 'Page');
        if (targetPage) targetPage.classList.add('active');
        
        var menuItems = document.querySelectorAll('.menu-item, .nav-bot-item');
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.remove('active');
            if (menuItems[i].getAttribute('data-page') === page) {
                menuItems[i].classList.add('active');
            }
        }
        var titles = { dashboard: 'Dashboard', kelola: 'Kelola Sampah', statistik: 'Statistik' };
        var pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.innerText = titles[page];
    }
    
    function setupFilters() {
        var filterBSU = document.getElementById('filterBSU');
        var filterRW = document.getElementById('filterRW');
        var filterRT = document.getElementById('filterRT');
        var statFilterBSU = document.getElementById('statFilterBSU');
        var statFilterRW = document.getElementById('statFilterRW');
        var statFilterRT = document.getElementById('statFilterRT');
        var statFilterJenis = document.getElementById('statFilterJenisSampah');
        
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
    }
    
    // Event listeners
    var menuItems = document.querySelectorAll('.menu-item, .nav-bot-item');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', function(e) {
            e.preventDefault();
            var page = this.getAttribute('data-page');
            if (page && page !== 'keluar') navigateTo(page);
        });
    }
    
    var tambahBtn = document.getElementById('tambahSampahBtn');
    if (tambahBtn) {
        tambahBtn.addEventListener('click', window.tambahSampah);
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
            sessionStorage.removeItem('adminName');
            window.location.href = 'menu_login.html';
        });
    }
    
    var logoutMobileBtn = document.getElementById('logoutMobileBtn');
    if (logoutMobileBtn) {
        logoutMobileBtn.addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('adminName');
            window.location.href = 'menu_login.html';
        });
    }
    
    // Inisialisasi BSU Selector
    const bsuSearchInput = document.getElementById('bsuSearchInput');
    if (bsuSearchInput) {
        bsuSearchInput.addEventListener('input', function(e) {
            renderBSUList(e.target.value);
        });
    }
    
    const clearBsuBtn = document.getElementById('clearBsuBtn');
    if (clearBsuBtn) {
        clearBsuBtn.addEventListener('click', clearSelectedBSU);
    }
    
    renderBSUList('');
    
    // Inisialisasi
    setupAutoHarga();
    setupFilters();
    setupLaporanModal();
    loadData();
});
