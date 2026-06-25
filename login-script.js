// login-script.js - TANPA DATABASE
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('loginForm');
    var errorToast = document.getElementById('errorMessage');
    
    console.log('Login script loaded');
    
    // AKUN DEFAULT (hardcoded)
    var DEFAULT_USER = {
        username: 'admin',
        password: 'admin123',
        nama: 'Administrator'
    };
    
    // Cek apakah sudah login - gunakan sessionStorage
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        console.log('Sudah login, redirect ke menu_halaman.html');
        window.location.href = 'menu_halaman.html';
        return;
    }
    
    if (form) {
        console.log('Form ditemukan');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            var username = document.getElementById('username').value.trim();
            var password = document.getElementById('password').value;
            
            console.log('Username:', username);
            
            if (!username || !password) {
                showError(errorToast, 'Username dan password wajib diisi!');
                return;
            }
            
            var submitBtn = form.querySelector('.btn-login');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Memproses...';
            submitBtn.disabled = true;
            
            // Simulasi proses login
            setTimeout(function() {
                // Cek login (tanpa database)
                if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
                    console.log('Login berhasil!');
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('adminName', DEFAULT_USER.nama);
                    
                    showSuccess(errorToast, 'Login berhasil! Mengarahkan...');
                    
                    setTimeout(function() {
                        console.log('Redirect ke menu_halaman.html');
                        window.location.href = 'menu_halaman.html';
                    }, 1000);
                } else {
                    console.log('Login gagal');
                    showError(errorToast, 'Username atau password salah!');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 500);
        });
    } else {
        console.error('Form dengan id "loginForm" tidak ditemukan!');
    }
    
    function showError(toast, message) {
        console.log('Error:', message);
        if (toast) {
            toast.style.background = '#ef5350';
            toast.style.color = 'white';
            var span = toast.querySelector('span');
            if (span) span.innerText = message;
            toast.style.display = 'block';
            setTimeout(function() {
                toast.style.display = 'none';
            }, 3000);
        } else {
            alert(message);
        }
    }
    
    function showSuccess(toast, message) {
        console.log('Success:', message);
        if (toast) {
            toast.style.background = '#4caf50';
            toast.style.color = 'white';
            var span = toast.querySelector('span');
            if (span) span.innerText = message;
            toast.style.display = 'block';
        }
    }
});
