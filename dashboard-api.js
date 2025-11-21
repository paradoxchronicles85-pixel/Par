// Real Dashboard Data Loading from API

const user = JSON.parse(localStorage.getItem('paradoxUser'));

if (!user) {
    window.location.href = '/';
} else {
    document.getElementById('userName').textContent = user.fullname.split(' ')[0];
    
    const planBadge = document.getElementById('planBadge');
    if (planBadge) {
        planBadge.textContent = (user.plan || 'free').toUpperCase();
        planBadge.className = `plan-badge ${user.plan}`;
    }
    
    // Load real earnings and tasks
    async function loadDashboardData() {
        try {
            const res = await fetch('/api/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            
            const data = await res.json();
            
            if (data.success) {
                // Update with real data from database
                console.log('Dashboard data loaded:', data);
                // Update UI with real earnings, tasks, referrals
                if (document.getElementById('totalEarnings')) {
                    document.getElementById('totalEarnings').textContent = 
                        '₦' + (data.user.totalEarnings || 0).toLocaleString();
                }
            }
        } catch (e) {
            console.error('Dashboard load error:', e);
        }
    }

    // Load available tasks for user
    async function loadAvailableTasks() {
        try {
            const res = await fetch('/api/tasks/available', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, userPlan: user.plan })
            });
            
            const data = await res.json();
            if (data.success) {
                console.log('Available tasks:', data.tasks);
            }
        } catch (e) {
            console.error('Tasks load error:', e);
        }
    }
    
    loadDashboardData();
    loadAvailableTasks();
}
