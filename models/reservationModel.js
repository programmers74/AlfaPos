const db = require('../database');

const ReservationModel = {
    // 1. Check-in Logic
    checkIn: (data, callback) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            const query = `INSERT INTO reservations (
                primary_guest_name, primary_guest_cnic, guest_contact, 
                other_guests_info, room_id, check_in, status, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, 'active', 'pending')`;

            db.run(query, [
                data.primary_guest_name, data.primary_guest_cnic, data.guest_contact,
                JSON.stringify(data.other_guests_info), data.room_id, data.check_in
            ], function(err) {
                if (err) {
                    db.run("ROLLBACK");
                    return callback(err);
                }

                // Room status ko occupied kar dena
                db.run("UPDATE rooms SET status = 'occupied' WHERE id = ?", [data.room_id], (updateErr) => {
                    if (updateErr) {
                        db.run("ROLLBACK");
                        return callback(updateErr);
                    }
                    db.run("COMMIT");
                    callback(null, { id: this.lastID });
                });
            });
        });
    },

    // 2. Active Guests List (JOIN with Rooms)
    getActiveReservations: (callback) => {
        const query = `
            SELECT r.*, rm.room_no, rt.type_name, rt.base_price 
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            JOIN room_types rt ON rm.type_id = rt.id
            WHERE r.status = 'active'`;
        db.all(query, [], callback);
    },

    // 3. Available Rooms for Booking
    getAvailableRooms: (callback) => {
        const query = `
            SELECT r.*, rt.type_name, rt.base_price 
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.id
            WHERE r.status = 'available' OR r.status = 'clean'`;
        db.all(query, [], callback);
    }
};

module.exports = ReservationModel;