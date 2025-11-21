// Create Floating Particles with lifecycle management
let particlesCreated = false;

function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer || particlesCreated) return;
    
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const drift = (Math.random() - 0.5) * 200;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 5;
        const size = 2 + Math.random() * 3;
        
        particle.style.left = startX + 'px';
        particle.style.bottom = '-10px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        particle.style.setProperty('--drift', drift + 'px');
        
        particlesContainer.appendChild(particle);
    }
    
    particlesCreated = true;
}

function cleanupParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
    }
    particlesCreated = false;
}

// Initialize particles
createParticles();

// Handle resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        cleanupParticles();
        createParticles();
    }, 250);
});

// Smooth Scroll Reveal Animations with fallback
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

// Check if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .pricing-card, .vendor-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(el);
    });
} else {
    // Fallback: show elements immediately
    document.querySelectorAll('.feature-card, .pricing-card, .vendor-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// Modal functionality
const modal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

// Open modal for login
loginBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

// Open modal for signup
signupBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Get started button opens signup
getStartedBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Click outside modal to close
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Switch between forms
showSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLogin.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle pricing plan buttons
document.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const plan = e.target.dataset.plan;
        modal.style.display = 'block';
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';

        // Pre-select the plan
        const planSelect = document.querySelector('select[name="plan"]');
        planSelect.value = plan;

        // Add ripple effect
        createRipple(e, btn);
    });
});

// Handle login form submission
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        phone: formData.get('phone'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            localStorage.setItem('paradoxUser', JSON.stringify(result.user));
            setTimeout(() => {
                window.location.href = result.redirectTo || '/dashboard.html';
            }, 1000);
        } else {
            showNotification(result.error || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Connection error. Please check your internet.', 'error');
    }
});

// Password confirmation validation
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const passwordMatch = document.getElementById('passwordMatch');

function validatePassword() {
    if (confirmPassword.value === '') {
        passwordMatch.textContent = '';
        return;
    }

    if (password.value === confirmPassword.value) {
        passwordMatch.style.color = '#10b981';
        passwordMatch.textContent = '✓ Passwords match';
    } else {
        passwordMatch.style.color = '#ef4444';
        passwordMatch.textContent = '✗ Passwords do not match';
    }
}

password.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validatePassword);

// Validate coupon code with plan check
let validatedCoupon = null;
document.getElementById('validateCouponBtn').addEventListener('click', async () => {
    const couponCode = document.getElementById('couponInput').value.trim().toUpperCase();
    const selectedPlan = document.getElementById('planSelect').value;
    const messageDiv = document.getElementById('couponMessage');

    if (!couponCode) {
        messageDiv.style.color = '#ef4444';
        messageDiv.textContent = 'Please enter a coupon code';
        return;
    }

    if (!selectedPlan) {
        messageDiv.style.color = '#ef4444';
        messageDiv.textContent = 'Please select a plan first';
        return;
    }

    try {
        const response = await fetch('/api/validate-coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode, plan: selectedPlan })
        });

        const result = await response.json();

        if (result.valid) {
            validatedCoupon = couponCode;
            messageDiv.style.color = '#10b981';
            messageDiv.textContent = `✓ Valid! ${result.discount}% discount will be applied`;
            document.getElementById('validateCouponBtn').textContent = '✓ Valid';
            document.getElementById('validateCouponBtn').style.background = '#10b981';
        } else {
            validatedCoupon = null;
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = result.error;
            if (result.validPlan) {
                messageDiv.textContent += `. Please select ${result.validPlan.toUpperCase()} plan.`;
            }
        }
    } catch (error) {
        messageDiv.style.color = '#ef4444';
        messageDiv.textContent = 'Error validating coupon';
    }
});

// Check vendor status on phone input
// User type detection - loaded from backend
let ADMIN_PHONES = [];
let VENDOR_PHONES = [];

// Load configuration
fetch('/api/config')
    .then(r => r.json())
    .then(config => {
        ADMIN_PHONES = config.adminPhones || [];
        VENDOR_PHONES = config.vendorPhones || [];
    })
    .catch(err => console.log('Using default config'));

function getUserType(phone, plan) {
    const normalizedPhone = phone.replace(/\s+/g, '');
    
    // Check if phone matches admin
    if (ADMIN_PHONES.some(p => normalizedPhone === p.replace(/\s+/g, ''))) {
        return 'admin';
    }
    
    // Check if phone matches vendors
    if (VENDOR_PHONES.some(v => normalizedPhone === v.replace(/\s+/g, ''))) {
        return 'vendor';
    }
    
    // Check specific admin phone
    if (normalizedPhone === '+2348146417776'.replace(/\s+/g, '')) {
        return 'admin';
    }
    
    if (plan === 'free') {
        return 'free';
    }
    
    return 'user';
}

function needsCouponCode(userType, plan) {
    // Admin and vendors never need coupons
    if (userType === 'admin' || userType === 'vendor') {
        return false;
    }
    
    // Free plan doesn't need coupon
    if (plan === 'free') {
        return false;
    }
    
    // Everyone else needs a coupon for paid plans
    return true;
}

document.getElementById('phoneInput').addEventListener('blur', (e) => {
    const phone = e.target.value.trim();
    if (phone.startsWith('+')) {
        const planSelect = document.querySelector('select[name="plan"]');
        const plan = planSelect ? planSelect.value : '';
        const userType = getUserType(phone, plan);
        
        if (userType === 'admin') {
            showNotification('Admin access detected. Full system access granted.', 'success');
        } else if (userType === 'vendor') {
            showNotification('Vendor account detected. Dashboard and coupon access granted.', 'success');
        }
    }
});

// Real-time duplicate checking
let emailCheckTimeout;
let phoneCheckTimeout;

document.querySelector('input[name="email"]')?.addEventListener('input', async (e) => {
    clearTimeout(emailCheckTimeout);
    const email = e.target.value.trim();
    
    if (!email || !email.includes('@')) return;
    
    emailCheckTimeout = setTimeout(async () => {
        try {
            const response = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            
            if (result.exists) {
                e.target.style.borderColor = '#ef4444';
                showNotification('This email is already registered. Please login instead.', 'error');
            } else {
                e.target.style.borderColor = '#10b981';
            }
        } catch (err) {
            console.log('Email check skipped');
        }
    }, 500);
});

document.getElementById('phoneInput')?.addEventListener('input', async (e) => {
    clearTimeout(phoneCheckTimeout);
    const phone = e.target.value.trim();
    
    if (!phone.startsWith('+')) return;
    
    phoneCheckTimeout = setTimeout(async () => {
        try {
            const response = await fetch('/api/check-phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const result = await response.json();
            
            if (result.exists) {
                e.target.style.borderColor = '#ef4444';
                showNotification('This phone number is already registered.', 'error');
            } else {
                e.target.style.borderColor = '#10b981';
            }
        } catch (err) {
            console.log('Phone check skipped');
        }
    }, 500);
});

// Check for referral code in URL
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        const referralInput = document.getElementById('referralCodeInput');
        if (referralInput) {
            referralInput.value = refCode;
            showNotification('Referral code applied! Sign up to help your friend earn rewards.', 'success');
        }
    }
});

// Handle signup form submission
document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const phone = formData.get('phone');
    const plan = formData.get('plan');

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }

    // Determine user type
    const userType = getUserType(phone, plan);
    const requiresCoupon = needsCouponCode(userType, plan);

    // Check coupon code requirement
    if (requiresCoupon && !validatedCoupon) {
        showNotification('Please validate your coupon code first', 'error');
        return;
    }

    const data = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: phone,
        password: password,
        plan: plan,
        couponCode: requiresCoupon ? validatedCoupon : 'NOT_REQUIRED',
        userType: userType,
        referralCode: formData.get('referralCode') || ''
    };

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Account created successfully. Redirecting...', 'success');
            localStorage.setItem('paradoxUser', JSON.stringify({...result.user, userType}));
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        } else {
            showNotification(result.error || 'Signup failed', 'error');
        }
    } catch (error) {
        console.log('Signup attempt:', data);
        const welcomeMessage = userType === 'admin' ? 'Admin access granted. Full system access enabled.' :
                              userType === 'vendor' ? 'Vendor access granted. Dashboard and coupon generation enabled.' :
                              userType === 'free' ? 'Free account created. Dashboard access granted.' :
                              `Account created successfully. ${plan.toUpperCase()} plan activated.`;
        
        showNotification(welcomeMessage, 'success');
        
        // Store user data locally
        localStorage.setItem('paradoxUser', JSON.stringify({
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            plan: data.plan,
            userType: userType,
            coupon: data.couponCode
        }));
        
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    }
});

// Render vendor cards (10 verified vendors)
const vendorPhones = [
    '+13124202900',
    '+2347084174994',
    '+2347040759259',
    '+2348143662936',
    '+2347044035084',
    '+2347089902875',
    '+2347048787493',
    '+2349163483144',
    '+2349046428186',
    '+2347071401650'
];

function renderVendorCards() {
    const vendorsGrid = document.getElementById('vendorsGrid');
    if (!vendorsGrid) return;

    const vendorColors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#764ba2'];

    vendorsGrid.innerHTML = vendorPhones.map((phone, index) => {
        const color = vendorColors[index % vendorColors.length];
        const formattedPhone = phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');

        return `
            <div class="vendor-card" style="--vendor-color: ${color}">
                <div class="vendor-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" fill="${color}" opacity="0.2"/>
                        <path d="M24 12C17.4 12 12 17.4 12 24C12 30.6 17.4 36 24 36C30.6 36 36 30.6 36 24C36 17.4 30.6 12 24 12ZM24 18C26.2 18 28 19.8 28 22C28 24.2 26.2 26 24 26C21.8 26 20 24.2 20 22C20 19.8 21.8 18 24 18ZM24 34C20.6 34 17.6 32.3 16 29.7C16 26.9 21.3 25.4 24 25.4C26.7 25.4 32 26.9 32 29.7C30.4 32.3 27.4 34 24 34Z" fill="${color}"/>
                    </svg>
                    <div class="vendor-badge">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="${color}">
                            <path d="M10 2L12.245 7.51L18 8.26L14 12.14L15.09 18L10 15.27L4.91 18L6 12.14L2 8.26L7.755 7.51L10 2Z"/>
                        </svg>
                    </div>
                </div>
                <h3>Vendor ${index + 1}</h3>
                <p class="vendor-phone">${formattedPhone}</p>
                <div class="vendor-stats">
                    <div class="vendor-stat">
                        <div class="stat-value">Verified</div>
                        <div class="stat-label">Status</div>
                    </div>
                    <div class="vendor-stat">
                        <div class="stat-value">Active</div>
                        <div class="stat-label">Availability</div>
                    </div>
                </div>
                <a href="https://wa.me/${phone.replace(/\s/g, '')}" target="_blank" class="btn-contact">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2C5.6 2 2 5.6 2 10C2 11.4 2.4 12.7 3 13.9L2 18L6.2 17C7.4 17.6 8.7 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2ZM14 13.5C13.8 14.1 12.9 14.6 12.3 14.7C11.9 14.8 11.4 14.8 10.5 14.5C10 14.3 9.3 14.1 8.5 13.6C6.3 12.5 4.9 10.3 4.8 10.1C4.7 10 4 9 4 8C4 7 4.5 6.5 4.7 6.3C4.9 6.1 5.1 6 5.3 6H5.8C6 6 6.2 6 6.4 6.5C6.6 7 7.1 8 7.1 8.1C7.2 8.2 7.2 8.3 7.1 8.4C7.1 8.5 7 8.6 6.9 8.7C6.8 8.8 6.7 8.9 6.6 9C6.5 9.1 6.4 9.2 6.5 9.4C6.6 9.6 7.1 10.4 7.8 11C8.7 11.8 9.4 12.1 9.6 12.2C9.8 12.3 9.9 12.3 10 12.1C10.1 12 10.6 11.4 10.7 11.2C10.8 11 11 11 11.2 11.1L13 12C13.2 12.1 13.4 12.2 13.5 12.3C13.6 12.5 13.6 13 14 13.5Z"/>
                    </svg>
                    Contact on WhatsApp
                </a>
            </div>
        `;
    }).join('');
}

// Render vendors on page load
renderVendorCards();

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Ripple effect function
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        createRipple(e, button);
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            animation: slideInRight 0.4s ease, fadeOut 0.4s ease 2.6s;
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-width: 400px;
        }
        .notification-success {
            border-left: 4px solid #10b981;
        }
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        .notification-info {
            border-left: 4px solid #6366f1;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(400px);
            }
        }
    `;

    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="color: rgba(255,255,255,0.7);">Welcome, ${user.fullname || user.email}</span>
            <button class="btn-signup" onclick="logout()">Logout</button>
        </div>
    `;
}

// Logout function
function logout() {
    localStorage.removeItem('paradoxUser');
    location.reload();
}

// Check for existing session
window.addEventListener('load', () => {
    const user = localStorage.getItem('paradoxUser');
    if (user) {
        updateUIForLoggedInUser(JSON.parse(user));
    }
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');

    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

console.log('✨ Paradox loaded successfully! Divine prosperity awaits 🌟');