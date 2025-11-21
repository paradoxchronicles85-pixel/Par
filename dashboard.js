// Check authentication
const user = JSON.parse(localStorage.getItem('paradoxUser') || 'null');

if (!user) {
    window.location.href = '/index.html';
}

// Set user info
document.getElementById('userName').textContent = user.fullname || user.email;

// Plan configurations
const planConfigs = {
    free: {
        name: 'Free Access',
        color: '#9E9E9E',
        dailyEarning: 0,
        referralBonus: 0,
        referralMultiplier: 0,
        minWithdrawal: {
            referral: 0,
            income: 0
        },
        features: [],
        stats: userType === 'admin' || userType === 'vendor' ? {
            totalEarnings: 0,
            taskEarnings: 0,
            taskStreak: 0,
            coursesCompleted: 0,
            referrals: 0,
            referralEarnings: 0,
            withdrawableTask: 0,
            withdrawableReferral: 0
        } : {
            totalEarnings: 0,
            taskEarnings: 0,
            taskStreak: 0,
            coursesCompleted: 0,
            referrals: 0,
            referralEarnings: 0,
            withdrawableTask: 0,
            withdrawableReferral: 0
        }
    },
    lite: {
        name: 'Lite Plug',
        color: '#667eea',
        dailyEarning: 4000,
        referralBonus: 4000,
        referralMultiplier: 1.0,
        minWithdrawal: {
            referral: 20000,
            income: 20000
        },
        features: ['digital_skills', 'daily_tasks', 'referrals'],
        stats: {
            totalEarnings: 28000,
            taskEarnings: 20000,
            taskStreak: 7,
            coursesCompleted: 3,
            referrals: 5,
            referralEarnings: 20000,
            withdrawableTask: 20000,
            withdrawableReferral: 20000
        }
    },
    standard: {
        name: 'Standard Plug',
        color: '#f093fb',
        dailyEarning: 7000,
        referralBonus: 10000,
        referralMultiplier: 1.5,
        bonusCondition: 'Quick upgrade bonus',
        minWithdrawal: {
            referral: 20000,
            income: 69000
        },
        features: ['digital_skills', 'daily_tasks', 'mentorship', 'reshares', 'referrals'],
        stats: {
            totalEarnings: 184000,
            taskEarnings: 49000,
            taskStreak: 7,
            coursesCompleted: 5,
            referrals: 12,
            referralEarnings: 135000,
            withdrawableTask: 49000,
            withdrawableReferral: 135000,
            incomeEarnings: 41000
        }
    },
    premium: {
        name: 'Premium Plug',
        color: '#fa709a',
        dailyEarning: 10000,
        referralBonus: 13000,
        referralMultiplier: 2.0,
        bonusCondition: 'Purchase commission',
        minWithdrawal: {
            referral: 26000,
            income: 90000
        },
        features: ['trip_sa', 'mentorship', 'reshares', 'free_delivery', 'celebrity_network', 'referrals'],
        stats: {
            totalEarnings: 359000,
            taskEarnings: 70000,
            taskStreak: 7,
            networkConnections: 23,
            perksUnlocked: 8,
            referrals: 18,
            referralEarnings: 289000,
            withdrawableTask: 70000,
            withdrawableReferral: 289000,
            incomeEarnings: 63000
        }
    },
    bg: {
        name: 'BG Plug',
        color: '#4facfe',
        dailyEarning: 15000,
        referralBonus: 15000,
        referralMultiplier: 3.0,
        bonusCondition: 'Network earnings',
        minWithdrawal: {
            referral: 30000,
            income: 125000
        },
        features: ['trip_sa', 'mentorship', 'reshares', 'free_delivery', 'scholarship', 'celebrity_network', 'referrals'],
        stats: {
            totalEarnings: 902000,
            taskEarnings: 105000,
            taskStreak: 7,
            networkConnections: 45,
            perksUnlocked: 12,
            scholarshipProgress: 65,
            referrals: 34,
            referralEarnings: 672000,
            networkEarnings: 125000,
            withdrawableTask: 105000,
            withdrawableReferral: 797000,
            incomeEarnings: 97000
        }
    }
};

const currentPlan = planConfigs[user.plan] || planConfigs.free;
const userType = user.userType || 'user';

// Set plan badge
const planBadge = document.getElementById('planBadge');
planBadge.textContent = currentPlan.name;
planBadge.classList.add(user.plan);

// Access control based on user type
function hasAccess(feature) {
    if (userType === 'admin') return true;
    if (userType === 'vendor') return ['dashboard', 'coupons'].includes(feature);
    if (userType === 'free') return ['dashboard'].includes(feature);
    return true;
}

// Show admin badge if admin
if (userType === 'admin') {
    const adminBadge = document.createElement('div');
    adminBadge.className = 'admin-badge';
    adminBadge.innerHTML = '<span>ADMIN ACCESS</span>';
    adminBadge.style.cssText = 'background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 10px auto; text-align: center; max-width: fit-content;';
    planBadge.parentElement.appendChild(adminBadge);
}

// Show vendor badge if vendor
if (userType === 'vendor') {
    const vendorBadge = document.createElement('div');
    vendorBadge.className = 'vendor-badge-dash';
    vendorBadge.innerHTML = '<span>VENDOR ACCESS</span>';
    vendorBadge.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 10px auto; text-align: center; max-width: fit-content;';
    planBadge.parentElement.appendChild(vendorBadge);
}

// Show coupons nav ONLY for vendors and admin
if (userType === 'vendor' || userType === 'admin') {
    const couponsNav = document.getElementById('couponsNav');
    if (couponsNav) {
        couponsNav.style.display = 'flex';
    }
} else {
    // Hide for everyone else
    const couponsNav = document.getElementById('couponsNav');
    if (couponsNav) {
        couponsNav.style.display = 'none';
    }
}

// Show task management for admin
if (userType === 'admin') {
    const tasksNav = document.getElementById('tasksNav');
    tasksNav.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
        </svg>
        Task Management
    `;
}

// Content templates
const templates = {
    overview: () => `
        <h2 class="section-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 26C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z"/>
                <path d="M16 8c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"/>
            </svg>
            Welcome Back, ${user.fullname.split(' ')[0]}!
        </h2>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#10b981">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div class="stat-value">₦${currentPlan.stats.totalEarnings.toLocaleString()}</div>
                <div class="stat-label">Total Earnings</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(59, 130, 246, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                </div>
                <div class="stat-value">₦${currentPlan.stats.taskEarnings.toLocaleString()}</div>
                <div class="stat-label">Task Income</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(168, 85, 247, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                </div>
                <div class="stat-value">₦${currentPlan.stats.referralEarnings.toLocaleString()}</div>
                <div class="stat-label">Referral Income</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(99, 102, 241, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#6366f1">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l8.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="stat-value">${realUserData?.user?.tasksCompleted || user.tasksCompleted || 0}</div>
                <div class="stat-label">Tasks Completed</div>
            </div>

            ${currentPlan.features.includes('digital_skills') ? `
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(236, 72, 153, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                </div>
                <div class="stat-value">${currentPlan.stats.coursesCompleted || 0}</div>
                <div class="stat-label">Courses Completed</div>
            </div>
            ` : ''}

            ${currentPlan.features.includes('reshares') ? `
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(245, 158, 11, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                </div>
                <div class="stat-value">${currentPlan.stats.referrals || 0}</div>
                <div class="stat-label">Referrals</div>
            </div>
            ` : ''}
        </div>

        <div class="content-section">
            <h3 class="section-title">💸 Withdrawal Center</h3>
            <div class="withdrawal-grid">
                <div class="withdrawal-card">
                    <div class="withdrawal-header">
                        <h4>💼 Task Income</h4>
                        <span class="min-badge">Min: ₦${currentPlan.minWithdrawal.income.toLocaleString()}</span>
                    </div>
                    <div class="withdrawal-amount">₦${currentPlan.stats.withdrawableTask.toLocaleString()}</div>
                    <div class="withdrawal-status ${currentPlan.stats.withdrawableTask >= currentPlan.minWithdrawal.income && isWithdrawalWindowOpen() ? 'eligible' : 'pending'}">
                        ${!isWithdrawalWindowOpen() 
                            ? `🔒 Opens in ${getDaysUntilWithdrawal()} days (Last week of month)` 
                            : currentPlan.stats.withdrawableTask >= currentPlan.minWithdrawal.income 
                                ? '✓ Eligible for withdrawal' 
                                : `Need ₦${(currentPlan.minWithdrawal.income - currentPlan.stats.withdrawableTask).toLocaleString()} more`}
                    </div>
                    <button class="btn-withdraw ${currentPlan.stats.withdrawableTask >= currentPlan.minWithdrawal.income && isWithdrawalWindowOpen() ? '' : 'disabled'}" 
                            ${currentPlan.stats.withdrawableTask >= currentPlan.minWithdrawal.income && isWithdrawalWindowOpen() ? 'onclick="initiateWithdrawal(\'task\')"' : 'disabled'}>
                        ${!isWithdrawalWindowOpen() ? 'Window Closed' : currentPlan.stats.withdrawableTask >= currentPlan.minWithdrawal.income ? 'Withdraw Now' : 'Not Yet Available'}
                    </button>
                </div>

                <div class="withdrawal-card">
                    <div class="withdrawal-header">
                        <h4>👥 Referral Income</h4>
                        <span class="min-badge">Min: ₦${currentPlan.minWithdrawal.referral.toLocaleString()}</span>
                    </div>
                    <div class="withdrawal-amount">₦${currentPlan.stats.withdrawableReferral.toLocaleString()}</div>
                    <div class="withdrawal-status ${currentPlan.stats.withdrawableReferral >= currentPlan.minWithdrawal.referral && isWithdrawalWindowOpen() ? 'eligible' : 'pending'}">
                        ${!isWithdrawalWindowOpen() 
                            ? `🔒 Opens in ${getDaysUntilWithdrawal()} days (Last week of month)` 
                            : currentPlan.stats.withdrawableReferral >= currentPlan.minWithdrawal.referral 
                                ? '✓ Eligible for withdrawal' 
                                : `Need ₦${(currentPlan.minWithdrawal.referral - currentPlan.stats.withdrawableReferral).toLocaleString()} more`}
                    </div>
                    <button class="btn-withdraw ${currentPlan.stats.withdrawableReferral >= currentPlan.minWithdrawal.referral && isWithdrawalWindowOpen() ? '' : 'disabled'}" 
                            ${currentPlan.stats.withdrawableReferral >= currentPlan.minWithdrawal.referral && isWithdrawalWindowOpen() ? 'onclick="initiateWithdrawal(\'referral\')"' : 'disabled'}>
                        ${!isWithdrawalWindowOpen() ? 'Window Closed' : currentPlan.stats.withdrawableReferral >= currentPlan.minWithdrawal.referral ? 'Withdraw Now' : 'Not Yet Available'}
                    </button>
                </div>
            </div>

            <div class="withdrawal-info">
                <p>💡 <strong>Withdrawal Schedule:</strong> Withdrawals open during the last 7 days of each month. Both income streams are tracked separately with a ₦${currentPlan.minWithdrawal.income.toLocaleString()} minimum for task income and ₦${currentPlan.minWithdrawal.referral.toLocaleString()} for referral income. Processing takes 48 hours after submission.</p>
            </div>
        </div>

        <div class="content-section">
            <h3 class="section-title">💰 Referral Rewards</h3>
            <div class="referral-bonus-card">
                <div class="bonus-header">
                    <h4>Earn ₦${currentPlan.referralBonus.toLocaleString()} per referral</h4>
                    ${currentPlan.bonusCondition ? `<p class="bonus-condition">+ ${currentPlan.bonusCondition}</p>` : ''}
                </div>
                <div class="referral-stats-grid">
                    <div class="ref-stat">
                        <div class="ref-value">${currentPlan.stats.referrals || 0}</div>
                        <div class="ref-label">Total Referrals</div>
                    </div>
                    <div class="ref-stat">
                        <div class="ref-value">₦${(currentPlan.stats.referralEarnings || 0).toLocaleString()}</div>
                        <div class="ref-label">Referral Earnings</div>
                    </div>
                    ${currentPlan.stats.networkEarnings ? `
                    <div class="ref-stat">
                        <div class="ref-value">₦${currentPlan.stats.networkEarnings.toLocaleString()}</div>
                        <div class="ref-label">Network Bonus</div>
                    </div>
                    ` : ''}
                </div>
                <button class="btn-complete" onclick="copyReferralLink()" style="width: 100%; margin-top: 1rem;">
                    📋 Copy Referral Link
                </button>
            </div>
        </div>

        <div class="content-section">
            <h3 class="section-title">Quick Actions</h3>
            <div class="task-list">
                <div class="task-item">
                    <div class="task-info">
                        <h4>Complete Today's Task</h4>
                        <p>Earn ₦${currentPlan.dailyEarning.toLocaleString()} today</p>
                    </div>
                    <button class="btn-complete" onclick="navigateTo('tasks')">Start Now</button>
                </div>
                ${currentPlan.features.includes('digital_skills') ? `
                <div class="task-item">
                    <div class="task-info">
                        <h4>Continue Learning</h4>
                        <p>Master digital marketing & Web3</p>
                    </div>
                    <button class="btn-complete" onclick="navigateTo('courses')">Go to Courses</button>
                </div>
                ` : ''}
                ${currentPlan.features.includes('celebrity_network') ? `
                <div class="task-item">
                    <div class="task-info">
                        <h4>Expand Your Network</h4>
                        <p>Connect with ${currentPlan.stats.networkConnections} influencers</p>
                    </div>
                    <button class="btn-complete" onclick="navigateTo('network')">View Network</button>
                </div>
                ` : ''}
            </div>
        </div>
    `,

    earnings: () => `
        <h2 class="section-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2zm0 26C9.38 28 4 22.62 4 16S9.38 4 16 4s12 5.38 12 12-5.38 12-12 12z"/>
                <path d="M16 8c-1.1 0-2 .9-2 2v2h-2v2h2v6h2v-6h2v-2c0-.55.45-1 1-1h1V8h-2z"/>
            </svg>
            Your Earnings
        </h2>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">₦${currentPlan.stats.totalEarnings.toLocaleString()}</div>
                <div class="stat-label">Total Earnings</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(currentPlan.stats.totalEarnings / 100000) * 100}%"></div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-value">₦${currentPlan.dailyEarning.toLocaleString()}</div>
                <div class="stat-label">Daily Potential</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">${currentPlan.stats.taskStreak}</div>
                <div class="stat-label">Day Streak</div>
            </div>
        </div>

        <div class="content-section">
            <h3 class="section-title">Earnings History</h3>
            <div class="task-list">
                ${[...Array(7)].map((_, i) => `
                    <div class="task-item">
                        <div class="task-info">
                            <h4>Day ${7 - i} Earnings</h4>
                            <p>${new Date(Date.now() - i * 86400000).toLocaleDateString()}</p>
                        </div>
                        <div class="task-reward">₦${currentPlan.dailyEarning.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,

    tasks: () => {
        if (userType === 'admin') {
            return `
                <h2 class="section-title">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M9 3v2h14V3H9zm-4 4v20h22V7H5zm2 2h18v16H7V9zm2 2v2h14v-2H9zm0 4v2h14v-2H9zm0 4v2h10v-2H9z"/>
                    </svg>
                    Task Management (Admin)
                </h2>

                <div class="content-section">
                    <button class="btn-complete" onclick="showCreateTaskForm()" style="margin-bottom: 2rem;">
                        + Create New Task
                    </button>

                    <div id="createTaskForm" style="display: none; background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem;">Create New Task</h3>
                        <form id="taskCreationForm" style="display: flex; flex-direction: column; gap: 1rem;">
                            <input type="text" name="title" placeholder="Task Title" required style="padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;">
                            <textarea name="description" placeholder="Task Description" required style="padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; min-height: 100px;"></textarea>
                            <input type="number" name="reward" placeholder="Reward Amount (₦)" required min="100" style="padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;">
                            <select name="planRequired" style="padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;">
                                <option value="">All Plans</option>
                                <option value="lite">Lite Only</option>
                                <option value="standard">Standard+</option>
                                <option value="premium">Premium+</option>
                                <option value="bg">BG Only</option>
                            </select>
                            <button type="submit" class="btn-complete">Create Task</button>
                        </form>
                    </div>

                    <h3>Active Tasks</h3>
                    <div id="adminTasksList" class="task-list"></div>
                </div>
            `;
        }

        return `
            <h2 class="section-title">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M9 3v2h14V3H9zm-4 4v20h22V7H5zm2 2h18v16H7V9zm2 2v2h14v-2H9zm0 4v2h14v-2H9zm0 4v2h10v-2H9z"/>
                </svg>
                Daily Tasks
            </h2>

            <div class="content-section">
                <div id="availableTasks" class="task-list">
                    <p style="color: rgba(255,255,255,0.6); text-align: center; padding: 2rem;">Loading available tasks...</p>
                </div>
            </div>
        `;
    },

    courses: () => currentPlan.features.includes('digital_skills') ? `
        <h2 class="section-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 3L3 10l3 1.636V20l10 5.454L26 20v-8.364L29 10 16 3zm0 2.182L26.182 10 16 14.818 5.818 10 16 5.182zM7 12.273L16 17.182 25 12.273v6.909L16 24.091l-9-4.909v-6.909z"/>
            </svg>
            Your Courses
        </h2>

        <div class="perk-grid">
            <div class="perk-card">
                <div class="perk-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                        <path d="M16 3v26M3 16h26"/>
                    </svg>
                </div>
                <h3>Digital Marketing</h3>
                <p>Master social media, SEO, and content strategies</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 45%"></div>
                </div>
            </div>

            <div class="perk-card">
                <div class="perk-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                        <path d="M28 16c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4s12 5.373 12 12z"/>
                    </svg>
                </div>
                <h3>Web3 & Crypto</h3>
                <p>Understanding blockchain and DeFi opportunities</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%"></div>
                </div>
            </div>

            <div class="perk-card">
                <div class="perk-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                        <path d="M16 3l10 6v12l-10 6-10-6V9l10-6z"/>
                    </svg>
                </div>
                <h3>Affiliate Marketing</h3>
                <p>Build passive income streams that scale</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 60%"></div>
                </div>
            </div>
        </div>
    ` : `
        <div class="content-section locked-overlay">
            <h2>Courses Locked</h2>
            <p>Upgrade to Standard plan or higher to access digital skills courses</p>
            <div class="locked-badge">🔒 Upgrade Required</div>
        </div>
    `,

    network: () => currentPlan.features.includes('celebrity_network') ? `
        <h2 class="section-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 15c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6zm0 2c-4 0-12 2-12 6v3h24v-3c0-4-8-6-12-6z"/>
            </svg>
            Celebrity Network
        </h2>

        <div class="perk-grid">
            ${[...Array(currentPlan.stats.networkConnections || 6)].map((_, i) => `
                <div class="perk-card">
                    <div class="perk-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <path d="M16 3l3.09 6.26L26 10.27l-5 4.87 1.18 6.88L16 18.77l-6.18 3.25L11 15.14 6 10.27l6.91-1.01L16 3z"/>
                        </svg>
                    </div>
                    <h3>Influencer ${i + 1}</h3>
                    <p>Connected - ${Math.floor(Math.random() * 50)}K followers</p>
                    <button class="btn-complete" style="margin-top: 1rem;">Message</button>
                </div>
            `).join('')}
        </div>
    ` : `
        <div class="content-section locked-overlay">
            <h2>Celebrity Network Locked</h2>
            <p>Upgrade to Premium or BG plan to access celebrity connections</p>
            <div class="locked-badge">🔒 Upgrade Required</div>
        </div>
    `,

    referrals: () => `
        <h2 class="section-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            Referral Program
        </h2>

        <div class="referral-hero">
            <h3>Your Referral Code</h3>
            <div class="referral-code-display">
                <span id="userReferralCode">${user.email.substring(0, 8).toUpperCase()}</span>
                <button class="btn-copy" onclick="copyReferralCode()">📋 Copy</button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#10b981">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div class="stat-value">₦${currentPlan.referralBonus.toLocaleString()}</div>
                <div class="stat-label">Per Referral</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(99, 102, 241, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#6366f1">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                </div>
                <div class="stat-value">${realUserData?.user?.tasksCompleted || user.tasksCompleted || 0}</div>
                <div class="stat-label">Tasks Completed</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(245, 158, 11, 0.2);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                    </svg>
                </div>
                <div class="stat-value">₦${(currentPlan.stats.referralEarnings || 0).toLocaleString()}</div>
                <div class="stat-label">Total Earned</div>
            </div>
        </div>

        <div class="content-section">
            <h3 class="section-title">Referral Tier Rewards</h3>
            <div class="tier-rewards">
                <div class="tier-card ${currentPlan.stats.referrals >= 5 ? 'unlocked' : 'locked'}">
                    <div class="tier-badge">🥉 Bronze</div>
                    <div class="tier-requirement">5 Referrals</div>
                    <div class="tier-bonus">+₦${(currentPlan.referralBonus * 0.5).toLocaleString()} bonus per referral</div>
                    ${currentPlan.stats.referrals >= 5 ? '<div class="tier-status">✓ Unlocked</div>' : '<div class="tier-status">🔒 Locked</div>'}
                </div>

                <div class="tier-card ${currentPlan.stats.referrals >= 10 ? 'unlocked' : 'locked'}">
                    <div class="tier-badge">🥈 Silver</div>
                    <div class="tier-requirement">10 Referrals</div>
                    <div class="tier-bonus">+₦${currentPlan.referralBonus.toLocaleString()} bonus per referral</div>
                    ${currentPlan.stats.referrals >= 10 ? '<div class="tier-status">✓ Unlocked</div>' : '<div class="tier-status">🔒 Locked</div>'}
                </div>

                <div class="tier-card ${currentPlan.stats.referrals >= 25 ? 'unlocked' : 'locked'}">
                    <div class="tier-badge">🥇 Gold</div>
                    <div class="tier-requirement">25 Referrals</div>
                    <div class="tier-bonus">+₦${(currentPlan.referralBonus * 2).toLocaleString()} + 5% network earnings</div>
                    ${currentPlan.stats.referrals >= 25 ? '<div class="tier-status">✓ Unlocked</div>' : '<div class="tier-status">🔒 Locked</div>'}
                </div>

                <div class="tier-card ${currentPlan.stats.referrals >= 50 ? 'unlocked' : 'locked'}">
                    <div class="tier-badge">💎 Diamond</div>
                    <div class="tier-requirement">50 Referrals</div>
                    <div class="tier-bonus">+₦${(currentPlan.referralBonus * 3).toLocaleString()} + 10% network earnings + Free BG upgrade</div>
                    ${currentPlan.stats.referrals >= 50 ? '<div class="tier-status">✓ Unlocked</div>' : '<div class="tier-status">🔒 Locked</div>'}
                </div>
            </div>
        </div>

        <div class="content-section">
            <h3 class="section-title">Your Referral Link</h3>
            <div class="referral-link-box">
                <input type="text" id="referralLinkInput" value="https://paradox.app/ref/${user.email.substring(0, 8).toUpperCase()}" readonly>
                <button class="btn-complete" onclick="copyReferralLink()">Copy Link</button>
            </div>
            <p style="margin-top: 1rem; color: rgba(255,255,255,0.6); text-align: center;">
                Share on WhatsApp, Instagram, Twitter, or anywhere to start earning!
            </p>
        </div>
    `,

    perks: () => `
        <h2 class="section-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2l3.09 6.26L26 9.27l-5 4.87 1.18 6.88L16 17.77l-6.18 3.25L11 14.14 6 9.27l6.91-1.01L16 2z"/>
            </svg>
            Your Perks & Rewards
        </h2>

        <div class="perk-grid">
            ${currentPlan.features.includes('trip_sa') ? `
                <div class="perk-card">
                    <div class="perk-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <path d="M28 14H18V4h-4v10H4v4h10v10h4V18h10v-4z"/>
                        </svg>
                    </div>
                    <h3>Free Trip to South Africa</h3>
                    <p>All-expenses-paid trip awaits you!</p>
                </div>
            ` : ''}

            ${currentPlan.features.includes('scholarship') ? `
                <div class="perk-card">
                    <div class="perk-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <path d="M16 3L3 10l3 1.636V20l10 5.454L26 20v-8.364L29 10 16 3z"/>
                        </svg>
                    </div>
                    <h3>University Scholarship</h3>
                    <p>Full scholarship progress: ${currentPlan.stats.scholarshipProgress}%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${currentPlan.stats.scholarshipProgress}%"></div>
                    </div>
                </div>
            ` : ''}

            ${currentPlan.features.includes('free_delivery') ? `
                <div class="perk-card">
                    <div class="perk-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <path d="M26 8h-6V4H6v20h20V8zM8 22V6h10v16H8zm18 0h-6V10h6v12z"/>
                        </svg>
                    </div>
                    <h3>Free Delivery</h3>
                    <p>Free delivery on all items across Africa</p>
                </div>
            ` : ''}

            ${currentPlan.features.includes('mentorship') ? `
                <div class="perk-card">
                    <div class="perk-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <path d="M16 15c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6z"/>
                        </svg>
                    </div>
                    <h3>Expert Mentorship</h3>
                    <p>1-on-1 sessions with industry experts</p>
                </div>
            ` : ''}
        </div>
    `,

    coupons: () => {
        if (userType !== 'vendor' && userType !== 'admin') {
            return `<div class="content-section locked-overlay">
                <h2>Access Denied</h2>
                <p>Coupon management is only available to vendors and administrators</p>
            </div>`;
        }

        return `
            <h2 class="section-title">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 00-4 4v20a4 4 0 004 4h16a4 4 0 004-4V8a4 4 0 00-4-4H8zm0 2h16a2 2 0 012 2v20a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" clip-rule="evenodd"/>
                </svg>
                Coupon Management
            </h2>

            <div class="content-section">
                <h3 class="section-title">Generate New Coupon</h3>
                <form id="couponGeneratorForm" style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px;">
                    <div>
                        <label style="color: rgba(255,255,255,0.9); display: block; margin-bottom: 0.5rem;">Select Plan</label>
                        <select name="plan" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;">
                            <option value="lite">Lite Plug</option>
                            <option value="standard">Standard Plug</option>
                            <option value="premium">Premium Plug</option>
                            <option value="bg">BG Plug</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-complete" style="width: fit-content;">Generate Coupon</button>
                </form>
                <div id="generatedCoupon" style="margin-top: 2rem;"></div>
            </div>

            ${userType === 'admin' ? `
                <div class="content-section">
                    <h3 class="section-title">All Generated Coupons</h3>
                    <div id="allCouponsList">
                        <p style="color: rgba(255,255,255,0.6);">Loading coupons...</p>
                    </div>
                </div>
            ` : ''}
        `;
    }
};

// Handle coupon generation form
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'couponGeneratorForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        const plan = formData.get('plan');

        const code = `${plan.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        document.getElementById('generatedCoupon').innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 12px; padding: 2rem; text-align: center;">
                <h4 style="color: #10b981; margin-bottom: 1rem;">Coupon Generated Successfully</h4>
                <div style="font-size: 2rem; font-weight: 800; letter-spacing: 3px; color: white; margin: 1rem 0;">${code}</div>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 1rem;">Plan: ${plan.toUpperCase()}</p>
                <button onclick="navigator.clipboard.writeText('${code}'); showNotification('Coupon copied!', 'success')" class="btn-complete">Copy Coupon</button>
            </div>
        `;

        showNotification('Coupon generated successfully', 'success');
    }
});

// Navigation handler
function navigateTo(section) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const navItem = document.querySelector(`[href="#${section}"]`);
    if (navItem) navItem.classList.add('active');

    const content = templates[section];
    if (content) {
        const main = document.getElementById('dashboardMain');
        main.style.opacity = '0';
        setTimeout(() => {
            main.innerHTML = content();
            main.style.opacity = '1';
        }, 200);
    }
}

// Referral functions
function copyReferralCode() {
    const code = user.email.substring(0, 8).toUpperCase();
    navigator.clipboard.writeText(code);
    showNotification('Referral code copied! 🎉', 'success');
}

function copyReferralLink() {
    const link = `https://paradox.app/ref/${user.email.substring(0, 8).toUpperCase()}`;
    navigator.clipboard.writeText(link);
    showNotification('Referral link copied! Share it to earn 💰', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                    type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                    'linear-gradient(135deg, #6366f1, #4f46e5)';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, type === 'error' ? 5000 : 3000);
}

// Withdrawal functions
// Check if withdrawal window is open (last 7 days of the month)
function isWithdrawalWindowOpen() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();

    // Withdrawal window opens last 7 days of month
    return currentDay >= (lastDayOfMonth - 6);
}

// Get days until next withdrawal window
function getDaysUntilWithdrawal() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const windowStart = lastDayOfMonth - 6;

    if (currentDay < windowStart) {
        return windowStart - currentDay;
    }

    // If we're past this month's window, calculate next month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthLastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const nextWindowStart = nextMonthLastDay - 6;
    const daysLeftThisMonth = lastDayOfMonth - currentDay;
    return daysLeftThisMonth + nextWindowStart;
}

// Show bank details form
function showBankDetailsForm(type) {
    const amount = type === 'task' ? currentPlan.stats.withdrawableTask : currentPlan.stats.withdrawableReferral;
    const incomeType = type === 'task' ? 'Task Income' : 'Referral Income';

    // Check if bank details already exist
    const savedBankDetails = localStorage.getItem('paradoxBankDetails');

    const formHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1rem;">
            <div style="background: linear-gradient(135deg, #1e1b4b, #0f172a); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 2.5rem; max-width: 500px; width: 100%;">
                <h3 style="color: white; margin-bottom: 1.5rem; font-size: 1.5rem;">💳 Bank Details for Withdrawal</h3>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 2rem;">
                    Withdrawing ₦${amount.toLocaleString()} from ${incomeType}
                </p>

                <form id="bankDetailsForm" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <label style="color: rgba(255,255,255,0.9); display: block; margin-bottom: 0.5rem; font-weight: 600;">Account Name</label>
                        <input type="text" name="accountName" required 
                               value="${savedBankDetails ? JSON.parse(savedBankDetails).accountName : ''}"
                               style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-size: 1rem;">
                    </div>

                    <div>
                        <label style="color: rgba(255,255,255,0.9); display: block; margin-bottom: 0.5rem; font-weight: 600;">Account Number</label>
                        <input type="text" name="accountNumber" required pattern="[0-9]{10}" maxlength="10"
                               value="${savedBankDetails ? JSON.parse(savedBankDetails).accountNumber : ''}"
                               style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-size: 1rem;">
                    </div>

                    <div>
                        <label style="color: rgba(255,255,255,0.9); display: block; margin-bottom: 0.5rem; font-weight: 600;">Bank Name</label>
                        <select name="bankName" required
                                style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-size: 1rem;">
                            <option value="">Select Bank</option>
                            <option value="Access Bank">Access Bank</option>
                            <option value="GTBank">GTBank</option>
                            <option value="First Bank">First Bank</option>
                            <option value="UBA">UBA</option>
                            <option value="Zenith Bank">Zenith Bank</option>
                            <option value="Fidelity Bank">Fidelity Bank</option>
                            <option value="Union Bank">Union Bank</option>
                            <option value="Polaris Bank">Polaris Bank</option>
                            <option value="Stanbic IBTC">Stanbic IBTC</option>
                            <option value="Sterling Bank">Sterling Bank</option>
                            <option value="Wema Bank">Wema Bank</option>
                            <option value="Kuda Bank">Kuda Bank</option>
                            <option value="Opay">Opay</option>
                            <option value="Palmpay">Palmpay</option>
                            <option value="Moniepoint">Moniepoint</option>
                        </select>
                    </div>

                    <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 1rem; margin-top: 1rem;">
                        <p style="color: #f59e0b; font-size: 0.875rem; margin: 0;">
                            ⚠️ <strong>Processing Time:</strong> Withdrawals are processed within 48 hours after submission. Ensure your bank details are correct.
                        </p>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <button type="button" onclick="closeBankDetailsForm()" 
                                style="flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" 
                                style="flex: 1; padding: 0.75rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Submit Withdrawal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const formContainer = document.createElement('div');
    formContainer.id = 'bankDetailsModal';
    formContainer.innerHTML = formHTML;
    document.body.appendChild(formContainer);

    // Set saved bank name if exists
    if (savedBankDetails) {
        const bankSelect = formContainer.querySelector('select[name="bankName"]');
        bankSelect.value = JSON.parse(savedBankDetails).bankName;
    }

    // Handle form submission
    document.getElementById('bankDetailsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const bankDetails = {
            email: user.email,
            accountName: formData.get('accountName'),
            accountNumber: formData.get('accountNumber'),
            bankName: formData.get('bankName'),
            withdrawalType: type,
            amount: amount
        };

        try {
            // Send to backend
            const response = await fetch('/api/withdrawal-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bankDetails)
            });

            const data = await response.json();

            if (data.success) {
                // Save bank details locally for future use
                const savedDetails = {
                    accountName: bankDetails.accountName,
                    accountNumber: bankDetails.accountNumber,
                    bankName: bankDetails.bankName
                };
                localStorage.setItem('paradoxBankDetails', JSON.stringify(savedDetails));

                // Save withdrawal request locally
                const withdrawalRequests = JSON.parse(localStorage.getItem('paradoxWithdrawals') || '[]');


// Task management functions
window.showCreateTaskForm = function() {
    const form = document.getElementById('createTaskForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

// Handle task creation
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'taskCreationForm') {
        e.preventDefault();
        const formData = new FormData(e.target);

        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            reward: parseFloat(formData.get('reward')),
            planRequired: formData.get('planRequired') || null,
            taskType: 'daily_task',
            isActive: true
        };

        try {
            const response = await fetch('/api/admin/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id, ...taskData })
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Task created successfully!', 'success');
                e.target.reset();
                document.getElementById('createTaskForm').style.display = 'none';
                loadAdminTasks();
            } else {
                showNotification(result.error || 'Failed to create task', 'error');
            }
        } catch (error) {
            showNotification('Error creating task', 'error');
        }
    }
});

// Load admin tasks
async function loadAdminTasks() {
    try {
        const response = await fetch('/api/admin/tasks/list');
        const result = await response.json();

        if (result.success) {
            const tasksList = document.getElementById('adminTasksList');
            if (!tasksList) return;

            tasksList.innerHTML = result.tasks.map(task => `
                <div class="task-item">
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <p>${task.description}</p>
                        <small style="color: rgba(255,255,255,0.6);">
                            ${task.planRequired ? `${task.planRequired.toUpperCase()} plan required` : 'All plans'} • 
                            ${task.isActive ? '✓ Active' : '✗ Inactive'}
                        </small>
                    </div>
                    <div class="task-reward">₦${parseFloat(task.reward).toLocaleString()}</div>
                    <button class="btn-complete" onclick="toggleTaskStatus(${task.id}, ${!task.isActive})">
                        ${task.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Toggle task status
window.toggleTaskStatus = async function(taskId, activate) {
    try {
        const response = await fetch('/api/admin/tasks/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, isActive: activate })
        });

        const result = await response.json();
        if (result.success) {
            showNotification(`Task ${activate ? 'activated' : 'deactivated'}`, 'success');
            loadAdminTasks();
        }
    } catch (error) {
        showNotification('Error updating task', 'error');
    }
};

// Load available tasks for regular users
async function loadAvailableTasks() {
    if (userType === 'admin' || userType === 'vendor') return;

    try {
        const response = await fetch('/api/tasks/available', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, userPlan: user.plan })
        });

        const result = await response.json();
        const container = document.getElementById('availableTasks');

        if (!container) return;

        if (result.success && result.tasks.length > 0) {
            container.innerHTML = result.tasks.map(task => `
                <div class="task-item">
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <p>${task.description}</p>
                    </div>
                    <div class="task-reward">₦${parseFloat(task.reward).toLocaleString()}</div>
                    <button class="btn-complete" onclick="completeTask(${task.id})">Complete</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 2rem;">No tasks available right now. Check back later!</p>';
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Complete a task
window.completeTask = async function(taskId) {
    try {
        const response = await fetch('/api/tasks/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, taskId })
        });

        const result = await response.json();

        if (result.success) {
            showNotification(`Task completed! +₦${result.reward.toLocaleString()}`, 'success');
            loadAvailableTasks();
            navigateTo('overview'); // Refresh to show updated earnings
        } else {
            showNotification(result.error || 'Failed to complete task', 'error');
        }
    } catch (error) {
        showNotification('Error completing task', 'error');
    }
};

// Load referral stats
async function loadReferralStats() {
    try {
        const response = await fetch('/api/user/referral-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
        });

        const result = await response.json();

        if (result.success) {
            // Update the DOM with the fetched stats
            const referralSection = document.querySelector('.referral-stats-grid'); // Assuming this is where stats are displayed
            if (referralSection) {
                referralSection.innerHTML = `
                    <div class="ref-stat">
                        <div class="ref-value">${result.data.totalReferrals || 0}</div>
                        <div class="ref-label">Total Referrals</div>
                    </div>
                    <div class="ref-stat">
                        <div class="ref-value">₦${(result.data.totalReferralEarnings || 0).toLocaleString()}</div>
                        <div class="ref-label">Referral Earnings</div>
                    </div>
                    ${result.data.networkEarnings ? `
                    <div class="ref-stat">
                        <div class="ref-value">₦${result.data.networkEarnings.toLocaleString()}</div>
                        <div class="ref-label">Network Bonus</div>
                    </div>
                    ` : ''}
                `;
            }

            const referralLinkInput = document.getElementById('referralLinkInput');
            if (referralLinkInput) {
                referralLinkInput.value = result.data.referralLink || `https://paradox.app/ref/${user.email.substring(0, 8).toUpperCase()}`;
            }

            const userReferralCodeSpan = document.getElementById('userReferralCode');
            if (userReferralCodeSpan) {
                userReferralCodeSpan.textContent = result.data.referralCode || user.email.substring(0, 8).toUpperCase();
            }

        } else {
            console.error('Failed to load referral stats:', result.error);
        }
    } catch (error) {
        console.error('Error fetching referral stats:', error);
    }
}


// Auto-load tasks when tasks section is viewed
const originalNavigateTo = navigateTo;
navigateTo = function(section) {
    originalNavigateTo(section);

    if (section === 'tasks') {
        setTimeout(() => {
            if (userType === 'admin') {
                loadAdminTasks();
            } else {
                loadAvailableTasks();
            }
        }, 100);
    }

    if (section === 'referrals') {
        setTimeout(() => {
            loadReferralStats();
        }, 100);
    }
};

                withdrawalRequests.push({
                    ...bankDetails,
                    requestDate: new Date().toISOString(),
                    status: 'pending',
                    processingDeadline: data.processingDeadline
                });
                localStorage.setItem('paradoxWithdrawals', JSON.stringify(withdrawalRequests));

                closeBankDetailsForm();
                showNotification(`✅ Withdrawal request submitted! Payment will be processed within 48 hours to ${bankDetails.accountName} (${bankDetails.bankName}).`, 'success');
            } else {
                throw new Error(data.error || 'Failed to submit withdrawal');
            }
        } catch (error) {
            console.error('Withdrawal submission error:', error);
            showNotification(`❌ Failed to submit withdrawal request. Please try again.`, 'error');
        }
    });
}

function closeBankDetailsForm() {
    const modal = document.getElementById('bankDetailsModal');
    if (modal) modal.remove();
}

// Withdrawal handler with window check
function initiateWithdrawal(type) {
    if (!isWithdrawalWindowOpen()) {
        const daysUntil = getDaysUntilWithdrawal();
        showNotification(`🔒 Withdrawal window opens in ${daysUntil} days. Withdrawals are only available during the last 7 days of each month.`, 'error');
        return;
    }

    let minWithdrawalAmount;
    if (type === 'task') {
        minWithdrawalAmount = currentPlan.minWithdrawal.income;
    } else { // referral
        minWithdrawalAmount = currentPlan.minWithdrawal.referral;
    }

    const amount = type === 'task' ? currentPlan.stats.withdrawableTask : currentPlan.stats.withdrawableReferral;


    if (amount < minWithdrawalAmount) {
        showNotification(`❌ Insufficient balance. Minimum withdrawal is ₦${minWithdrawalAmount.toLocaleString()}`, 'error');
        return;
    }

    showBankDetailsForm(type);
}

// Logout
function logout() {
    localStorage.removeItem('paradoxUser');
    window.location.href = '/index.html';
}

// Initialize with overview
navigateTo('overview');

// Add navigation listeners
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('href').substring(1);
        navigateTo(section);
    });
});

console.log(`🎉 ${currentPlan.name} Dashboard Loaded!`);