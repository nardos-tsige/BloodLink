const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'bloodlink.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
    // Users table
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

    // Blood requests table
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
            FOREIGN KEY (requested_by) REFERENCES users(id),
            FOREIGN KEY (approved_by) REFERENCES users(id)
        )
    `);

    // Blood inventory table
    db.run(`
        CREATE TABLE IF NOT EXISTS blood_inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blood_type TEXT UNIQUE NOT NULL,
            units INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Donation records table
    db.run(`
        CREATE TABLE IF NOT EXISTS donation_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_id INTEGER,
            request_id INTEGER,
            blood_type TEXT,
            units INTEGER,
            donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (donor_id) REFERENCES users(id),
            FOREIGN KEY (request_id) REFERENCES blood_requests(id)
        )
    `);

    // Notifications table
    db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            message TEXT,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    console.log('✅ Database tables created/verified');

    // Insert default blood inventory if empty
    db.get("SELECT COUNT(*) as count FROM blood_inventory", (err, row) => {
        if (row.count === 0) {
            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
            const stmt = db.prepare("INSERT INTO blood_inventory (blood_type, units) VALUES (?, 10)");
            bloodTypes.forEach(type => stmt.run(type));
            stmt.finalize();
            console.log('✅ Default blood inventory added');
        }
    });

    // Create admin user if not exists
    const createAdmin = async () => {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
            `INSERT OR IGNORE INTO users (name, email, password, blood_type, role, is_verified)
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['Admin User', 'admin@bloodlink.com', hashedPassword, 'O+', 'admin', 1]
        );
    };
    createAdmin();
});

module.exports = db;