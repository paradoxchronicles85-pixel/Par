
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Load admin and vendor phones from environment
const ADMIN_PHONES = (process.env.ADMIN_PHONES || '+2348146417776').split(',').map(p => p.trim());
const VENDOR_PHONES = (process.env.VENDOR_PHONES || '').split(',').map(p => p.trim()).filter(Boolean);

// In-memory storage (replace with DB in production)
const users = new Map();
const coupons = new Map();

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    // Handle API routes
    if (req.url.startsWith('/api/')) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            handleAPI(req, res, body);
        });
        return;
    }

    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 - Not Found');
            } else {
                res.writeHead(500);
                res.end('500 - Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function handleAPI(req, res, body) {
    res.setHeader('Content-Type', 'application/json');
    
    const data = body ? JSON.parse(body) : {};
    
    if (req.url === '/api/signup' && req.method === 'POST') {
        const userType = getUserType(data.phone, data.plan);
        
        // Check for duplicate email/phone
        for (const [key, user] of users.entries()) {
            if (user.email === data.email || user.phone === data.phone) {
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, error: 'Email or phone number already registered' }));
                return;
            }
        }
        
        const userId = Date.now().toString();
        users.set(userId, { ...data, userType, createdAt: new Date() });
        
        res.writeHead(200);
        res.end(JSON.stringify({ 
            success: true, 
            message: 'Account created successfully',
            user: { ...data, userType }
        }));
    }
    else if (req.url === '/api/login' && req.method === 'POST') {
        const user = Array.from(users.values()).find(u => u.email === data.email && u.password === data.password);
        
        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Login successful',
                user: { ...user, password: undefined },
                redirectTo: '/dashboard.html'
            }));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, error: 'Invalid email or password' }));
        }
    }
    else if (req.url === '/api/validate-coupon' && req.method === 'POST') {
        const coupon = coupons.get(data.code);
        if (coupon && coupon.plan === data.plan && !coupon.used) {
            res.writeHead(200);
            res.end(JSON.stringify({ valid: true, discount: coupon.discount }));
        } else if (coupon && coupon.plan !== data.plan) {
            res.writeHead(200);
            res.end(JSON.stringify({ valid: false, error: 'Invalid coupon for this plan', validPlan: coupon.plan }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify({ valid: false, error: 'Invalid or used coupon' }));
        }
    }
    else if (req.url === '/api/config' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ 
            adminPhones: ADMIN_PHONES,
            vendorPhones: VENDOR_PHONES
        }));
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
}

function getUserType(phone, plan) {
    const normalized = phone.replace(/\s+/g, '');
    if (ADMIN_PHONES.some(p => normalized === p.replace(/\s+/g, ''))) return 'admin';
    if (VENDOR_PHONES.some(p => normalized === p.replace(/\s+/g, ''))) return 'vendor';
    if (plan === 'free') return 'free';
    return 'user';
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌟 Paradox Server running at http://0.0.0.0:${PORT}/`);
    console.log(`👑 Admin phones: ${ADMIN_PHONES.join(', ')}`);
    console.log(`🏪 Vendor phones: ${VENDOR_PHONES.length} configured`);
});
