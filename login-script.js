// login-script.js - Dengan Multi User + Multi BSU
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('loginForm');
    var errorToast = document.getElementById('errorMessage');
    
    // DATA BSU LENGKAP
    var dataBSU = [
        { id: 'bsu_mede1', nama: 'BSU MEDE 1', rw: 'RW01', rt: 'RT01', ketua: 'Bapak Slamet' },
        { id: 'bsu_mede2', nama: 'BSU MEDE 2', rw: 'RW01', rt: 'RT02', ketua: 'Ibu Siti' },
        { id: 'bsu_mede3', nama: 'BSU MEDE 3', rw: 'RW01', rt: 'RT03', ketua: 'Bapak Agus' },
        { id: 'bsu_mede4', nama: 'BSU MEDE 4', rw: 'RW01', rt: 'RT04', ketua: 'Ibu Dewi' },
        { id: 'bsu_pelangi_ceria', nama: 'BSU PELANGI CERIA', rw: 'RW02', rt: 'RT01', ketua: 'Bapak Herman' },
        { id: 'bsu_pelangi_2', nama: 'BSU PELANGI 2', rw: 'RW02', rt: 'RT02', ketua: 'Ibu Rina' },
        { id: 'bsu_pelangi_kenanga', nama: 'BSU PELANGI KENANGA', rw: 'RW02', rt: 'RT03', ketua: 'Bapak Joko' },
        { id: 'bsu_pelangi_bunda', nama: 'BSU PELANGI BUNDA', rw: 'RW02', rt: 'RT04', ketua: 'Ibu Tuti' },
        { id: 'bsu_rw03_rt01', nama: 'BSU RW03 RT01', rw: 'RW03', rt: 'RT01', ketua: 'Bapak Eko' },
        { id: 'bsu_rw03_rt02', nama: 'BSU RW03 RT02', rw: 'RW03', rt: 'RT02', ketua: 'Ibu Ani' },
        { id: 'bsu_rw03_rt03', nama: 'BSU RW03 RT03', rw: 'RW03', rt: 'RT03', ketua: 'Bapak Budi' },
        { id: 'bsu_forsila', nama: 'BSU FORSILA', rw: 'RW04', rt: 'RT01', ketua: 'Ibu Wati' },
        { id: 'bsu_berseri_04', nama: 'BSU BERSERI 04', rw: 'RW04', rt: 'RT02', ketua: 'Bapak Dodi' },
        { id: 'bsu_bintang_kejora_1', nama: 'BSU BINTANG KEJORA 1', rw: 'RW05', rt: 'RT01', ketua: 'Ibu Lina' },
        { id: 'bsu_bintang_kejora_2', nama: 'BSU BINTANG KEJORA 2', rw: 'RW05', rt: 'RT02', ketua: 'Bapak Deni' },
        { id: 'bsu_terang', nama: 'BSU TERANG', rw: 'RW06', rt: 'RT01', ketua: 'Ibu Maya' },
        { id: 'bsu_rw06_rt02', nama: 'BSU RW06 RT02', rw: 'RW06', rt: 'RT02', ketua: 'Bapak Rudi' },
        { id: 'bsu_rw06_rt03', nama: 'BSU RW06 RT03', rw: 'RW06', rt: 'RT03', ketua: 'Ibu Erna' },
        { id: 'bsu_rw06_rt04', nama: 'BSU RW06 RT04', rw: 'RW06', rt: 'RT04', ketua: 'Bapak Tono' },
        { id: 'bsu_rw06_rt05', nama: 'BSU RW06 RT05', rw: 'RW06', rt: 'RT05', ketua: 'Ibu Yuni' },
        { id: 'bsu_bersemi_0107', nama: 'BSU BERSEMI 0107', rw: 'RW07', rt: 'RT01', ketua: 'Bapak Hendra' },
        { id: 'bsu_bersemi_07', nama: 'BSU BERSEMI 07', rw: 'RW07', rt: 'RT02', ketua: 'Ibu Ratna' },
        { id: 'bsu_rw07_rt03', nama: 'BSU RW07 RT03', rw: 'RW07', rt: 'RT03', ketua: 'Bapak Feri' },
        { id: 'bsu_rw07_rt04', nama: 'BSU RW07 RT04', rw: 'RW07', rt: 'RT04', ketua: 'Ibu Linda' },
        { id: 'bsu_rw07_rt05', nama: 'BSU RW07 RT05', rw: 'RW07', rt: 'RT05', ketua: 'Bapak Andi' },
        { id: 'bsu_mentari_01', nama: 'BSU MENTARI 01', rw: 'RW08', rt: 'RT01', ketua: 'Ibu Nina' },
        { id: 'bsu_mentari', nama: 'BSU MENTARI', rw: 'RW08', rt: 'RT02', ketua: 'Bapak Taufik' },
        { id: 'bsu_kp_kidoel', nama: 'BSU KP KIDOEL', rw: 'RW09', rt: 'all', ketua: 'Bapak Kidoel' },
        { id: 'bsu_mawarga', nama: 'BSU MAWARGA', rw: 'RW10', rt: 'RT01', ketua: 'Ibu Rose' },
        { id: 'bsu_srikandi', nama: 'BSU SRIKANDI', rw: 'RW10', rt: 'RT02', ketua: 'Bapak Srikandi' },
        { id: 'bsu_rw10_rt03', nama: 'BSU RW10 RT03', rw: 'RW10', rt: 'RT03', ketua: 'Ibu Mega' },
        { id: 'bsu_rw11_rt01', nama: 'BSU RW11 RT01', rw: 'RW11', rt: 'RT01', ketua: 'Bapak Gilang' },
        { id: 'bsu_zalak_2', nama: 'BSU ZALAK 2', rw: 'RW11', rt: 'RT02', ketua: 'Ibu Zalak' },
        { id: 'bsu_rw11_rt03', nama: 'BSU RW11 RT03', rw: 'RW11', rt: 'RT03', ketua: 'Bapak Rizki' },
        { id: 'bsu_rw12_rt01', nama: 'BSU RW12 RT01', rw: 'RW12', rt: 'RT01', ketua: 'Ibu Sari' },
        { id: 'bsu_rw12_rt02', nama: 'BSU RW12 RT02', rw: 'RW12', rt: 'RT02', ketua: 'Bapak Darma' },
        { id: 'bsu_rw12_rt03', nama: 'BSU RW12 RT03', rw: 'RW12', rt: 'RT03', ketua: 'Ibu Ayu' },
        { id: 'bsu_cemerlang_1', nama: 'BSU CEMERLANG 1', rw: 'RW13', rt: 'RT01', ketua: 'Bapak Chandra' },
        { id: 'bsu_cemerlang_2', nama: 'BSU CEMERLANG 2', rw: 'RW13', rt: 'RT02', ketua: 'Ibu Berlian' },
        { id: 'bsu_cemerlang_3', nama: 'BSU CEMERLANG 3', rw: 'RW13', rt: 'RT03', ketua: 'Bapak Gio' },
        { id: 'bsu_rw14_rt01', nama: 'BSU RW14 RT01', rw: 'RW14', rt: 'RT01', ketua: 'Ibu Fira' },
        { id: 'bsu_rw14_rt02', nama: 'BSU RW14 RT02', rw: 'RW14', rt: 'RT02', ketua: 'Bapak Irfan' },
        { id: 'bsu_rw14_rt03', nama: 'BSU RW14 RT03', rw: 'RW14', rt: 'RT03', ketua: 'Ibu Nadia' }
    ];

    // DEFAULT USERS (dengan BSU)
    var DEFAULT_USERS = [
        { 
            username: 'admin', 
            password: 'admin123', 
            nama: 'Administrator', 
            role: 'admin',
            bsuId: null,
            bsuNama: null,
            bsuRW: null,
            bsuRT: null
        }
    ];
    
    // Tambahkan user untuk setiap BSU
    for (var i = 0; i < dataBSU.length; i++) {
        var bsu = dataBSU[i];
        var usernameBSU = bsu.id;
        var passwordBSU = 'bsu123';
        DEFAULT_USERS.push({
            username: usernameBSU,
            password: passwordBSU,
            nama: bsu.ketua || 'Ketua BSU',
            role: 'tamu',
            bsuId: bsu.id,
            bsuNama: bsu.nama,
            bsuRW: bsu.rw,
            bsuRT: bsu.rt
        });
    }
    
    // Load users dari localStorage
    var users = JSON.parse(localStorage.getItem('bankSampahUsers') || '[]');
    if (users.length === 0) {
        users = DEFAULT_USERS;
        localStorage.setItem('bankSampahUsers', JSON.stringify(users));
        localStorage.setItem('bankSampahBSU', JSON.stringify(dataBSU));
    }
    
    // Cek login - redirect sesuai role
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        var role = sessionStorage.getItem('userRole') || 'admin';
        if (role === 'tamu') {
            window.location.href = 'tamu.html';
        } else {
            window.location.href = 'menu_halaman.html';
        }
        return;
    }
    
    // Informasi akun BSU di halaman login
    function showBSUInfo() {
        var infoContainer = document.getElementById('bsuInfoContainer');
        if (!infoContainer) return;
        
        var html = '<div style="margin-top:12px;padding:12px;background:var(--primary-bg);border-radius:var(--radius-xs);">';
        html += '<small style="color:var(--text-muted);display:block;margin-bottom:8px;">📋 AKUN BSU (gunakan di Role: Tamu)</small>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:4px;max-height:120px;overflow-y:auto;">';
        
        for (var i = 0; i < dataBSU.length; i++) {
            var bsu = dataBSU[i];
            html += '<span style="font-size:0.55rem;background:white;padding:2px 10px;border-radius:12px;border:1px solid var(--primary-bg);">';
            html += '<strong>' + bsu.nama + '</strong>';
            html += '<span style="color:var(--text-muted);margin-left:4px;">(' + bsu.id + ' / bsu123)</span>';
            html += '</span>';
        }
        
        html += '</div></div>';
        infoContainer.innerHTML = html;
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var username = document.getElementById('username').value.trim().toLowerCase();
            var password = document.getElementById('password').value;
            var selectedRole = document.getElementById('loginRole').value;
            
            if (!username || !password) {
                showError(errorToast, 'Username dan password wajib diisi!');
                return;
            }
            
            var submitBtn = form.querySelector('.btn-login');
            var originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Memproses...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            setTimeout(function() {
                var user = null;
                for (var i = 0; i < users.length; i++) {
                    if (users[i].username === username && users[i].role === selectedRole) {
                        user = users[i];
                        break;
                    }
                }
                
                if (user && user.password === password) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userRole', user.role);
                    sessionStorage.setItem('adminName', user.nama);
                    sessionStorage.setItem('username', user.username);
                    sessionStorage.setItem('loginTime', Date.now().toString());
                    
                    // Simpan data BSU jika user adalah tamu
                    if (user.role === 'tamu' && user.bsuId) {
                        sessionStorage.setItem('userBSUId', user.bsuId);
                        sessionStorage.setItem('userBSU', user.bsuNama);
                        sessionStorage.setItem('userRW', user.bsuRW);
                        sessionStorage.setItem('userRT', user.bsuRT);
                    }
                    
                    showSuccess(errorToast, ' Login berhasil! Mengarahkan...');
                    
                    setTimeout(function() {
                        if (user.role === 'tamu') {
                            window.location.href = 'tamu.html';
                        } else {
                            window.location.href = 'menu_halaman.html';
                        }
                    }, 800);
                } else {
                    showError(errorToast, ' Username atau password salah!');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    
                    form.style.animation = 'shakeError 0.5s ease';
                    setTimeout(function() {
                        form.style.animation = '';
                    }, 500);
                }
            }, 600);
        });
    }
    
    function showError(toast, message) {
        if (toast) {
            toast.className = 'error-toast show';
            var span = toast.querySelector('span');
            if (span) span.innerText = message;
            toast.style.display = 'flex';
            setTimeout(function() {
                toast.style.display = 'none';
                toast.className = 'error-toast';
            }, 3500);
        }
    }
    
    function showSuccess(toast, message) {
        if (toast) {
            toast.className = 'error-toast show success';
            var span = toast.querySelector('span');
            if (span) span.innerText = message;
            toast.style.display = 'flex';
        }
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
            var submitBtn = form.querySelector('.btn-login');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    });
    
    // Tampilkan info BSU
    showBSUInfo();
});
