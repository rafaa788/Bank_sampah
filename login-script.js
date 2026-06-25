// login-script.js - PERBAIKAN TOTAL
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorToast = document.getElementById('errorMessage');
    
    console.log('Login script loaded');
    
    // Cek apakah sudah login - gunakan sessionStorage
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        console.log('Sudah login, redirect ke menu_halaman.html');
        window.location.href = 'menu_halaman.html';
        return;
    }
    
    if (form) {
        console.log('Form ditemukan');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            console.log('Username:', username);
            
            if (!username || !password) {
                showError(errorToast, 'Username dan password wajib diisi!');
                return;
            }
            
            const submitBtn = form.querySelector('.btn-login');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Memproses...';
            submitBtn.disabled = true;
            
            try {
                console.log('Mengirim request ke api_login.php');
                const response = await fetch('api_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                console.log('Response status:', response.status);
                const result = await response.json();
                console.log('Result:', result);
                
                if (result.success) {
                    console.log('Login berhasil!');
                    // Gunakan sessionStorage
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                    sessionStorage.setItem('adminName', result.user.nama || result.user.username);
                    
                    showSuccess(errorToast, 'Login berhasil! Mengarahkan...');
                    
                    setTimeout(() => {
                        console.log('Redirect ke menu_halaman.html');
                        window.location.href = 'menu_halaman.html';
                    }, 1000);
                } else {
                    console.log('Login gagal:', result.message);
                    showError(errorToast, result.message || 'Login gagal!');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                showError(errorToast, 'Terjadi kesalahan: ' + error.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    } else {
        console.error('Form dengan id "loginForm" tidak ditemukan!');
    }
    
    function showError(toast, message) {
        console.log('Error:', message);
        if (toast) {
            toast.style.background = '#ef5350';
            toast.style.color = 'white';
            const span = toast.querySelector('span');
            if (span) span.innerText = message;
            toast.style.display = 'block';
            setTimeout(() => {
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
            const span = toast.querySelector('span');
            if (span) span.innerText = message;
            toast.style.display = 'block';
        }
    }
});
