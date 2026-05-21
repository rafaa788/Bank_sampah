// =====================================================
// DASHBOARD SCRIPT - REALTIME DATABASE
// =====================================================

// CEK LOGIN
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'menu_login.html';
}

// Ambil data user
const userData = JSON.parse(localStorage.getItem('user') || '{}');
const adminName = userData.nama || userData.username || 'Admin';

// Set nama admin di UI
document.getElementById('adminName').innerText = adminName;
document.getElementById('welcomeName').innerText = adminName;

// ==================== GLOBAL VARIABLES ====================
let daftarSampah = [];
let currentFilter = 'all';
let currentFilterRW = 'all';
let currentFilterRT = 'all';
let currentFilterBSU = 'all';
let currentStatFilterRW = 'all';
let currentStatFilterRT = 'all';
let currentStatFilterBSU = 'all';
let currentStatFilterJenis = 'all';
let selectedBSU = null;
let jenisSampahChart = null;
let namaSampahChart = null;

const dataBSU = [
    { nama: "BSU MEDE 1", rw: "RW01", rt: "RT01" }, { nama: "BSU MEDE 2", rw: "RW01", rt: "RT02" },
    { nama: "BSU MEDE 3", rw: "RW01", rt: "RT03" }, { nama: "BSU MEDE 4", rw: "RW01", rt: "RT04" },
    { nama: "BSU PELANGI CERIA", rw: "RW02", rt: "RT01" }, { nama: "BSU PELANGI 2", rw: "RW02", rt: "RT02" },
    { nama: "BSU PELANGI KENANGA", rw: "RW02", rt: "RT03" }, { nama: "BSU PELANGI BUNDA", rw: "RW02", rt: "RT04" },
    { nama: "BSU RW03 RT01", rw: "RW03", rt: "RT01" }, { nama: "BSU RW03 RT02", rw: "RW03", rt: "RT02" },
    { nama: "BSU RW03 RT03", rw: "RW03", rt: "RT03" }, { nama: "BSU FORSILA", rw: "RW04", rt: "RT01" },
    { nama: "BSU BERSERI 04", rw: "RW04", rt: "RT02" }, { nama: "BSU BINTANG KEJORA 1", rw: "RW05", rt: "RT01" },
    { nama: "BSU BINTANG KEJORA 2", rw: "RW05", rt: "RT02" }, { nama: "BSU TERANG", rw: "RW06", rt: "RT01" },
    { nama: "BSU RW06 RT02", rw: "RW06", rt: "RT02" }, { nama: "BSU RW06 RT03", rw: "RW06", rt: "RT03" },
    { nama: "BSU RW06 RT04", rw: "RW06", rt: "RT04" }, { nama: "BSU RW06 RT05", rw: "RW06", rt: "RT05" },
    { nama: "BSU BERSEMI 0107", rw: "RW07", rt: "RT01" }, { nama: "BSU BERSEMI 07", rw: "RW07", rt: "RT02" },
    { nama: "BSU RW07 RT03", rw: "RW07", rt: "RT03" }, { nama: "BSU RW07 RT04", rw: "RW07", rt: "RT04" },
    { nama: "BSU RW07 RT05", rw: "RW07", rt: "RT05" }, { nama: "BSU MENTARI 01", rw: "RW08", rt: "RT01" },
    { nama: "BSU MENTARI", rw: "RW08", rt: "RT02" }, { nama: "BSU KP KIDOEL", rw: "RW09", rt: "all" },
    { nama: "BSU MAWARGA", rw: "RW10", rt: "RT01" }, { nama: "BSU SRIKANDI", rw: "RW10", rt: "RT02" },
    { nama: "BSU RW10 RT03", rw: "RW10", rt: "RT03" }, { nama: "BSU RW11 RT01", rw: "RW11", rt: "RT01" },
    { nama: "BSU ZALAK 2", rw: "RW11", rt: "RT02" }, { nama: "BSU RW11 RT03", rw: "RW11", rt: "RT03" },
    { nama: "BSU RW12 RT01", rw: "RW12", rt: "RT01" }, { nama: "BSU RW12 RT02", rw: "RW12", rt: "RT02" },
    { nama: "BSU RW12 RT03", rw: "RW12", rt: "RT03" }, { nama: "BSU CEMERLANG 1", rw: "RW13", rt: "RT01" },
    { nama: "BSU CEMERLANG 2", rw: "RW13", rt: "RT02" }, { nama: "BSU CEMERLANG 3", rw: "RW13", rt: "RT03" },
    { nama: "BSU RW14 RT01", rw: "RW14", rt: "RT01" }, { nama: "BSU RW14 RT02", rw: "RW14", rt: "RT02" },
    { nama: "BSU RW14 RT03", rw: "RW14", rt: "RT03" }
];

const presetSampah = {
    plastik: ["Pet A - Botol TANPA tutup dan label + Galon Le Mineral", "Pet B - Masih berlabel dan tutup", "Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)", "Botol Plastik Campuran Semua Warna dan Bentuk"],
    logam: ["Alumunium", "Besi", "Tembaga", "Seng", "Stainless Steel", "Timah"],
    kertas: ["Kardus", "Kertas Koran", "HVS / Kertas Putih", "Kertas Campuran", "Buku", "Duplex / Karton"]
};

const hargaSampahDetail = {
    "Pet A - Botol TANPA tutup dan label + Galon Le Mineral": 3500, "Pet B - Masih berlabel dan tutup": 2000,
    "Botol Warna BENING (MIZONE, SPRITE, MINYAK KAYU PUTIH)": 3000, "Botol Plastik Campuran Semua Warna dan Bentuk": 1500,
    "Alumunium": 10000, "Besi": 3000, "Tembaga": 50000, "Seng": 2000, "Stainless Steel": 5000, "Timah": 8000,
    "Kardus": 1600, "Kertas Koran": 700, "HVS / Kertas Putih": 1500, "Kertas Campuran": 500, "Buku": 500, "Duplex / Karton": 800
};

function getHargaByNama(nama) { return hargaSampahDetail[nama] || 2000; }
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }
function showToast(msg, isError) { let t = document.getElementById('toast'), tm = document.getElementById('toastMessage'); if (t && tm) { tm.innerText = msg; t.classList.add('show'); t.style.background = isError ? '#ef5350' : '#2e7d32'; setTimeout(() => t.classList.remove('show'), 2500); } }

// ==================== API FUNCTIONS ====================
async function loadDataFromDB() {
    try {
        const response = await fetch('api_get_data.php?action=get_all_transaksi');
        const result = await response.json();
        if (result.success && result.data) { daftarSampah = result.data; refreshAll(); return true; }
        return false;
    } catch (error) { console.error('Gagal load data:', error); return false; }
}

async function loadStatsFromDB() {
    try {
        const response = await fetch('api_get_data.php?action=get_statistik');
        const result = await response.json();
        if (result.success) { updateStatsUI(result); return true; }
        return false;
    } catch (error) { console.error('Gagal load statistik:', error); return false; }
}

function updateStatsUI(stats) {
    document.getElementById('totalOrganik').innerText = stats.total_organik.toFixed(2);
    document.getElementById('totalNonorganik').innerText = stats.total_nonorganik.toFixed(2);
    document.getElementById('totalSemua').innerText = stats.total_berat.toFixed(2);
    let percent = stats.total_berat > 0 ? (stats.total_organik / stats.total_berat) * 100 : 0;
    let bars = document.querySelectorAll('.progress-bar');
    if (bars[0]) bars[0].style.width = percent + '%';
    if (bars[1]) bars[1].style.width = (100 - percent) + '%';
}

async function saveToDatabase(data) {
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'tambah'); formData.append('bsu', data.bsu || ''); formData.append('rw', data.rw);
        formData.append('rt', data.rt); formData.append('nama', data.nama); formData.append('jenis', data.jenis);
        formData.append('berat', data.berat); formData.append('harga', data.harga);
        const response = await fetch('api_simpan_data.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData });
        const result = await response.json();
        if (result.success) { await loadDataFromDB(); showToast(result.message, false); return true; }
        else { showToast(result.message, true); return false; }
    } catch (error) { console.error('Error saving:', error); showToast('Gagal menyimpan data', true); return false; }
}

async function deleteFromDatabase(id) {
    try {
        const formData = new URLSearchParams(); formData.append('action', 'hapus'); formData.append('id', id);
        const response = await fetch('api_simpan_data.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData });
        const result = await response.json();
        if (result.success) { await loadDataFromDB(); showToast(result.message, false); return true; }
        else { showToast(result.message, true); return false; }
    } catch (error) { console.error('Error deleting:', error); showToast('Gagal hapus data', true); return false; }
}

// ==================== CRUD ====================
window.tambahSampah = async function() {
    let rw = document.getElementById('inputRW').value;
    let rt = document.getElementById('inputRT').value;
    let nama = document.getElementById('namaSampah').value;
    let jenis = document.getElementById('jenisSampah').value;
    let berat = parseFloat(document.getElementById('beratSampah').value);
    let harga = parseInt(document.getElementById('hargaSampah').value);
    if (selectedBSU) { rw = selectedBSU.rw; if (selectedBSU.rt !== 'all') rt = selectedBSU.rt; }
    if (!nama.trim()) { showToast('Nama sampah wajib diisi!', true); return; }
    if (berat <= 0) { showToast('Berat harus lebih dari 0 kg!', true); return; }
    if (!harga || harga <= 0) harga = getHargaByNama(nama);
    let success = await saveToDatabase({ bsu: selectedBSU ? selectedBSU.nama : '', rw, rt, nama: nama.trim(), jenis, berat, harga });
    if (success) { document.getElementById('namaSampah').value = ''; document.getElementById('beratSampah').value = '1'; document.getElementById('hargaSampah').value = '2000'; }
};

window.deleteSampah = async function(id) { if (confirm('Yakin ingin menghapus data ini?')) await deleteFromDatabase(id); };

// ==================== RENDER FUNCTIONS ====================
function filterDataByFilters(data, bsu, rw, rt) {
    let filtered = data.slice();
    if (bsu !== 'all') filtered = filtered.filter(i => i.bsu === bsu);
    if (rw !== 'all') filtered = filtered.filter(i => i.rw === rw);
    if (rt !== 'all') filtered = filtered.filter(i => i.rt === rt);
    return filtered;
}

function renderRTandRWTable() {
    let container = document.getElementById('rtRwTableBody');
    if (!container) return;
    let filtered = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    if (filtered.length === 0) { container.innerHTML = '<tr><td colspan="7" style="text-align:center;">Tidak ada data</td></tr>'; return; }
    let html = '';
    filtered.forEach(item => { html += `<tr><td>${item.bsu || '-'}</td><td>${item.rw}</td><td>${item.rt}</td><td>${escapeHtml(item.nama)}</td><td>${item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik'}</td><td>${item.berat.toFixed(2)}</td><td>Rp ${(item.berat * item.hargaPerKg).toLocaleString()}</td></tr>`; });
    container.innerHTML = html;
}

function updateStats() {
    let filtered = filterDataByFilters(daftarSampah, currentFilterBSU, currentFilterRW, currentFilterRT);
    let totalOrganik = filtered.filter(i => i.jenis === 'organik').reduce((a, b) => a + b.berat, 0);
    let totalNonorganik = filtered.filter(i => i.jenis !== 'organik').reduce((a, b) => a + b.berat, 0);
    let totalSemua = totalOrganik + totalNonorganik;
    let percent = totalSemua > 0 ? (totalOrganik / totalSemua) * 100 : 0;
    document.getElementById('totalOrganik').innerText = totalOrganik.toFixed(2);
    document.getElementById('totalNonorganik').innerText = totalNonorganik.toFixed(2);
    document.getElementById('totalSemua').innerText = totalSemua.toFixed(2);
    let bars = document.querySelectorAll('.progress-bar');
    if (bars[0]) bars[0].style.width = percent + '%';
    if (bars[1]) bars[1].style.width = (100 - percent) + '%';
    renderRTandRWTable();
}

function renderDataList() {
    let container = document.getElementById('sampahList');
    if (!container) return;
    let filtered = daftarSampah.filter(i => currentFilter === 'all' || i.jenis === currentFilter);
    if (filtered.length === 0) { container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>Tidak ada data</p></div>'; return; }
    let html = '';
    filtered.forEach((item, i) => { html += `<div class="data-item"><div class="data-info"><div class="data-number">${i+1}</div><div><strong>${item.bsu || '-'}</strong></div><div><small>${item.rw} - ${item.rt}</small></div><div class="data-name">${escapeHtml(item.nama)}</div><span>${item.jenis === 'organik' ? '🌿 Organik' : '📦 Nonorganik'}</span><div>${item.berat.toFixed(2)} kg</div><div>Rp ${(item.berat * item.hargaPerKg).toLocaleString()}</div></div><div class="data-actions"><button class="edit-data" onclick="editSampah(${item.id})"><i class="fas fa-edit"></i></button><button class="delete-data" onclick="deleteSampah(${item.id})"><i class="fas fa-trash-alt"></i></button></div></div>`; });
    container.innerHTML = html;
}

function refreshAll() { updateStats(); renderDataList(); }

// ==================== BSU FUNCTIONS ====================
function renderBSUList(search = '') {
    let container = document.getElementById('bsuList');
    if (!container) return;
    let filtered = dataBSU.filter(b => !search || b.nama.toLowerCase().includes(search.toLowerCase()));
    if (filtered.length === 0) { container.innerHTML = '<div style="padding:20px;text-align:center;">Tidak ada BSU</div>'; return; }
    let html = '';
    filtered.forEach(bsu => { let isSelected = selectedBSU && selectedBSU.nama === bsu.nama; html += `<div class="bsu-item ${isSelected ? 'selected' : ''}" data-nama="${bsu.nama}" data-rw="${bsu.rw}" data-rt="${bsu.rt}"><div><div class="bsu-name">${escapeHtml(bsu.nama)}</div><div class="bsu-location">${bsu.rw} - ${bsu.rt === 'all' ? 'Semua RT' : bsu.rt}</div></div><div class="bsu-badge">RW ${bsu.rw.replace('RW', '')}</div></div>`; });
    container.innerHTML = html;
    document.querySelectorAll('.bsu-item').forEach(el => { el.addEventListener('click', () => { selectBSU({ nama: el.dataset.nama, rw: el.dataset.rw, rt: el.dataset.rt }); }); });
}

function selectBSU(bsu) {
    selectedBSU = bsu;
    let inputRW = document.getElementById('inputRW'), inputRT = document.getElementById('inputRT');
    if (inputRW) for (let i = 0; i < inputRW.options.length; i++) if (inputRW.options[i].value === bsu.rw) { inputRW.selectedIndex = i; break; }
    if (inputRT && bsu.rt !== 'all') for (let i = 0; i < inputRT.options.length; i++) if (inputRT.options[i].value === bsu.rt) { inputRT.selectedIndex = i; break; }
    document.getElementById('selectedBsuDisplay').style.display = 'flex';
    document.getElementById('selectedBsuName').innerText = bsu.nama;
    document.getElementById('selectedBsuLocation').innerText = `${bsu.rw} - ${bsu.rt === 'all' ? 'Semua RT' : bsu.rt}`;
    document.getElementById('currentBsuInfo').style.display = 'flex';
    document.getElementById('currentBsuText').innerText = `${bsu.nama} (${bsu.rw} - ${bsu.rt === 'all' ? 'Semua RT' : bsu.rt})`;
    renderBSUList(document.getElementById('bsuSearchInput')?.value || '');
    showToast(`BSU ${bsu.nama} dipilih`, false);
}

function clearSelectedBSU() { selectedBSU = null; document.getElementById('selectedBsuDisplay').style.display = 'none'; document.getElementById('currentBsuInfo').style.display = 'none'; renderBSUList(document.getElementById('bsuSearchInput')?.value || ''); showToast('BSU dibatalkan', false); }

// ==================== NAVIGATION ====================
function navigateTo(page) {
    ['dashboardPage', 'kelolaPage', 'statistikPage'].forEach(p => document.getElementById(p)?.classList.remove('active'));
    document.getElementById(page + 'Page')?.classList.add('active');
    document.querySelectorAll('.menu-item, .nav-bot-item').forEach(m => { m.classList.remove('active'); if (m.dataset.page === page) m.classList.add('active'); });
    let titles = { dashboard: 'Dashboard', kelola: 'Kelola Sampah', statistik: 'Statistik' };
    if (document.getElementById('pageTitle')) document.getElementById('pageTitle').innerText = titles[page];
}

// ==================== SIDEBAR ====================
function initSidebar() {
    let sidebar = document.getElementById('sidebar'), overlay = document.getElementById('sidebarOverlay'), toggle = document.getElementById('menuToggle');
    function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); document.body.style.overflow = ''; }
    function openSidebar() { sidebar?.classList.add('open'); overlay?.classList.add('active'); document.body.style.overflow = 'hidden'; }
    toggle?.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
    overlay?.addEventListener('click', closeSidebar);
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });
}
initSidebar();

// ==================== EVENT LISTENERS ====================
document.querySelectorAll('.menu-item, .nav-bot-item').forEach(el => { if (el.id !== 'logoutMobileBtn') el.addEventListener('click', (e) => { e.preventDefault(); if (el.dataset.page) navigateTo(el.dataset.page); }); });
document.getElementById('tambahSampahBtn')?.addEventListener('click', window.tambahSampah);
document.getElementById('filterJenis')?.addEventListener('change', e => { currentFilter = e.target.value; renderDataList(); });
document.getElementById('filterBSU')?.addEventListener('change', e => { currentFilterBSU = e.target.value; refreshAll(); });
document.getElementById('filterRW')?.addEventListener('change', e => { currentFilterRW = e.target.value; refreshAll(); });
document.getElementById('filterRT')?.addEventListener('change', e => { currentFilterRT = e.target.value; refreshAll(); });
document.getElementById('bsuSearchInput')?.addEventListener('input', e => renderBSUList(e.target.value));
document.getElementById('clearBsuBtn')?.addEventListener('click', clearSelectedBSU);
document.getElementById('logoutBtn')?.addEventListener('click', () => { localStorage.clear(); window.location.href = 'menu_login.html'; });
document.getElementById('logoutMobileBtn')?.addEventListener('click', () => { localStorage.clear(); window.location.href = 'menu_login.html'; });

// Inisialisasi datalist
let datalist = document.getElementById('sampahDatalist');
if (datalist) { let allSampah = [...presetSampah.plastik, ...presetSampah.logam, ...presetSampah.kertas]; datalist.innerHTML = allSampah.map(n => `<option value="${escapeHtml(n)}">`).join(''); }

// Inisialisasi
renderBSUList('');
loadDataFromDB();
loadStatsFromDB();

// Auto refresh setiap 30 detik
setInterval(() => { loadDataFromDB(); loadStatsFromDB(); }, 30000);