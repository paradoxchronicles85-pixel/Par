// Connect forms to auth handlers
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupFormElement');
    const loginForm = document.getElementById('loginFormElement');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password match validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            if (confirmPassword.value !== password.value) {
                passwordMatch.textContent = '❌ Passwords do not match';
                passwordMatch.style.color = '#ef4444';
            } else {
                passwordMatch.textContent = '✅ Passwords match';
                passwordMatch.style.color = '#10b981';
            }
        });
    }

    // Coupon validation
    const validateBtn = document.getElementById('validateCouponBtn');
    if (validateBtn) {
        validateBtn.addEventListener('click', async () => {
            const code = document.getElementById('couponInput').value;
            const plan = document.getElementById('planSelect').value;
            
            if (!code || !plan) {
                alert('Please enter coupon code and select a plan');
                return;
            }

            try {
                const res = await fetch('/api/validate-coupon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, plan })
                });
                
                const data = await res.json();
                const msg = document.getElementById('couponMessage');
                
                if (data.valid) {
                    msg.textContent = `✅ ${data.discount}% discount applied!`;
                    msg.style.color = '#10b981';
                } else {
                    msg.textContent = `❌ ${data.error}`;
                    msg.style.color = '#ef4444';
                }
            } catch (e) {
                alert('Validation failed');
            }
        });
    }
});
