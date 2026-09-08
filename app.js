// --- 🧠 PREMIUM APP LOGIC ---

const App = {
    cart: JSON.parse(localStorage.getItem('diggaj_cart')) || [],
    user: localStorage.getItem('diggaj_user') || null,

    init() {
        this.updateCartCount();
        this.checkLoginStatus();
        this.init3DTilt();
        this.renderCartPage();
    },

    // 🍞 Custom Toast Notification System
    toast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `✨ ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // 🛒 Cart Logic
    addToCart(id, name, price, img) {
        this.cart.push({ id, name, price, img });
        localStorage.setItem('diggaj_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.toast(`${name} added to your cart! 🍨`);
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        localStorage.setItem('diggaj_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.renderCartPage();
        this.toast("Item removed.");
    },

    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) countElement.textContent = this.cart.length;
    },

    // 🔐 Auth Logic
    checkLoginStatus() {
        const loginBtn = document.getElementById('nav-login');
        if (this.user && loginBtn) {
            loginBtn.textContent = 'PROFILE';
            loginBtn.href = '#';
        }
    },

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        localStorage.setItem('diggaj_user', email);
        this.toast("Authentication successful. Welcome back! 🚀");
        setTimeout(() => window.location.href = 'index.html', 1500);
    },

    checkout() {
        if (this.cart.length === 0) return this.toast("Your cart is empty! 🍦");
        if (!this.user) {
            this.toast("Please log in to complete checkout! 🔒");
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }
        this.toast("Processing your premium order... 🎉");
        this.cart = [];
        localStorage.setItem('diggaj_cart', JSON.stringify([]));
        this.updateCartCount();
        this.renderCartPage();
    },

    // 🧊 Vanilla JS 3D Tilt Effect for Cards
    init3DTilt() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; 
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s ease';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; 
            });
        });
    },

    // 📜 Render Cart DOM Dynamically
    renderCartPage() {
        const container = document.getElementById('cart-items-container');
        const totalSpan = document.getElementById('cart-total-price');
        if (!container) return; 

        if (this.cart.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:3rem; color:#a1a1aa;">Your luxury cart is empty. 🍨</div>';
            totalSpan.textContent = '0';
            return;
        }

        let total = 0;
        container.innerHTML = this.cart.map((item, index) => {
            total += item.price;
            return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.img}" alt="${item.name}">
                    <h3 class="serif">${item.name}</h3>
                </div>
                <div style="display:flex; align-items:center; gap:2rem;">
                    <p class="gold-text" style="font-size:1.5rem; font-weight:600;">₹${item.price}</p>
                    <button class="remove-btn" onclick="App.removeFromCart(${index})"><i class="fas fa-times"></i>✕</button>
                </div>
            </div>`;
        }).join('');
        
        totalSpan.textContent = total;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
