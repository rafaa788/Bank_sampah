// ADMIN SCRIPT - VERSI LENGKAP DENGAN HARGA OTOMATIS & LAPORAN
// TANPA KARAKTER ANEH - BERSIH 100%

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
    const STORAGE_KEY = 'bankSampahData';
    
    // Data harga otomatis (LENGKAP)
    const hargaOtomatis = {
        organik: {
            default: 2000,
            list: {
                "daun": 1500,
                "sayur": 1200,
                "buah": 1800,
                "makanan": 1200,
                "kompos": 1500,
                "sisa": 1200
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
                "kuningan": 30000
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
        } else {
            daftarSampah = [
                { id: Date.now() + 1, nama: "Daun Kering", jenis: "organik", berat: 12.5, hargaPerKg: 1500 },
                { id: Date.now() + 2, nama: "Sisa Makanan", jenis: "organik", berat: 8.2, hargaPerKg: 1200 },
                { id: Date.now() + 3, nama: "Botol Plastik", jenis: "nonorganik", berat: 5.0, hargaPerKg: 3500 },
                { id: Date.now() + 4, nama: "Kardus Bekas", jenis: "nonorganik", berat: 7.3, hargaPerKg: 2800 },
                { id: Date.now() + 5, nama: "Kaleng Minuman", jenis: "nonorganik", berat: 3.2, hargaPerKg: 4200 }
            ];
            saveData();
        }
        refreshAll();
    }
    
    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarSampah));
    }
    
    // Update stats
    function updateStats() {
        var totalOrganik = 0, totalNonorganik = 0;
        var itemOrganik = 0, itemNonorganik = 0;
        
        for (var i = 0; i < daftarSampah.length; i++) {
            var item = daftarSampah[i];
            if (item.jenis === 'organik') {
                totalOrganik += item.berat;
                itemOrganik++;
            } else {
                totalNonorganik += item.berat;
                itemNonorganik++;
            }
        }
        
        var totalSemua = totalOrganik + totalNonorganik;
        var totalItems = daftarSampah.length;
        var organikPercent = totalSemua > 0 ? (totalOrganik / totalSemua) * 100 : 0;
        
        var totalOrganikEl = document.getElementById('totalOrganik');
        var totalNonorganikEl = document.getElementById('totalNonorganik');
        var totalSemuaEl = document.getElementById('totalSemua');
        var totalItemsEl = document.getElementById('totalItems');
        
        if (totalOrganikEl) totalOrganikEl.innerText = totalOrganik.toFixed(2);
        if (totalNonorganikEl) totalNonorganikEl.innerText = totalNonorganik.toFixed(2);
        if (totalSemuaEl) totalSemuaEl.innerText = totalSemua.toFixed(2);
        if (totalItemsEl) totalItemsEl.innerText = totalItems;
        
        var progressBars = document.querySelectorAll('.progress-bar');
        if (progressBars[0]) progressBars[0].style.width = organikPercent + '%';
        if (progressBars[1]) progressBars[1].style.width = (100 - organikPercent) + '%';
        
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
        
        var organikDeg = (organikPercent / 100) * 360;
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
    }
    
    // Render preview
    function renderPreview() {
        var container = document.getElementById('previewList');
        if (!container) return;
        
        var previewData = daftarSampah.slice(0, 5);
        
        if (previewData.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Tidak ada data</p></div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < previewData.length; i++) {
            var item = previewData[i];
            html += '<div class="preview-item">' +
                '<div class="preview-info">' +
                '<span class="preview-name">' + escapeHtml(item.nama) + '</span>' +
                '<span class="preview-badge badge-' + item.jenis + '">' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</span>' +
                '<span class="preview-weight">' + item.berat.toFixed(2) + ' kg</span>' +
                '</div>' +
                '<div class="preview-price">Rp ' + item.hargaPerKg.toLocaleString() + '/kg</div>' +
                '</div>';
        }
        container.innerHTML = html;
    }
    
    // Render data list
    function renderDataList() {
        var container = document.getElementById('sampahList');
        if (!container) return;
        
        var filteredData = daftarSampah;
        if (currentFilter !== 'all') {
            filteredData = [];
            for (var i = 0; i < daftarSampah.length; i++) {
                if (daftarSampah[i].jenis === currentFilter) {
                    filteredData.push(daftarSampah[i]);
                }
            }
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
                '<div class="data-name">' + escapeHtml(item.nama) + '</div>' +
                '<span class="preview-badge badge-' + item.jenis + '">' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</span>' +
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
    
    // Tambah sampah
    window.tambahSampah = function() {
        var nama = document.getElementById('namaSampah').value;
        var jenis = document.getElementById('jenisSampah').value;
        var berat = parseFloat(document.getElementById('beratSampah').value);
        var harga = parseInt(document.getElementById('hargaSampah').value);
        
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
            nama: nama.trim(),
            jenis: jenis,
            berat: berat,
            hargaPerKg: harga
        });
        
        saveData();
        refreshAll();
        
        document.getElementById('namaSampah').value = '';
        document.getElementById('beratSampah').value = '1';
        document.getElementById('hargaSampah').value = '2000';
        
        showToast('Data berhasil ditambahkan!', false);
    };
    
    // Edit sampah
    window.editSampah = function(id) {
        var item = null;
        for (var i = 0; i < daftarSampah.length; i++) {
            if (daftarSampah[i].id === id) {
                item = daftarSampah[i];
                break;
            }
        }
        if (!item) return;
        
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
        
        item.nama = newNama.trim();
        item.jenis = newJenis;
        item.berat = newBerat;
        item.hargaPerKg = newHarga;
        
        saveData();
        refreshAll();
        showToast('Data berhasil diupdate!', false);
    };
    
    // Delete sampah
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
    
    // Event listener untuk harga otomatis
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
    }
    
    // ==================== FITUR LAPORAN ====================
    var namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    function formatTanggalIndo(tanggal) {
        return namaHari[tanggal.getDay()] + ', ' + tanggal.getDate() + ' ' + namaBulan[tanggal.getMonth()] + ' ' + tanggal.getFullYear();
    }
    
    function formatRupiah(angka) {
        return 'Rp ' + angka.toLocaleString('id-ID');
    }
    
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
        var totalBerat = totalOrganik + totalNonorganik;
        
        return {
            title: 'Laporan Mingguan Bank Sampah',
            periode: formatTanggalIndo(weekStart) + ' s/d ' + formatTanggalIndo(today),
            data: daftarSampah,
            totalOrganik: totalOrganik,
            totalNonorganik: totalNonorganik,
            totalBerat: totalBerat,
            totalNilai: totalNilai,
            jumlahItem: daftarSampah.length
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
        var totalBerat = totalOrganik + totalNonorganik;
        
        return {
            title: 'Laporan Bulanan Bank Sampah',
            periode: namaBulan[today.getMonth()] + ' ' + today.getFullYear(),
            data: daftarSampah,
            totalOrganik: totalOrganik,
            totalNonorganik: totalNonorganik,
            totalBerat: totalBerat,
            totalNilai: totalNilai,
            jumlahItem: daftarSampah.length
        };
    }
    
    function exportToPDF(laporan, jenis) {
        var printWindow = window.open('', '_blank');
        var tglCetak = formatTanggalIndo(new Date());
        var tabelDetail = '';
        for (var i = 0; i < laporan.data.length; i++) {
            var item = laporan.data[i];
            tabelDetail += '<tr>' +
                '<td style="border:1px solid #ddd; padding:8px;">' + (i+1) + '</td>' +
                '<td style="border:1px solid #ddd; padding:8px;"><strong>' + escapeHtml(item.nama) + '</strong><tr>' +
                '<td style="border:1px solid #ddd; padding:8px;">' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td>' +
                '<td style="border:1px solid #ddd; padding:8px;">' + item.berat.toFixed(2) + ' kg' + '</td>' +
                '<td style="border:1px solid #ddd; padding:8px;">' + formatRupiah(item.hargaPerKg) + '</td>' +
                '<td style="border:1px solid #ddd; padding:8px;">' + formatRupiah(item.berat * item.hargaPerKg) + '</td>' +
                '</tr>';
        }
        
        var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Laporan Bank Sampah</title><style>' +
            'body { font-family: Arial, sans-serif; padding: 40px; }' +
            '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; }' +
            'h1 { color: #2e7d32; } .periode { background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center; margin: 20px 0; }' +
            '.stats { display: flex; gap: 20px; margin: 20px 0; } .stat-card { flex: 1; background: #f5f5f5; border-radius: 12px; padding: 15px; text-align: center; }' +
            '.stat-card.organik { border-top: 4px solid #2e7d32; } .stat-card.nonorganik { border-top: 4px solid #f9a825; }' +
            '.stat-value { font-size: 24px; font-weight: bold; color: #2e7d32; }' +
            '.info-box { background: #e3f2fd; border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center; }' +
            'table { width: 100%; border-collapse: collapse; margin: 20px 0; } th { background: #2e7d32; color: white; padding: 10px; text-align: left; }' +
            'td { padding: 8px; border-bottom: 1px solid #ddd; } .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; }' +
            '</style></head><body>' +
            '<div class="header"><h1>BANK SAMPAH DIGITAL</h1><p>Mengelola Sampah untuk Bumi yang Lebih Baik</p></div>' +
            '<div class="periode"><strong>Periode Laporan:</strong> ' + laporan.periode + '</div>' +
            '<div class="stats">' +
            '<div class="stat-card organik"><div class="stat-value">' + laporan.totalOrganik.toFixed(2) + ' kg</div><div>Total Sampah Organik</div></div>' +
            '<div class="stat-card nonorganik"><div class="stat-value">' + laporan.totalNonorganik.toFixed(2) + ' kg</div><div>Total Sampah Nonorganik</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalBerat.toFixed(2) + ' kg</div><div>Total Keseluruhan</div></div>' +
            '</div>' +
            '<div class="info-box"><strong>Total Nilai Sampah:</strong> ' + formatRupiah(laporan.totalNilai) + ' | <strong>Jumlah Jenis Sampah:</strong> ' + laporan.jumlahItem + ' item</div>' +
            '<h3>Detail Data Sampah</h3><table><thead><tr><th>No</th><th>Nama Sampah</th><th>Jenis</th><th>Berat</th><th>Harga per Kg</th><th>Total Nilai</th></tr></thead><tbody>' +
            tabelDetail + '</tbody></table>' +
            '<div class="footer"><p>Dicetak pada: ' + tglCetak + '</p><p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p></div>' +
            '</body></html>';
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        showToast('Laporan siap dicetak', false);
    }
    
    function exportToWord(laporan, jenis) {
        var tglCetak = formatTanggalIndo(new Date());
        var tabelDetail = '';
        for (var i = 0; i < laporan.data.length; i++) {
            var item = laporan.data[i];
            tabelDetail += '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td>' + escapeHtml(item.nama) + '</td>' +
                '<td>' + (item.jenis === 'organik' ? 'Organik' : 'Nonorganik') + '</td>' +
                '<td>' + item.berat.toFixed(2) + ' kg' + '</td>' +
                '<td>' + formatRupiah(item.hargaPerKg) + '</td>' +
                '<td>' + formatRupiah(item.berat * item.hargaPerKg) + '</td>' +
                '</tr>';
        }
        
        var htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Laporan Bank Sampah</title><style>' +
            'body { font-family: Calibri, Arial, sans-serif; padding: 40px; } h1 { color: #2e7d32; text-align: center; }' +
            '.periode { background: #e8f5e9; padding: 10px; margin: 20px 0; text-align: center; }' +
            '.stats { display: flex; gap: 20px; margin: 20px 0; } .stat-card { flex: 1; background: #f5f5f5; padding: 15px; text-align: center; }' +
            '.stat-value { font-size: 22px; font-weight: bold; color: #2e7d32; }' +
            '.info-box { background: #e3f2fd; padding: 10px; margin: 20px 0; text-align: center; }' +
            'table { width: 100%; border-collapse: collapse; margin: 20px 0; } th { background: #2e7d32; color: white; padding: 10px; }' +
            'td { padding: 8px; border-bottom: 1px solid #ddd; } .footer { margin-top: 40px; text-align: center; font-size: 11px; }' +
            '</style></head><body>' +
            '<h1>BANK SAMPAH DIGITAL</h1><h2 style="text-align:center;">' + laporan.title + '</h2>' +
            '<div class="periode"><strong>Periode:</strong> ' + laporan.periode + '</div>' +
            '<div class="stats">' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalOrganik.toFixed(2) + ' kg</div><div>Sampah Organik</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalNonorganik.toFixed(2) + ' kg</div><div>Sampah Nonorganik</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + laporan.totalBerat.toFixed(2) + ' kg</div><div>Total Semua</div></div>' +
            '</div>' +
            '<div class="info-box"><strong>Total Nilai: ' + formatRupiah(laporan.totalNilai) + '</strong> | Jumlah Item: ' + laporan.jumlahItem + ' jenis</div>' +
            '<h3>Detail Data Sampah</h3><table><thead><tr><th>No</th><th>Nama Sampah</th><th>Jenis</th><th>Berat</th><th>Harga</th><th>Total</th></tr></thead><tbody>' +
            tabelDetail + '</tbody></table>' +
            '<div class="footer"><p>Dicetak: ' + tglCetak + '</p><p>Bank Sampah Digital - Kelola Sampah, Selamatkan Bumi</p></div>' +
            '</body></html>';
        
        var blob = new Blob([htmlContent], { type: 'application/msword' });
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'Laporan_Bank_Sampah_' + jenis + '_' + new Date().toISOString().slice(0,10) + '.doc';
        link.click();
        URL.revokeObjectURL(url);
        showToast('Laporan berhasil diekspor ke Word', false);
    }
    
    function showLaporanModal() {
        var modal = document.getElementById('laporanModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'laporanModal';
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:10000;';
            modal.innerHTML = '<div style="background:white; border-radius:24px; max-width:500px; width:90%; padding:24px;">' +
                '<h2 style="color:#1b5e20;">Ekspor Laporan</h2>' +
                '<div style="display:flex; gap:15px; margin:20px 0;">' +
                '<button id="laporanMingguanBtn" style="flex:1; padding:12px; background:#2e7d32; color:white; border:none; border-radius:12px; cursor:pointer;">Mingguan</button>' +
                '<button id="laporanBulananBtn" style="flex:1; padding:12px; background:#f9a825; color:white; border:none; border-radius:12px; cursor:pointer;">Bulanan</button>' +
                '</div>' +
                '<div id="laporanPreview" style="background:#f5f5f5; border-radius:12px; padding:16px; margin-bottom:20px;"></div>' +
                '<div style="display:flex; gap:12px; justify-content:flex-end;">' +
                '<button id="exportPDFBtn" style="background:#dc3545; color:white; border:none; padding:10px 20px; border-radius:40px; cursor:pointer;">PDF</button>' +
                '<button id="exportWordBtn" style="background:#2e7d32; color:white; border:none; padding:10px 20px; border-radius:40px; cursor:pointer;">Word</button>' +
                '<button id="closeModalBtn" style="background:#6c757d; color:white; border:none; padding:10px 20px; border-radius:40px; cursor:pointer;">Tutup</button>' +
                '</div></div>';
            document.body.appendChild(modal);
            
            var currentLaporan = generateLaporanMingguan();
            var currentJenis = 'mingguan';
            var previewDiv = document.getElementById('laporanPreview');
            
            document.getElementById('laporanMingguanBtn').onclick = function() {
                currentLaporan = generateLaporanMingguan();
                currentJenis = 'mingguan';
                previewDiv.innerHTML = '<strong>Ringkasan Laporan Mingguan</strong><br>Periode: ' + currentLaporan.periode + '<br>Total Organik: ' + currentLaporan.totalOrganik.toFixed(2) + ' kg<br>Total Nonorganik: ' + currentLaporan.totalNonorganik.toFixed(2) + ' kg<br>Total Nilai: ' + formatRupiah(currentLaporan.totalNilai);
            };
            document.getElementById('laporanBulananBtn').onclick = function() {
                currentLaporan = generateLaporanBulanan();
                currentJenis = 'bulanan';
                previewDiv.innerHTML = '<strong>Ringkasan Laporan Bulanan</strong><br>Periode: ' + currentLaporan.periode + '<br>Total Organik: ' + currentLaporan.totalOrganik.toFixed(2) + ' kg<br>Total Nonorganik: ' + currentLaporan.totalNonorganik.toFixed(2) + ' kg<br>Total Nilai: ' + formatRupiah(currentLaporan.totalNilai);
            };
            document.getElementById('exportPDFBtn').onclick = function() { exportToPDF(currentLaporan, currentJenis); };
            document.getElementById('exportWordBtn').onclick = function() { exportToWord(currentLaporan, currentJenis); };
            document.getElementById('closeModalBtn').onclick = function() { modal.style.display = 'none'; };
            
            previewDiv.innerHTML = '<strong>Ringkasan Laporan Mingguan</strong><br>Periode: ' + currentLaporan.periode + '<br>Total Organik: ' + currentLaporan.totalOrganik.toFixed(2) + ' kg<br>Total Nonorganik: ' + currentLaporan.totalNonorganik.toFixed(2) + ' kg<br>Total Nilai: ' + formatRupiah(currentLaporan.totalNilai);
        }
        modal.style.display = 'flex';
    }
    
    function refreshAll() {
        updateStats();
        renderPreview();
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
    
    // Event listeners
    var menuItems = document.querySelectorAll('.menu-item, .nav-bot-item');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', function(e) {
            e.preventDefault();
            var page = this.getAttribute('data-page');
            if (page && page !== 'keluar') navigateTo(page);
        });
    }
    
    var goToKelolaBtn = document.getElementById('goToKelolaBtn');
    if (goToKelolaBtn) {
        goToKelolaBtn.addEventListener('click', function() { navigateTo('kelola'); });
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
    
    function tambahTombolLaporan() {
        var statistikPage = document.getElementById('statistikPage');
        if (statistikPage && !document.getElementById('btnLaporan')) {
            var btnLaporan = document.createElement('button');
            btnLaporan.id = 'btnLaporan';
            btnLaporan.className = 'btn-primary';
            btnLaporan.style.cssText = 'width:100%; margin-top:24px; background:linear-gradient(135deg, #2e7d32, #f9a825); border:none; padding:14px; border-radius:16px; color:white; font-weight:bold; cursor:pointer; font-size:16px;';
            btnLaporan.innerHTML = 'Ekspor Laporan (PDF / Word)';
            btnLaporan.onclick = showLaporanModal;
            statistikPage.appendChild(btnLaporan);
        }
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
    
    setupAutoHarga();
    loadData();
    tambahTombolLaporan();
});
