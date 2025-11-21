import crypto from 'crypto';

export function generateTrackingCode(): string {
    return 'TRK_' + crypto.randomBytes(8).toString('hex').toUpperCase();
}

export function generateShareUrl(baseUrl: string, trackingCode: string, platform: string): string {
    return `${baseUrl}/share/${trackingCode}?platform=${platform}&utm_source=paradox&utm_campaign=task_share`;
}

export interface ShareVerification {
    isVerified: boolean;
    platform: string;
    method: string;
    timestamp: number;
}

export async function verifyFacebookShare(accessToken: string, postId: string): Promise<ShareVerification> {
    try {
        const response = await fetch(
            `https://graph.facebook.com/me/feed?access_token=${accessToken}`
        );
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
            const hasShare = data.data.some((post: any) => post.message?.includes(postId));
            return {
                isVerified: hasShare,
                platform: 'facebook',
                method: 'oauth',
                timestamp: Date.now()
            };
        }
        
        return { isVerified: false, platform: 'facebook', method: 'oauth', timestamp: Date.now() };
    } catch (e) {
        console.error('Facebook verification error:', e);
        return { isVerified: false, platform: 'facebook', method: 'oauth', timestamp: Date.now() };
    }
}

export async function verifyTwitterShare(accessToken: string, tweetId: string): Promise<ShareVerification> {
    try {
        const response = await fetch('https://api.twitter.com/2/tweets/search/recent', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
            const hasShare = data.data.some((tweet: any) => tweet.id === tweetId);
            return {
                isVerified: hasShare,
                platform: 'twitter',
                method: 'oauth',
                timestamp: Date.now()
            };
        }
        
        return { isVerified: false, platform: 'twitter', method: 'oauth', timestamp: Date.now() };
    } catch (e) {
        console.error('Twitter verification error:', e);
        return { isVerified: false, platform: 'twitter', method: 'oauth', timestamp: Date.now() };
    }
}

export async function verifyLinkedInShare(accessToken: string, shareId: string): Promise<ShareVerification> {
    try {
        const response = await fetch('https://api.linkedin.com/v2/me/shares', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data.elements && Array.isArray(data.elements)) {
            const hasShare = data.elements.some((share: any) => share.id === shareId);
            return {
                isVerified: hasShare,
                platform: 'linkedin',
                method: 'oauth',
                timestamp: Date.now()
            };
        }
        
        return { isVerified: false, platform: 'linkedin', method: 'oauth', timestamp: Date.now() };
    } catch (e) {
        console.error('LinkedIn verification error:', e);
        return { isVerified: false, platform: 'linkedin', method: 'oauth', timestamp: Date.now() };
    }
}

export async function verifyInstagramShare(accessToken: string): Promise<ShareVerification> {
    try {
        const response = await fetch(`https://graph.instagram.com/me/media?access_token=${accessToken}`);
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            return {
                isVerified: true,
                platform: 'instagram',
                method: 'oauth',
                timestamp: Date.now()
            };
        }
        
        return { isVerified: false, platform: 'instagram', method: 'oauth', timestamp: Date.now() };
    } catch (e) {
        console.error('Instagram verification error:', e);
        return { isVerified: false, platform: 'instagram', method: 'oauth', timestamp: Date.now() };
    }
}

export function verifyWhatsAppShare(trackingCode: string, clickRecord: any): ShareVerification {
    const isVerified = clickRecord && clickRecord.platform === 'whatsapp' && clickRecord.referrer?.includes('whatsapp');
    return {
        isVerified,
        platform: 'whatsapp',
        method: 'url_tracking',
        timestamp: Date.now()
    };
}

export function verifyTelegramShare(trackingCode: string, clickRecord: any): ShareVerification {
    const isVerified = clickRecord && clickRecord.platform === 'telegram' && clickRecord.referrer?.includes('telegram');
    return {
        isVerified,
        platform: 'telegram',
        method: 'url_tracking',
        timestamp: Date.now()
    };
}

export function verifyGenericShare(trackingCode: string, clickRecord: any): ShareVerification {
    const isVerified = clickRecord && clickRecord.clickedAt !== null;
    return {
        isVerified,
        platform: 'generic',
        method: 'url_tracking',
        timestamp: Date.now()
    };
}
