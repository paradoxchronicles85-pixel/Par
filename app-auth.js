// Complete Auth System with Database Integration

async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const signupData = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        plan: formData.get('plan') || 'free',
        userType: 'regular'
    };

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('paradoxUser', JSON.stringify(data.user));
            localStorage.setItem('paradoxToken', data.user.id);
            window.location.href = '/dashboard.html';
        } else {
            alert('Signup Error: ' + data.error);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Failed to create account. Please try again.');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('paradoxUser', JSON.stringify(data.user));
            localStorage.setItem('paradoxToken', data.user.id);
            window.location.href = data.redirectTo || '/dashboard.html';
        } else {
            alert('Login Error: ' + data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to login. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('paradoxUser');
    localStorage.removeItem('paradoxToken');
    window.location.href = '/';
}

function copyReferralLink() {
    const user = JSON.parse(localStorage.getItem('paradoxUser'));
    const link = `${window.location.origin}/?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    alert('✅ Referral link copied: ' + link);
}

function isWithdrawalWindowOpen() {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return now.getDate() >= lastDayOfMonth - 6;
}

function getDaysUntilWithdrawal() {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysToWait = lastDayOfMonth - 6 - now.getDate();
    return daysToWait > 0 ? daysToWait : 0;
}

function navigateTo(section) {
    // Dashboard navigation
    window.location.hash = '#' + section;
}
