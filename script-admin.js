// ADMIN SCRIPT
document.addEventListener('DOMContentLoaded', function() {
    // Cek login
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'menu_login.html';
        return;
    }
    
    // Data Model
    let daftarSampah = [];
    let currentFilter = 'all';
    let currentType = 'organik';
    const STORAGE_KEY = 'bankSampahData';
    
    // Set admin name
    const adminName = sessionStorage.getItem('adminName') || 'Admin';
    document.getElementById('adminName').innerText = adminName;
    document.getElementById('welcomeName').innerText = adminName;
    
    // Load data
    function loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
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
        let totalOrganik = 0, totalNonorganik = 0;
        let itemOrganik = 0, itemNonorganik = 0;
        
        daftarSampah.forEach(item => {
            if (item.jenis === 'organik') {
                totalOrganik += item.berat;
                itemOrganik++;
            } else {
                totalNonorganik += item.berat;
                itemNonorganik++;
            }
        });
        
        const totalSemua = totalOrganik + totalNonorganik;
        const totalItems = daftarSampah.length;
        const organikPercent = totalSemua > 0 ? (totalOrganik / totalSemua) * 100 : 0;
        const nonorganikPercent = totalSemua > 0 ? (totalNonorganik / totalSemua) * 100 : 0;
        
        // Update DOM
        document.getElementById('totalOrganik').innerText = totalOrganik.toFixed(2);
        document.getElementById('totalNonorganik').innerText = totalNonorganik.toFixed(2);
        document.getElementById('totalSemua').innerText = totalSemua.toFixed(2);
        document.getElementById('totalItems').innerText = totalItems;
        
        // Progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        if (progressBars[0]) progressBars[0].style.width = `${organikPercent}%`;
        if (progressBars[1]) progressBars[1].style.width = `${nonorganikPercent}%`;
        
        // Statistik page
        document.getElementById('statOrganikBerat').innerText = totalOrganik.toFixed(2) + ' kg';
        document.getElementById('statOrganikItem').innerText = itemOrganik;
        document.getElementById('statNonorganikBerat').innerText = totalNonorganik.toFixed(2) + ' kg';
        document.getElementById('statNonorganikItem').innerText = itemNonorganik;
        document.getElementById('statTotalBerat').innerText = totalSemua.toFixed(2) + ' kg';
        document.getElementById('statTotalItem').innerText = totalItems;
        
        // Pie chart
        const organikDeg = (organikPercent / 100) * 360;
        const nonorganikDeg = (nonorganikPercent / 100) * 360;
        const organikSegment = document.querySelector('.organik-segment');
        const nonorganikSegment = document.querySelector('.nonorganik-segment');
        if (organikSegment) {
            organikSegment.style.background = `conic-gradient(#2e7d32 ${organikDeg}deg, #2e7d32 ${organikDeg}deg, transparent ${organikDeg}deg)`;
        }
        if (nonorganikSegment) {
            nonorganikSegment.style.background = `conic-gradient(#f9a825 ${nonorganikDeg}deg, #f9a825 ${nonorganikDeg}deg, transparent ${nonorganikDeg}deg)`;
        }
        document.getElementById('pieTotal').innerText = totalSemua.toFixed(1);
        document.getElementById('legendOrganik').innerText = totalOrganik.toFixed(2);
        document.getElementById('legendNonorganik').innerText = totalNonorganik.toFixed(2);
    }
    
    // Render preview
    function renderPreview() {
        const container = document.getElementById('previewList');
        if (!container) return;
        const previewData = daftarSampah.slice(0, 5);
        
        if (previewData.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Tidak ada data</p></div>';
            return;
        }
        
        container.innerHTML = previewData.map(item => `
            <div class="preview-item">
                <div class="preview-info">
                    <span class="preview-name">${escapeHtml(item.nama)}</span>
                    <span class="preview-badge badge-${item.jenis}">${item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik'}</span>
                    <span class="preview-weight">${item.berat.toFixed(2)} kg</span>
                </div>
                <div class="preview-price">Rp ${item.hargaPerKg.toLocaleString()}/kg</div>
            </div>
        `).join('');
    }
    
    // Render data list (kelola sampah)
    function renderDataList() {
        const container = document.getElementById('sampahList');
        if (!container) return;
        let filteredData = daftarSampah;
        if (currentFilter !== 'all') {
            filteredData = daftarSampah.filter(item => item.jenis === currentFilter);
        }
        
        if (filteredData.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>Tidak ada data sampah</p></div>';
            return;
        }
        
        container.innerHTML = filteredData.map((item, index) => `
            <div class="data-item">
                <div class="data-info">
                    <div class="data-number">${index + 1}</div>
                    <div class="data-name">${escapeHtml(item.nama)}</div>
                    <span class="preview-badge badge-${item.jenis}">${item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik'}</span>
                    <div class="data-weight">${item.berat.toFixed(2)} kg</div>
                    <div class="data-price">Rp ${item.hargaPerKg.toLocaleString()}/kg</div>
                    <div class="data-total">Rp ${(item.berat * item.hargaPerKg).toLocaleString()}</div>
                </div>
                <div class="data-actions">
                    <button class="edit-data" onclick="editSampah(${item.id})"><i class="fas fa-edit"></i></button>
                    <button class="delete-data" onclick="deleteSampah(${item.id})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `).join('');
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
    
    // Show toast
    function showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.innerText = message;
        toast.classList.add('show');
        if (isError) {
            toast.style.background = 'linear-gradient(135deg, #ef5350, #e53935)';
        } else {
            toast.style.background = 'linear-gradient(135deg, #2e7d32, #43a047)';
        }
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.style.background = 'linear-gradient(135deg, #2e7d32, #43a047)';
            }, 300);
        }, 2500);
    }
    
    // Tambah sampah
    window.tambahSampah = function() {
        const nama = document.getElementById('namaSampah').value;
        const jenis = document.getElementById('jenisSampah').value;
        const berat = parseFloat(document.getElementById('beratSampah').value);
        const harga = parseInt(document.getElementById('hargaSampah').value);
        
        if (!nama.trim()) {
            showToast('Nama sampah wajib diisi!', true);
            return;
        }
        if (berat <= 0) {
            showToast('Berat harus lebih dari 0 kg!', true);
            return;
        }
        if (harga < 0) {
            showToast('Harga tidak boleh negatif!', true);
            return;
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
        
        showToast('Data berhasil ditambahkan!');
    };
    
    // Edit sampah
    window.editSampah = function(id) {
        const item = daftarSampah.find(s => s.id === id);
        if (!item) return;
        
        const newNama = prompt('Edit Nama Sampah:', item.nama);
        if (!newNama) return;
        
        const newJenis = prompt('Jenis (organik/nonorganik):', item.jenis);
        if (newJenis !== 'organik' && newJenis !== 'nonorganik') {
            showToast('Jenis harus organik atau nonorganik', true);
            return;
        }
        
        const newBerat = parseFloat(prompt('Berat (kg):', item.berat));
        if (isNaN(newBerat) || newBerat <= 0) {
            showToast('Berat tidak valid', true);
            return;
        }
        
        const newHarga = parseInt(prompt('Harga per Kg (Rp):', item.hargaPerKg));
        if (isNaN(newHarga) || newHarga < 0) {
            showToast('Harga tidak valid', true);
            return;
        }
        
        item.nama = newNama.trim();
        item.jenis = newJenis;
        item.berat = newBerat;
        item.hargaPerKg = newHarga;
        
        saveData();
        refreshAll();
        showToast('Data berhasil diupdate!');
    };
    
    // Delete sampah
    window.deleteSampah = function(id) {
        if (confirm('Yakin ingin menghapus data ini?')) {
            daftarSampah = daftarSampah.filter(s => s.id !== id);
            saveData();
            refreshAll();
            showToast('Data berhasil dihapus!');
        }
    };
    
    function refreshAll() {
        updateStats();
        renderPreview();
        renderDataList();
    }
    
    // Navigation
    function navigateTo(page) {
        document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
        const targetPage = document.getElementById(page + 'Page');
        if (targetPage) targetPage.classList.add('active');
        
        document.querySelectorAll('.menu-item, .nav-bot-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });
        
        const titles = { dashboard: 'Dashboard', kelola: 'Kelola Sampah', statistik: 'Statistik' };
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.innerText = titles[page];
    }
    
    // Event listeners
    document.querySelectorAll('.menu-item, .nav-bot-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page && page !== 'keluar') navigateTo(page);
        });
    });
    
    const goToKelolaBtn = document.getElementById('goToKelolaBtn');
    if (goToKelolaBtn) {
        goToKelolaBtn.addEventListener('click', () => navigateTo('kelola'));
    }
    
    const tambahBtn = document.getElementById('tambahSampahBtn');
    if (tambahBtn) {
        tambahBtn.addEventListener('click', window.tambahSampah);
    }
    
    const filterJenis = document.getElementById('filterJenis');
    if (filterJenis) {
        filterJenis.addEventListener('change', (e) => {
            currentFilter = e.target.value;
            renderDataList();
        });
    }
    
    // Type selector
    document.querySelectorAll('.type-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.getAttribute('data-type');
            const jenisInput = document.getElementById('jenisSampah');
            if (jenisInput) jenisInput.value = currentType;
        });
    });
    
    // Toggle sidebar mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('adminName');
            window.location.href = 'menu_login.html';
        });
    }
    
    const logoutMobileBtn = document.getElementById('logoutMobileBtn');
    if (logoutMobileBtn) {
        logoutMobileBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('adminName');
            window.location.href = 'menu_login.html';
        });
    }
    
    // Load data
    loadData();
});