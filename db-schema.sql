
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    coupon_used VARCHAR(100),
    discount_applied INTEGER DEFAULT 0,
    is_vendor BOOLEAN DEFAULT FALSE,
    vendor_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    vendor_id VARCHAR(100) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    discount INTEGER NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_by VARCHAR(255),
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(100) PRIMARY KEY,
    phone VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    codes_generated INTEGER DEFAULT 0,
    is_vendor BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial vendors
INSERT INTO vendors (id, phone, name) VALUES
    ('vendor1', '+13124202900', 'Vendor 1'),
    ('vendor2', '+2347084174994', 'Vendor 2'),
    ('vendor3', '+2347040759259', 'Vendor 3'),
    ('vendor4', '+2348143662936', 'Vendor 4'),
    ('vendor5', '+2347044035084', 'Vendor 5'),
    ('vendor6', '+2347089902875', 'Vendor 6'),
    ('vendor7', '+2349130717272', 'Vendor 7'),
    ('vendor8', '+2347048787493', 'Vendor 8'),
    ('vendor9', '+2349163483144', 'Vendor 9'),
    ('vendor10', '+2349046428186', 'Vendor 10'),
    ('vendor11', '+2347071401650', 'Vendor 11')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_vendors_phone ON vendors(phone);
