const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hotel_management.db');

db.serialize(() => {
    // 0. Settings & Security (ISAY MAINE ADD KAR DIYA HAI)
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hwid_hash TEXT UNIQUE,
        license_key TEXT,
        is_activated INTEGER DEFAULT 0,
        hotel_name TEXT DEFAULT 'My Hotel',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    // 1. Room Types (Categorization)
    db.run(`CREATE TABLE IF NOT EXISTS room_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_name TEXT UNIQUE, -- standard, deluxe, suite
        description TEXT,
        base_price REAL
    )`);

    // 2. Rooms (Physical Property)
    db.run(`CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_no TEXT UNIQUE,
        type_id INTEGER,
        floor INTEGER,
        status TEXT DEFAULT 'available', -- available, occupied, reserved, maintenance, dirty
        last_cleaned_date DATETIME,
        FOREIGN KEY(type_id) REFERENCES room_types(id)
    )`);

    // 3. Users (Staff Management)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT, -- admin, receptionist, housekeeping
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 4. Menu (Restaurant Items)
    db.run(`CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        description TEXT,
        category TEXT,
        price REAL,
        available BOOLEAN DEFAULT 1
    )`);

    // 5. Reservations (Main Stay Logic)
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        primary_guest_name TEXT,
        primary_guest_cnic TEXT,
        guest_contact TEXT,
        other_guests_info TEXT, -- JSON format
        room_id INTEGER,
        check_in DATETIME,
        check_out DATETIME,
        special_requests TEXT,
        total_bill REAL DEFAULT 0,
        payment_status TEXT DEFAULT 'pending', -- paid, partially paid, pending
        status TEXT DEFAULT 'active', -- active, completed, cancelled, reserved
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(room_id) REFERENCES rooms(id)
    )`);

    // 6. Transactions (Finance Tracking)
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        res_id INTEGER,
        amount REAL,
        payment_method TEXT, -- Cash, Card, Online
        type TEXT, -- Advance, Mid-Stay, Final
        transaction_status TEXT DEFAULT 'completed', -- completed, failed, pending
        transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(res_id) REFERENCES reservations(id)
    )`);

    // 7. Room Services (Service Tracking)
    db.run(`CREATE TABLE IF NOT EXISTS room_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        res_id INTEGER,
        item_id INTEGER,
        description TEXT,
        qty INTEGER DEFAULT 1,
        price REAL, -- Price at the time of order
        status TEXT DEFAULT 'ordered', -- ordered, in-progress, completed, cancelled
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(res_id) REFERENCES reservations(id),
        FOREIGN KEY(item_id) REFERENCES menu(id)
    )`);

    // 8. Inventory & Stock
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        category TEXT,
        total_stock REAL DEFAULT 0,
        purchase_price REAL,
        supplier_info TEXT,
        unit TEXT, -- kg, ltr, pcs
        min_limit REAL DEFAULT 5
    )`);

    // 9. Inventory Logs (Audit Trail)
    db.run(`CREATE TABLE IF NOT EXISTS inventory_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER,
        qty REAL,
        action TEXT, -- ADDED, ISSUED, RETURNED
        received_by TEXT, -- Staff name or Department
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(item_id) REFERENCES inventory(id)
    )`);

    console.log("Elite Database Schema with all loopholes fixed is now ready.");
});

module.exports = db;