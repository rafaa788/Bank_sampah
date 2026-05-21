// login-script.js - PERBAIKAN
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorToast = document.getElementById('errorMessage');
    
    // Cek apakah sudah login - gunakan sessionStorage
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'menu_halaman.html';
        return;
    }
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showError(errorToast, 'Username dan password wajib diisi!');
                return;
            }
            
            const submitBtn = form.querySelector('.btn-login');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Memproses...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('api_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Gunakan sessionStorage (bukan localStorage)
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                    sessionStorage.setItem('adminName', result.user.nama || result.user.username);
                    
                    showSuccess(errorToast, 'Login berhasil! Mengarahkan...');
                    
                    setTimeout(() => {
                        window.location.href = 'menu_halaman.html';
                    }, 1000);
                } else {
                    showError(errorToast, result.message);
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
    }
    
    function showError(toast, message) {
        if (toast) {
            toast.style.background = '#ef5350';
            toast.style.color = 'white';
            toast.querySelector('span').innerText = message;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        } else {
            alert(message);
        }
    }
    
    function showSuccess(toast, message) {
        if (toast) {
            toast.style.background = '#4caf50';
            toast.style.color = 'white';
            toast.querySelector('span').innerText = message;
            toast.style.display = 'block';
        }
    }
});