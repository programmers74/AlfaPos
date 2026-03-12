const db = require('../database');

const RoomTypeModel = {
    // --- Room Types (Categories) ---
    createType: (data, callback) => {
        const query = `INSERT INTO room_types (type_name, description, base_price) VALUES (?, ?, ?)`;
        db.run(query, [data.type_name, data.description, data.base_price], callback);
    },
    getAllTypes: (callback) => {
        db.all(`SELECT * FROM room_types`, [], callback);
    },
    updateType: (id, data, callback) => {
        const query = `UPDATE room_types SET type_name = ?, description = ?, base_price = ? WHERE id = ?`;
        db.run(query, [data.type_name, data.description, data.base_price, id], callback);
    },
    deleteType: (id, callback) => {
        db.run(`DELETE FROM room_types WHERE id = ?`, [id], callback);
    }
};

module.exports = RoomTypeModel;