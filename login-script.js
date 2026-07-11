// login-script.js - Dengan Multi User & Role + Animasi
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('loginForm');
    var errorToast = document.getElementById('errorMessage');
    
    // DEFAULT USERS
    var DEFAULT_USERS = [
        { username: 'admin', password: 'admin123', nama: 'Administrator', role: 'admin' },
        { username: 'tamu', password: 'tamu123', nama: 'Pengunjung', role: 'tamu' }
    ];
    
    // Load users dari localStorage
    var users = JSON.parse(localStorage.getItem('bankSampahUsers') || '[]');
    if (users.length === 0) {
        users = DEFAULT_USERS;
        localStorage.setItem('bankSampahUsers', JSON.stringify(users));
    }
  
    // Cek login
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'menu_halaman.html';
        return;
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
            
            // Tampilkan loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Memproses...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Animasi loading
            var icon = submitBtn.querySelector('i');
            if (icon) {
                icon.style.animation = 'spin 0.8s linear infinite';
            }
            
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
                    
                    showSuccess(errorToast, ' Login berhasil! Mengarahkan...');
                    
                    setTimeout(function() {
                        window.location.href = 'menu_halaman.html';
                    }, 800);
                } else {
                    showError(errorToast, ' Username atau password salah!');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    
                    // Shake animation on error
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
    
    // Keyboard shortcut: Enter untuk submit
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
            var submitBtn = form.querySelector('.btn-login');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    });
});
