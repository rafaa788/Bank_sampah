// LOGIN SCRIPT
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorToast = document.getElementById('errorMessage');
    
    // Cek session
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'menu_halaman.html';
        return;
    }
    
    // Particle effect sederhana
    const particles = document.getElementById('particles');
    if (particles) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(16, 185, 129, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${3 + Math.random() * 5}s infinite ease-in-out`;
            particles.appendChild(particle);
        }
    }
    
    // Style untuk particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Login submit
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'banksampah' && password === 'admin123') {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('adminName', username);
                window.location.href = 'menu_halaman.html';
            } else {
                errorToast.classList.add('show');
                setTimeout(() => {
                    errorToast.classList.remove('show');
                }, 3000);
            }
        });
    }
});