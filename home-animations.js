
// Custom Cursor System
const cursorGlow = document.querySelector('.cursor-glow');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth follow for glow
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    // Instant follow for dot
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    
    if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
    }
    
    if (cursorDot) {
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Magnetic Button Effect
document.querySelectorAll('.magnetic-btn, .magnetic-element').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        
        if (cursorGlow) {
            cursorGlow.style.width = '500px';
            cursorGlow.style.height = '500px';
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        
        if (cursorGlow) {
            cursorGlow.style.width = '400px';
            cursorGlow.style.height = '400px';
        }
    });
});

// 3D Tilt Card Effect
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Constellation Canvas
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Star {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.speed = 0.2 + Math.random() * 0.5;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.radius = 0.5 + Math.random() * 1.5;
        this.opacity = 0.3 + Math.random() * 0.7;
        this.twinkleSpeed = 0.02 + Math.random() * 0.03;
        this.twinklePhase = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.y += this.speed;
        this.twinklePhase += this.twinkleSpeed;
        
        if (this.y > canvas.height) {
            this.reset();
        }
    }
    
    draw() {
        const twinkle = (Math.sin(this.twinklePhase) + 1) / 2;
        const currentOpacity = this.opacity * (0.5 + twinkle * 0.5);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${currentOpacity})`;
        ctx.fill();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.radius * 4, this.y - this.radius * 4, this.radius * 8, this.radius * 8);
    }
}

const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star());
}

function animateConstellation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections between nearby stars
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.strokeStyle = `rgba(102, 126, 234, ${(1 - distance / 150) * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animateConstellation);
}

animateConstellation();

// Scroll-triggered Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            
            setTimeout(() => {
                entry.target.classList.add('aos-animate');
            }, delay);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Number Counter Animation
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// Modal Controls
const modal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const showLogin = document.getElementById('showLogin');
const showSignup = document.getElementById('showSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function openModal(formType = 'signup') {
    modal.classList.add('show');
    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
}

// All CTA buttons
const ctaButtons = [
    document.getElementById('navStart'),
    document.getElementById('navLogin'),
    document.getElementById('heroStart'),
    document.getElementById('finalCTA'),
    ...document.querySelectorAll('.btn-price-premium')
];

ctaButtons.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            if (btn.id === 'navLogin') {
                openModal('login');
            } else {
                openModal('signup');
            }
        });
    }
});

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            modal.classList.remove('show');
        }
    });
}

if (showLogin) {
    showLogin.addEventListener('click', () => openModal('login'));
}

if (showSignup) {
    showSignup.addEventListener('click', () => openModal('signup'));
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Effect
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    
    // Parallax for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
    
    // Parallax for morphing blobs
    const blobs = document.querySelectorAll('.morph-blob');
    blobs.forEach((blob, index) => {
        const speed = 0.1 + (index * 0.05);
        blob.style.transform = `translate(${scrollY * speed * 0.3}px, ${scrollY * speed}px)`;
    });
});

// Add button particles effect
document.querySelectorAll('.btn-particles').forEach(btn => {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #FFD700;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: particleFloat ${2 + Math.random()}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        btn.appendChild(particle);
    }
});

// Add particle float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Paradox Platform Loaded - All Systems Active');
