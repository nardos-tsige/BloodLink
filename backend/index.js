const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'bloodlink.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            blood_type TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            role TEXT DEFAULT 'donor',
            is_verified INTEGER DEFAULT 0,
            is_available INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS blood_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            patient_age INTEGER,
            blood_type TEXT NOT NULL,
            units_required INTEGER NOT NULL,
            urgency_level TEXT DEFAULT 'normal',
            status TEXT DEFAULT 'pending',
            requested_by INTEGER,
            requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            approved_by INTEGER,
            approved_at DATETIME,
            FOREIGN KEY (requested_by) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS blood_inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blood_type TEXT UNIQUE NOT NULL,
            units INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS donation_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_id INTEGER,
            request_id INTEGER,
            blood_type TEXT,
            units INTEGER,
            donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (donor_id) REFERENCES users(id)
        )
    `);

    console.log('Database tables ready');
});

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
    console.log('Register request:', req.body);
    
    const { name, email, password, bloodType, phone, address } = req.body;
    
    if (!name || !email || !password || !bloodType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        // Check if user exists
        const existing = await new Promise((resolve, reject) => {
            db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (name, email, password, blood_type, phone, address, role, is_verified)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, email, hashedPassword, bloodType, phone || '', address || '', 'donor', 0],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
        
        console.log('User registered:', { id: result, email });
        res.json({ success: true, message: 'Registration successful!' });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    console.log('Login request:', req.body.email);
    
    const { email, password } = req.body;
    
    try {
        const user = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'bloodlink_secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodType: user.blood_type,
                isVerified: user.is_verified === 1
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============ DONOR ROUTES ============

app.get('/api/donor/profile/:id', (req, res) => {
    const { id } = req.params;
    db.get(
        `SELECT id, name, email, blood_type, phone, address, is_verified, is_available FROM users WHERE id = ?`,
        [id],
        (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        }
    );
});

app.put('/api/donor/availability/:id', (req, res) => {
    const { id } = req.params;
    const { isAvailable } = req.body;
    db.run(`UPDATE users SET is_available = ? WHERE id = ?`, [isAvailable ? 1 : 0, id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

app.get('/api/donor/history/:id', (req, res) => {
    const { id } = req.params;
    db.all(`SELECT * FROM donation_records WHERE donor_id = ? ORDER BY donation_date DESC`, [id], (err, records) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(records || []);
    });
});

// ============ ADMIN ROUTES ============

app.get('/api/admin/pending-donors', (req, res) => {
    db.all(`SELECT id, name, email, blood_type, phone, created_at FROM users WHERE role = 'donor' AND is_verified = 0`, [], (err, donors) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(donors || []);
    });
});

app.get('/api/admin/all-donors', (req, res) => {
    db.all(`SELECT id, name, email, blood_type, phone, is_verified, is_available FROM users WHERE role = 'donor'`, [], (err, donors) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(donors || []);
    });
});

app.get('/api/admin/all-staff', (req, res) => {
    db.all(`SELECT id, name, email, phone, role, created_at FROM users WHERE role = 'staff'`, [], (err, staff) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(staff || []);
    });
});

app.put('/api/admin/verify-donor/:id', (req, res) => {
    const { id } = req.params;
    db.run(`UPDATE users SET is_verified = 1 WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

app.post('/api/admin/create-staff', async (req, res) => {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (name, email, password, blood_type, phone, role, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, 'O+', phone || '', 'staff', 1],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true, id: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/admin/inventory', (req, res) => {
    db.all(`SELECT * FROM blood_inventory ORDER BY blood_type`, [], (err, inventory) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(inventory || []);
    });
});

app.put('/api/admin/inventory/:bloodType', (req, res) => {
    const { bloodType } = req.params;
    const { units } = req.body;
    db.run(`UPDATE blood_inventory SET units = ?, last_updated = CURRENT_TIMESTAMP WHERE blood_type = ?`, [units, bloodType], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

app.get('/api/admin/all-requests', (req, res) => {
    db.all(`SELECT * FROM blood_requests ORDER BY requested_at DESC`, [], (err, requests) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(requests || []);
    });
});

app.put('/api/admin/approve-request/:id', (req, res) => {
    const { id } = req.params;
    const { approvedBy } = req.body;
    db.run(`UPDATE blood_requests SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?`, [approvedBy, id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

app.get('/api/admin/stats', (req, res) => {
    const stats = {};
    db.get(`SELECT COUNT(*) as count FROM users WHERE role = 'donor'`, [], (err, row) => {
        stats.totalDonors = row ? row.count : 0;
        db.get(`SELECT COUNT(*) as count FROM users WHERE role = 'donor' AND is_verified = 0`, [], (err, row) => {
            stats.pendingDonors = row ? row.count : 0;
            db.get(`SELECT COUNT(*) as count FROM blood_requests WHERE status = 'pending'`, [], (err, row) => {
                stats.pendingRequests = row ? row.count : 0;
                db.get(`SELECT SUM(units) as total FROM blood_inventory`, [], (err, row) => {
                    stats.totalBloodUnits = row ? row.total : 0;
                    res.json(stats);
                });
            });
        });
    });
});

// ============ STAFF ROUTES ============

app.get('/api/staff/my-requests/:staffId', (req, res) => {
    const { staffId } = req.params;
    db.all(`SELECT * FROM blood_requests WHERE requested_by = ? ORDER BY requested_at DESC`, [staffId], (err, requests) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(requests || []);
    });
});

app.post('/api/staff/create-request', (req, res) => {
    const { patientName, patientAge, bloodType, unitsRequired, urgencyLevel, requestedBy } = req.body;
    
    if (!patientName || !bloodType || !unitsRequired) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        `INSERT INTO blood_requests (patient_name, patient_age, blood_type, units_required, urgency_level, requested_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [patientName, patientAge || null, bloodType, unitsRequired, urgencyLevel || 'normal', requestedBy],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.get('/api/staff/inventory', (req, res) => {
    db.all(`SELECT * FROM blood_inventory ORDER BY blood_type`, [], (err, inventory) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(inventory || []);
    });
});

app.get('/api/staff/search-donors', (req, res) => {
    const { bloodType } = req.query;
    db.all(
        `SELECT id, name, blood_type, phone, is_available FROM users WHERE role = 'donor' AND is_verified = 1 AND blood_type = ? AND is_available = 1`,
        [bloodType],
        (err, donors) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(donors || []);
        }
    );
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'BloodLink API running' });
});

// Initialize default inventory and admin
const initDatabase = async () => {
    // Check if inventory exists
    db.get("SELECT COUNT(*) as count FROM blood_inventory", (err, row) => {
        if (row && row.count === 0) {
            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
            const stmt = db.prepare("INSERT INTO blood_inventory (blood_type, units) VALUES (?, 10)");
            bloodTypes.forEach(type => stmt.run(type));
            stmt.finalize();
            console.log('Default inventory added');
        }
    });
    
    // Create admin if not exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.run(
        `INSERT OR IGNORE INTO users (name, email, password, blood_type, role, is_verified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['Admin User', 'admin@bloodlink.com', hashedPassword, 'O+', 'admin', 1]
    );
};

// Start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`BloodLink Server running on http://localhost:${PORT}`);
    });
});