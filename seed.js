const db = require('./database');

db.serialize(() => {
    console.log("-----------------------------------------");
    console.log("🚀 Starting Smart Seeding (5+ Records Per Table)...");
    console.log("-----------------------------------------");

    // 0. Settings (Initial entry for Hardware Lock)
    db.run(`INSERT OR IGNORE INTO settings (id, is_activated, hotel_name) VALUES (1, 0, 'Saif Hotel Management')`);

    // 1. Room Types (Unique: type_name)
    const roomTypes = [
        ['Standard', 'Basic room with queen bed', 2500],
        ['Deluxe', 'Spacious room with king bed and balcony', 4500],
        ['Suite', 'Luxury suite with living area', 8000],
        ['Executive', 'Business class room with workspace', 6000],
        ['Single', 'Compact room for solo travelers', 1500]
    ];
    const stmtRT = db.prepare(`INSERT OR IGNORE INTO room_types (type_name, description, base_price) VALUES (?, ?, ?)`);
    roomTypes.forEach(rt => stmtRT.run(rt));
    stmtRT.finalize();

    // 2. Rooms (Unique: room_no)
    const rooms = [
        ['101', 1, 1, 'available'],
        ['102', 2, 1, 'occupied'],
        ['201', 3, 2, 'reserved'],
        ['202', 4, 2, 'maintenance'],
        ['301', 2, 3, 'dirty'],
        ['302', 5, 3, 'available'],
        ['401', 4, 4, 'available']
    ];
    const stmtR = db.prepare(`INSERT OR IGNORE INTO rooms (room_no, type_id, floor, status) VALUES (?, ?, ?, ?)`);
    rooms.forEach(r => stmtR.run(r));
    stmtR.finalize();

    // 3. Users (Unique: username)
    const users = [
        ['admin_saif', 'pass123', 'admin'],
        ['arslan_front', 'arslan456', 'receptionist'],
        ['ali_care', 'ali789', 'housekeeping'],
        ['manager_xyz', 'man000', 'admin'],
        ['staff_01', 'staff123', 'receptionist'],
        ['staff_02', 'staff456', 'housekeeping']
    ];
    const stmtU = db.prepare(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`);
    users.forEach(u => stmtU.run(u));
    stmtU.finalize();

    // 4. Menu Items (Unique: item_name)
    const menu = [
        ['Chicken Biryani', 'Spicy desi style', 'Main Course', 450, 1],
        ['Club Sandwich', 'Toasted with fries', 'Fast Food', 350, 1],
        ['Mineral Water', '1.5 Litre', 'Beverages', 120, 1],
        ['Mix Tea', 'Doodh patti special', 'Beverages', 80, 1],
        ['Daal Makhni', 'Butter special lentils', 'Main Course', 300, 0],
        ['Seekh Kabab', '4 pieces beef kabab', 'Platter', 600, 1]
    ];
    const stmtM = db.prepare(`INSERT OR IGNORE INTO menu (item_name, description, category, price, available) VALUES (?, ?, ?, ?, ?)`);
    menu.forEach(m => stmtM.run(m));
    stmtM.finalize();

    // 5. Inventory (Unique: item_name)
    const inventory = [
        ['Milk', 'Kitchen', 50, 180, 'Nestle', 'Litre', 5],
        ['Soap', 'Housekeeping', 100, 45, 'Lux', 'Pieces', 10],
        ['Basmati Rice', 'Kitchen', 25, 350, 'Guard', 'KG', 5],
        ['Towels', 'Housekeeping', 30, 800, 'Local Textile', 'Pieces', 5],
        ['Tea Bags', 'Kitchen', 200, 5, 'Lipton', 'Pieces', 20],
        ['Shampoo', 'Housekeeping', 50, 15, 'Sunsilk Sachet', 'Pieces', 10]
    ];
    const stmtInv = db.prepare(`INSERT OR IGNORE INTO inventory (item_name, category, total_stock, purchase_price, supplier_info, unit, min_limit) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    inventory.forEach(inv => stmtInv.run(inv));
    stmtInv.finalize();

    // 6. Reservations (Idempotency via CNIC Check)
    const reservations = [
        ['Ahmed Khan', '42101-1111111-1', '0300-1111111', '{"guests": 1}', 2, '2026-03-10 14:00', '2026-03-12 12:00', 'Wifi needed', 9000, 'partially paid', 'active'],
        ['Zeeshan Ali', '35201-2222222-2', '0321-2222222', '{"guests": 2}', 3, '2026-03-11 10:00', '2026-03-15 12:00', 'Early check-in', 32000, 'pending', 'reserved'],
        ['John Doe', 'Passport-123', '+1-555-000', '{"guests": 0}', 1, '2026-03-05 12:00', '2026-03-06 10:00', 'None', 2500, 'paid', 'completed'],
        ['Fatima Bibi', '54401-5555555-5', '0333-5555555', '{"guests": 1}', 4, '2026-03-11 09:00', '2026-03-12 12:00', 'Extra towels', 6000, 'pending', 'active'],
        ['Usman Pirzada', '33101-9999999-9', '0345-9999999', '{"guests": 3}', 5, '2026-03-12 14:00', '2026-03-14 12:00', 'No spicy food', 3000, 'pending', 'reserved']
    ];

    // Reservations ke liye hum check karte hain agar CNIC pehle se na ho (Simple check)
    db.get("SELECT COUNT(*) as count FROM reservations", (err, row) => {
        if (row.count === 0) {
            const stmtRes = db.prepare(`INSERT INTO reservations (primary_guest_name, primary_guest_cnic, guest_contact, other_guests_info, room_id, check_in, check_out, special_requests, total_bill, payment_status, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            reservations.forEach(res => stmtRes.run(res));
            stmtRes.finalize();
            console.log("Sample Reservations seeded.");
        }
    });

    console.log("-----------------------------------------");
    console.log("✅ Complete Seed Data Inserted Successfully!");
    console.log("-----------------------------------------");
});