const db = require('../database');

const RoomModel = {
    // --- Physical Rooms ---
    createRoom: (data, callback) => {
        const query = `INSERT INTO rooms (room_no, type_id, floor, status) VALUES (?, ?, ?, ?)`;
        db.run(query, [data.room_no, data.type_id, data.floor, data.status || 'available'], callback);
    },
    getAllRooms: (callback) => {
        // SQL JOIN taake room ke saath uski category aur price bhi nazar aaye
        const query = `
            SELECT rooms.*, room_types.type_name, room_types.base_price 
            FROM rooms 
            JOIN room_types ON rooms.type_id = room_types.id`;
        db.all(query, [], callback);
    },
    updateRoomStatus: (id, status, callback) => {
        db.run(`UPDATE rooms SET status = ? WHERE id = ?`, [status, id], callback);
    },
    updateRoom: (id, data, callback) => {
        const query = `UPDATE rooms SET room_no = ?, type_id = ?, floor = ?, status = ? WHERE id = ?`;
        db.run(query, [data.room_no, data.type_id, data.floor, data.status, id], callback);
    },
    deleteRoom: (id, callback) => {
        db.run(`DELETE FROM rooms WHERE id = ?`, [id], callback);
    }
};

module.exports = RoomModel;