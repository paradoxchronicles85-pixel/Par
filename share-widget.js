// Social Media Share Widget with Real Verification

class ShareWidget {
    constructor(taskId, userId) {
        this.taskId = taskId;
        this.userId = userId;
        this.trackingCode = null;
    }

    async generateShareLink() {
        try {
            const res = await fetch('/api/shares/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    taskId: this.taskId,
                    platform: 'generic'
                })
            });

            const data = await res.json();
            if (data.success) {
                this.trackingCode = data.trackingCode;
                return data;
            }
        } catch (e) {
            console.error('Share generation error:', e);
        }
    }

    async shareOnFacebook() {
        await this.generateShareLink();
        const message = 'Join Paradox and earn money! 🚀 Check this out:';
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/share/' + this.trackingCode)}`,
            '_blank',
            'width=600,height=400'
        );
        this.verifyAfterDelay('facebook');
    }

    async shareOnTwitter() {
        await this.generateShareLink();
        const text = 'Making money with Paradox is incredible! 💰 Join now:';
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin + '/share/' + this.trackingCode)}`,
            '_blank',
            'width=550,height=420'
        );
        this.verifyAfterDelay('twitter');
    }

    async shareOnInstagram() {
        await this.generateShareLink();
        alert(`📸 Copy and share on Instagram:\n\n${window.location.origin}/share/${this.trackingCode}`);
        this.verifyAfterDelay('instagram');
    }

    async shareOnLinkedIn() {
        await this.generateShareLink();
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/share/' + this.trackingCode)}`,
            '_blank',
            'width=750,height=600'
        );
        this.verifyAfterDelay('linkedin');
    }

    async shareOnWhatsApp() {
        await this.generateShareLink();
        const text = 'Check out Paradox and earn money! ' + window.location.origin + '/share/' + this.trackingCode;
        window.open(
            `https://wa.me/?text=${encodeURIComponent(text)}`,
            '_blank'
        );
        this.verifyAfterDelay('whatsapp');
    }

    async shareOnTelegram() {
        await this.generateShareLink();
        const text = 'Paradox - Earn money online! ' + window.location.origin + '/share/' + this.trackingCode;
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/share/' + this.trackingCode)}&text=${encodeURIComponent(text)}`,
            '_blank'
        );
        this.verifyAfterDelay('telegram');
    }

    async copyShareLink() {
        await this.generateShareLink();
        const link = `${window.location.origin}/share/${this.trackingCode}`;
        navigator.clipboard.writeText(link);
        alert('✅ Link copied! Share it anywhere.');
    }

    async verifyAfterDelay(platform) {
        // Wait 5 seconds then check if user came back
        setTimeout(async () => {
            await this.verifyShare(platform);
        }, 5000);
    }

    async verifyShare(platform) {
        try {
            const res = await fetch('/api/shares/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    taskId: this.taskId,
                    platform
                })
            });

            const data = await res.json();
            if (data.success && data.isVerified) {
                alert(`✅ ${platform.toUpperCase()} share verified!\n💰 ₦${data.bonus} bonus added to your account!`);
            }
        } catch (e) {
            console.error('Verification error:', e);
        }
    }

    render() {
        return `
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 2rem; margin: 2rem 0;">
                <h3 style="color: white; margin-bottom: 1.5rem;">📢 Share & Earn Bonus</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 1.5rem;">Share this task on social media and earn ₦500 bonus instantly!</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem;">
                    <button onclick="shareWidget.shareOnFacebook()" style="padding: 12px; background: #1877f2; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">📘 Facebook</button>
                    <button onclick="shareWidget.shareOnTwitter()" style="padding: 12px; background: #000; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">𝕏 Twitter</button>
                    <button onclick="shareWidget.shareOnInstagram()" style="padding: 12px; background: #e4405f; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">📷 Instagram</button>
                    <button onclick="shareWidget.shareOnLinkedIn()" style="padding: 12px; background: #0a66c2; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">💼 LinkedIn</button>
                    <button onclick="shareWidget.shareOnWhatsApp()" style="padding: 12px; background: #25d366; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">💬 WhatsApp</button>
                    <button onclick="shareWidget.shareOnTelegram()" style="padding: 12px; background: #0088cc; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">✈️ Telegram</button>
                    <button onclick="shareWidget.copyShareLink()" style="padding: 12px; background: #10b981; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">🔗 Copy Link</button>
                </div>
            </div>
        `;
    }
}
