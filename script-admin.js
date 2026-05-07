// ADMIN SCRIPT - VERSI FINAL UNTUK ANDROID

document.addEventListener('DOMContentLoaded', function() {
    // ==================== DATA ====================
    let daftarSampah = [];
    let currentFilter = 'all';
    let currentFilterRW = 'all';
    let currentFilterRT = 'all';
    let currentStatFilterRW = 'all';
    let currentStatFilterRT = 'all';
    let currentStatFilterJenis = 'all';
    const STORAGE_KEY = 'bankSampahData';
    
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const hargaOtomatis = {
        organik: {
            default: 2000,
            list: { "daun": 1500, "sayur": 1200, "buah": 1800, "makanan": 1200, "kompos": 1500, "sisa": 1200, "organik": 2000 }
        },
        nonorganik: {
            default: 3500,
            list: { "plastik": 4000, "botol": 4500, "kardus": 2800, "kertas": 2500, "kaleng": 5000, "besi": 6000, "kaca": 3000, "alumunium": 10000, "nonorganik": 3500 }
        }
    };
    
    // ==================== FUNGSI BANTU ====================
    function getHargaOtomatis(namaSampah, jenis) {
        var namaLower = namaSampah.toLowerCase();
        var hargaData = hargaOtomatis[jenis];
        for (var keyword in hargaData.list) {
            if (namaLower.includes(keyword)) return hargaData.list[keyword];
        }
        return hargaData.default;
    }
    
    function formatRupiah(angka) {
        return 'Rp ' + angka.toLocaleString('id-ID');
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            return m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;');
        });
    }
    
    function showToast(message, isError) {
        var toast = document.getElementById('toast');
        var toastMessage = document.getElementById('toastMessage');
        if (!toast || !toastMessage) return;
        toastMessage.innerText = message;
        toast.classList.add('show');
        toast.style.background = isError ? '#ef5350' : '#2e7d32';
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }
    
    // ==================== SIDEBAR ====================
    function initSidebar() {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');
        var menuToggle = document.getElementById('menuToggle');
        
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        menuToggle.onclick = function(e) {
            e.stopPropagation();
            openSidebar();
        };
        
        overlay.onclick = closeSidebar;
        
        var touchStartX = 0;
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        document.addEventListener('touchend', function(e) {
            var touchEndX = e.changedTouches[0].screenX;
            if (touchStartX < 50 && touchEndX - touchStartX > 60 && !sidebar.classList.contains('open')) {
                openSidebar();
            } else if (sidebar.classList.contains('open') && touchEndX - touchStartX < -50) {
                closeSidebar();
            }
        });
    }
    
    // ==================== NAVIGASI ====================
    function navigateTo(page) {
        // Sembunyikan semua page
        document.getElementById('dashboardPage').classList.remove('active');
        document.getElementById('kelolaPage').classList.remove('active');
        document.getElementById('statistikPage').classList.remove('active');
        
        // Tampilkan page yang dipilih
        document.getElementById(page + 'Page').classList.add('active');
        
        // Update active menu di sidebar
        var menuItems = document.querySelectorAll('.menu-item');
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.remove('active');
            if (menuItems[i].getAttribute('data-page') === page) {
                menuItems[i].classList.add('active');
            }
        }
        
        // Update active menu di bottom nav
        var navItems = document.querySelectorAll('.nav-bot-item');
        for (var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove('active');
            if (navItems[i].getAttribute('data-page') === page) {
                navItems[i].classList.add('active');
            }
        }
        
        // Update title
        var titles = { dashboard: 'Dashboard', kelola: 'Kelola Sampah', statistik: 'Statistik' };
        document.getElementById('pageTitle').innerText = titles[page];
        
        // Tutup sidebar di mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // ==================== CRUD OPERATIONS ====================
    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarSampah));
    }
    
    function loadData() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            daftarSampah = JSON.parse(stored);
        } else {
            daftarSampah = [
                { id: Date.now() + 1, rw: "RW01", rt: "RT01", nama: "Daun Kering", jenis: "organik", berat: 12.5, hargaPerKg: 1500 },
                { id: Date.now() + 2, rw: "RW01", rt: "RT02", nama: "Sisa Makanan", jenis: "organik", berat: 8.2, hargaPerKg: 1200 },
                { id: Date.now() + 3, rw: "RW02", rt: "RT01", nama: "Botol Plastik", jenis: "nonorganik", berat: 5.0, hargaPerKg: 3500 },
                { id: Date.now() + 4, rw: "RW02", rt: "RT03", nama: "Kardus Bekas", jenis: "nonorganik", berat: 7.3, hargaPerKg: 2800 },
                { id: Date.now() + 5, rw: "RW03", rt: "RT02", nama: "Kaleng Minuman", jenis: "nonorganik", berat: 3.2, hargaPerKg: 4200 }
            ];
            saveData();
        }
        refreshAll();
    }
    
    function filterDataByRTandRW(data, rw, rt) {
        var filtered = data.slice();
        if (rw !== 'all') filtered = filtered.filter(function(item) { return item.rw === rw; });
        if (rt !== 'all') filtered = filtered.filter(function(item) { return item.rt === rt; });
        return filtered;
    }
    
    function updateStats() {
        var filteredData = filterDataByRTandRW(daftarSampah, currentFilterRW, currentFilterRT);
        var totalOrganik = 0, totalNonorganik = 0;
        for (var i = 0; i < filteredData.length; i++) {
            if (filteredData[i].jenis === 'organik') totalOrganik += filteredData[i].berat;
            else totalNonorganik += filteredData[i].berat;
        }
        var totalSemua = totalOrganik + totalNonorganik;
        var organikPercent = totalSemua > 0 ? (totalOrganik / totalSemua) * 100 : 0;
        
        document.getElementById('totalOrganik').innerText = totalOrganik.toFixed(2);
        document.getElementById('totalNonorganik').innerText = totalNonorganik.toFixed(2);
        document.getElementById('totalSemua').innerText = totalSemua.toFixed(2);
        
        var progressBars = document.querySelectorAll('.progress-bar');
        if (progressBars[0]) progressBars[0].style.width = organikPercent + '%';
        if (progressBars[1]) progressBars[1].style.width = (100 - organikPercent) + '%';
        
        renderRTandRWTable();
    }
    
    function renderRTandRWTable() {
        var container = document.getElementById('rtRwTableBody');
        var filteredData = filterDataByRTandRW(daftarSampah, currentFilterRW, currentFilterRT);
        
        if (filteredData.length === 0) {
            container.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada数据</td></tr>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < filteredData.length; i++) {
            var item = filteredData[i];
            html += '<tr>' +
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
    
    function renderDataList() {
        var container = document.getElementById('sampahList');
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
            html += '<div class="data-item" data-id="' + item.id + '">' +
                '<div class="data-info">' +
                '<div class="data-number">' + (i + 1) + '</div>' +
                '<div><strong>' + item.rw + ' - ' + item.rt + '</strong></div>' +
                '<div class="data-name">' + escapeHtml(item.nama) + '</div>' +
                '<span style="font-size:0.65rem;">' + (item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</span>' +
                '<div class="data-weight">' + item.berat.toFixed(2) + ' kg</div>' +
                '<div class="data-price">Rp ' + item.hargaPerKg.toLocaleString() + '/kg</div>' +
                '<div class="data-total">Rp ' + (item.berat * item.hargaPerKg).toLocaleString() + '</div>' +
                '</div>' +
                '<div class="data-actions">' +
                '<button class="edit-data" data-id="' + item.id + '"><i class="fas fa-edit"></i></button>' +
                '<button class="delete-data" data-id="' + item.id + '"><i class="fas fa-trash-alt"></i></button>' +
                '</div>' +
                '</div>';
        }
        container.innerHTML = html;
        
        // Attach event listeners to edit and delete buttons
        document.querySelectorAll('.edit-data').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                editSampah(id);
            });
        });
        
        document.querySelectorAll('.delete-data').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                deleteSampah(id);
            });
        });
    }
    
    function updateStatistikPage() {
        var filteredData = filterDataByRTandRW(daftarSampah, currentStatFilterRW, currentStatFilterRT);
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
        document.getElementById('statOrganikBerat').innerText = totalOrganik.toFixed(2) + ' kg';
        document.getElementById('statOrganikItem').innerText = itemOrganik;
        document.getElementById('statNonorganikBerat').innerText = totalNonorganik.toFixed(2) + ' kg';
        document.getElementById('statNonorganikItem').innerText = itemNonorganik;
        document.getElementById('statTotalBerat').innerText = totalSemua.toFixed(2) + ' kg';
        document.getElementById('statTotalItem').innerText = filteredData.length;
        
        var organikDeg = totalSemua > 0 ? (totalOrganik / totalSemua) * 360 : 0;
        var organikSegment = document.querySelector('.organik-segment');
        var nonorganikSegment = document.querySelector('.nonorganik-segment');
        if (organikSegment) organikSegment.style.background = 'conic-gradient(#2e7d32 ' + organikDeg + 'deg, #2e7d32 ' + organikDeg + 'deg, transparent ' + organikDeg + 'deg)';
        if (nonorganikSegment) nonorganikSegment.style.background = 'conic-gradient(#f9a825 ' + (360 - organikDeg) + 'deg, #f9a825 ' + (360 - organikDeg) + 'deg, transparent ' + (360 - organikDeg) + 'deg)';
        document.getElementById('pieTotal').innerText = totalSemua.toFixed(1);
        document.getElementById('legendOrganik').innerText = totalOrganik.toFixed(2);
        document.getElementById('legendNonorganik').innerText = totalNonorganik.toFixed(2);
        
        // Render tabel per jenis
        var container = document.getElementById('jenisSampahTableBody');
        var html = '';
        for (var jenis in jenisSampahMap) {
            var data = jenisSampahMap[jenis];
            html += '<tr><td>' + (jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik') + '</td><td>' + data.berat.toFixed(2) + ' kg</td><td>' + data.count + ' item</td><td>Rp ' + data.nilai.toLocaleString() + '</td></tr>';
        }
        container.innerHTML = html || '<tr><td colspan="4" style="text-align: center;">Tidak ada data</td></tr>';
    }
    
    function refreshAll() {
        updateStats();
        updateStatistikPage();
        renderDataList();
    }
    
    // ==================== CRUD ====================
    function tambahSampah() {
        var rw = document.getElementById('inputRW').value;
        var rt = document.getElementById('inputRT').value;
        var nama = document.getElementById('namaSampah').value;
        var jenis = document.getElementById('jenisSampah').value;
        var berat = parseFloat(document.getElementById('beratSampah').value);
        var harga = parseInt(document.getElementById('hargaSampah').value);
        
        if (!nama.trim()) { showToast('Nama sampah wajib diisi!', true); return; }
        if (isNaN(berat) || berat <= 0) { showToast('Berat harus lebih dari 0 kg!', true); return; }
        if (isNaN(harga) || harga <= 0) harga = getHargaOtomatis(nama, jenis);
        
        daftarSampah.push({
            id: Date.now(),
            rw: rw, rt: rt, nama: nama.trim(), jenis: jenis, berat: berat, hargaPerKg: harga
        });
        saveData();
        refreshAll();
        document.getElementById('namaSampah').value = '';
        document.getElementById('beratSampah').value = '1';
        document.getElementById('hargaSampah').value = '2000';
        showToast('Data berhasil ditambahkan!', false);
    }
    
    function editSampah(id) {
        var item = daftarSampah.find(function(i) { return i.id === id; });
        if (!item) return;
        
        var newRW = prompt('Edit RW (RW01/RW02/RW03):', item.rw);
        if (!newRW) return;
        var newRT = prompt('Edit RT (RT01/RT02/RT03/RT04):', item.rt);
        if (!newRT) return;
        var newNama = prompt('Edit Nama Sampah:', item.nama);
        if (!newNama) return;
        var newJenis = prompt('Jenis (organik/nonorganik):', item.jenis);
        if (newJenis !== 'organik' && newJenis !== 'nonorganik') { showToast('Jenis harus organik atau nonorganik', true); return; }
        var newBerat = parseFloat(prompt('Berat (kg):', item.berat));
        if (isNaN(newBerat) || newBerat <= 0) { showToast('Berat tidak valid', true); return; }
        var newHarga = parseInt(prompt('Harga per Kg (Rp):', item.hargaPerKg));
        if (isNaN(newHarga) || newHarga < 0) newHarga = getHargaOtomatis(newNama, newJenis);
        
        item.rw = newRW;
        item.rt = newRT;
        item.nama = newNama.trim();
        item.jenis = newJenis;
        item.berat = newBerat;
        item.hargaPerKg = newHarga;
        saveData();
        refreshAll();
        showToast('Data berhasil diupdate!', false);
    }
    
    function deleteSampah(id) {
        if (confirm('Yakin ingin menghapus data ini?')) {
            daftarSampah = daftarSampah.filter(function(item) { return item.id !== id; });
            saveData();
            refreshAll();
            showToast('Data berhasil dihapus!', false);
        }
    }
    
    // ==================== LAPORAN ====================
    function generateLaporanMingguan() {
        var today = new Date();
        var weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
        for (var i = 0; i < daftarSampah.length; i++) {
            var item = daftarSampah[i];
            if (item.jenis === 'organik') totalOrganik += item.berat;
            else totalNonorganik += item.berat;
            totalNilai += (item.berat * item.hargaPerKg);
        }
        return {
            title: 'Laporan Mingguan Bank Sampah Digital',
            periode: weekStart.toLocaleDateString('id-ID') + ' s/d ' + today.toLocaleDateString('id-ID'),
            data: daftarSampah,
            totalOrganik: totalOrganik, totalNonorganik: totalNonorganik,
            totalBerat: totalOrganik + totalNonorganik, totalNilai: totalNilai, jumlahItem: daftarSampah.length
        };
    }
    
    function generateLaporanBulanan() {
        var today = new Date();
        var totalOrganik = 0, totalNonorganik = 0, totalNilai = 0;
        for (var i = 0; i < daftarSampah.length; i++) {
            var item = daftarSampah[i];
            if (item.jenis === 'organik') totalOrganik += item.berat;
            else totalNonorganik += item.berat;
            totalNilai += (item.berat * item.hargaPerKg);
        }
        return {
            title: 'Laporan Bulanan Bank Sampah Digital',
            periode: namaBulan[today.getMonth()] + ' ' + today.getFullYear(),
            data: daftarSampah,
            totalOrganik: totalOrganik, totalNonorganik: totalNonorganik,
            totalBerat: totalOrganik + totalNonorganik, totalNilai: totalNilai, jumlahItem: daftarSampah.length
        };
    }
    
    function exportToPDF(laporan) {
        var printWindow = window.open('', '_blank');
        var admin = sessionStorage.getItem('adminName') || 'Admin';
        var tabelDetail = '';
        for (var i = 0; i < laporan.data.length; i++) {
            var item = laporan.data[i];
            tabelDetail += '<tr><td>' + (i+1) + '</td><td>' + item.rw + ' - ' + item.rt + '</td><td>' + escapeHtml(item.nama) + '</td><td>' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td><td style="text-align:right;">' + item.berat.toFixed(2) + ' kg</td><td style="text-align:right;">' + formatRupiah(item.hargaPerKg) + '</td><td style="text-align:right;">' + formatRupiah(item.berat * item.hargaPerKg) + '</td></tr>';
        }
        var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + laporan.title + '</title><style>' +
            'body{font-family:Arial;padding:20px}h1,h2{text-align:center;color:#2e7d32}.periode{background:#e8f5e9;padding:10px;margin:20px 0;text-align:center}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#2e7d32;color:#fff;padding:8px}td{padding:6px;border-bottom:1px solid #ddd}' +
            '</style></head><body>' +
            '<h1>BANK SAMPAH DIGITAL</h1>' +
            '<h2>' + laporan.title + '</h2>' +
            '<div class="periode"><strong>Periode:</strong> ' + laporan.periode + '</div>' +
            '<p><strong>Total Organik:</strong> ' + laporan.totalOrganik.toFixed(2) + ' kg | <strong>Total Nonorganik:</strong> ' + laporan.totalNonorganik.toFixed(2) + ' kg | <strong>Total Semua:</strong> ' + laporan.totalBerat.toFixed(2) + ' kg</p>' +
            '<p><strong>Total Nilai:</strong> ' + formatRupiah(laporan.totalNilai) + ' | <strong>Jumlah Transaksi:</strong> ' + laporan.jumlahItem + '</p>' +
            '<h3>Detail Data Sampah</h3>' +
            '<table><thead><tr><th>No</th><th>RW/RT</th><th>Nama</th><th>Jenis</th><th>Berat</th><th>Harga/Kg</th><th>Total</th></tr></thead><tbody>' + tabelDetail + '</tbody></tr>' +
            '<p style="margin-top:30px;">Dicetak oleh: ' + admin + '</p>' +
            '</body></html>';
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        showToast('Laporan siap dicetak', false);
    }
    
    function exportToWord(laporan, jenisLaporan) {
        var admin = sessionStorage.getItem('adminName') || 'Admin';
        var tabelDetail = '';
        for (var i = 0; i < laporan.data.length; i++) {
            var item = laporan.data[i];
            tabelDetail += '<tr><td>' + (i+1) + '</td><td>' + item.rw + ' - ' + item.rt + '</td><td>' + escapeHtml(item.nama) + '</td><td>' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td><td>' + item.berat.toFixed(2) + ' kg</td><td>' + formatRupiah(item.hargaPerKg) + '</td><td>' + formatRupiah(item.berat * item.hargaPerKg) + '</td>' + '</tr>';
        }
        var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + laporan.title + '</title><style>' +
            'body{font-family:Calibri;padding:20px}h1,h2{text-align:center;color:#2e7d32}table{width:100%;border-collapse:collapse}th{background:#2e7d32;color:#fff;padding:8px}td{padding:6px;border-bottom:1px solid #ddd}' +
            '</style></head><body>' +
            '<h1>BANK SAMPAH DIGITAL</h1>' +
            '<h2>' + laporan.title + '</h2>' +
            '<p><strong>Periode:</strong> ' + laporan.periode + '</p>' +
            '<p><strong>Total Organik:</strong> ' + laporan.totalOrganik.toFixed(2) + ' kg | <strong>Total Nonorganik:</strong> ' + laporan.totalNonorganik.toFixed(2) + ' kg | <strong>Total Semua:</strong> ' + laporan.totalBerat.toFixed(2) + ' kg</p>' +
            '<p><strong>Total Nilai:</strong> ' + formatRupiah(laporan.totalNilai) + '</p>' +
            '<h3>Detail Data</h3>' +
            '<table><thead><tr><th>No</th><th>RW/RT</th><th>Nama</th><th>Jenis</th><th>Berat</th><th>Harga</th><th>Total</th></tr></thead><tbody>' + tabelDetail + '</tbody></table>' +
            '<p>Dicetak oleh: ' + admin + '</p>' +
            '</body></html>';
        var blob = new Blob([htmlContent], { type: 'application/msword' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Laporan_Bank_Sampah_' + (jenisLaporan === 'mingguan' ? 'Mingguan' : 'Bulanan') + '.doc';
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('Laporan berhasil diekspor ke Word', false);
    }
    
    function setupLaporanModal() {
        var modal = document.getElementById('laporanModal');
        var modalPeriode = document.getElementById('modalPeriode');
        var closeBtn = document.querySelector('.modal-close');
        var btnMingguan = document.getElementById('btnLaporanMingguan');
        var btnBulanan = document.getElementById('btnLaporanBulanan');
        var exportPDFBtn = document.getElementById('exportPDFBtn');
        var exportWordBtn = document.getElementById('exportWordBtn');
        var currentLaporan = null;
        var currentJenis = null;
        
        btnMingguan.onclick = function() { currentLaporan = generateLaporanMingguan(); currentJenis = 'mingguan'; modalPeriode.innerHTML = '<strong>Periode:</strong> ' + currentLaporan.periode; modal.style.display = 'block'; };
        btnBulanan.onclick = function() { currentLaporan = generateLaporanBulanan(); currentJenis = 'bulanan'; modalPeriode.innerHTML = '<strong>Periode:</strong> ' + currentLaporan.periode; modal.style.display = 'block'; };
        exportPDFBtn.onclick = function() { if (currentLaporan) { exportToPDF(currentLaporan); modal.style.display = 'none'; } };
        exportWordBtn.onclick = function() { if (currentLaporan) { exportToWord(currentLaporan, currentJenis); modal.style.display = 'none'; } };
        closeBtn.onclick = function() { modal.style.display = 'none'; };
        window.onclick = function(e) { if (e.target === modal) modal.style.display = 'none'; };
    }
    
    // ==================== SETUP FILTERS ====================
    function setupFilters() {
        document.getElementById('filterRW').addEventListener('change', function(e) {
            currentFilterRW = e.target.value;
            refreshAll();
        });
        document.getElementById('filterRT').addEventListener('change', function(e) {
            currentFilterRT = e.target.value;
            refreshAll();
        });
        document.getElementById('statFilterRW').addEventListener('change', function(e) {
            currentStatFilterRW = e.target.value;
            updateStatistikPage();
        });
        document.getElementById('statFilterRT').addEventListener('change', function(e) {
            currentStatFilterRT = e.target.value;
            updateStatistikPage();
        });
        document.getElementById('statFilterJenisSampah').addEventListener('change', function(e) {
            currentStatFilterJenis = e.target.value;
            updateStatistikPage();
        });
        document.getElementById('filterJenis').addEventListener('change', function(e) {
            currentFilter = e.target.value;
            renderDataList();
        });
    }
    
    // ==================== SETUP AUTO HARGA ====================
    function setupAutoHarga() {
        var namaInput = document.getElementById('namaSampah');
        var jenisBtns = document.querySelectorAll('.type-option');
        var hargaInput = document.getElementById('hargaSampah');
        
        namaInput.addEventListener('input', function() {
            var jenis = document.getElementById('jenisSampah').value;
            hargaInput.value = getHargaOtomatis(this.value, jenis);
        });
        
        jenisBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                jenisBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                var jenis = this.getAttribute('data-type');
                document.getElementById('jenisSampah').value = jenis;
                hargaInput.value = getHargaOtomatis(namaInput.value, jenis);
            });
        });
    }
    
    // ==================== SETUP NAVIGATION ====================
    function setupNavigation() {
        document.querySelectorAll('.menu-item').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var page = this.getAttribute('data-page');
                if (page) navigateTo(page);
            });
        });
        document.querySelectorAll('.nav-bot-item').forEach(function(btn) {
            if (btn.id !== 'logoutMobileBtn') {
                btn.addEventListener('click', function() {
                    var page = this.getAttribute('data-page');
                    if (page) navigateTo(page);
                });
            }
        });
    }
    
    // ==================== SETUP LOGOUT ====================
    function setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('adminName');
            window.location.href = 'menu_login.html';
        });
        document.getElementById('logoutMobileBtn').addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('adminName');
            window.location.href = 'menu_login.html';
        });
    }
    
    // ==================== CEK LOGIN ====================
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'menu_login.html';
        return;
    }
    
    // Set admin name
    var adminName = sessionStorage.getItem('adminName') || 'Admin';
    document.getElementById('adminName').innerText = adminName;
    document.getElementById('welcomeName').innerText = adminName;
    
    // ==================== INIT ====================
    initSidebar();
    setupNavigation();
    setupFilters();
    setupAutoHarga();
    setupLaporanModal();
    setupLogout();
    document.getElementById('tambahSampahBtn').addEventListener('click', tambahSampah);
    loadData();
});
