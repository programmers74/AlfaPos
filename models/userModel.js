const db = require('../database');
const bcrypt = require('bcrypt');

const UserModel = {
    // 1. Create User (with Encryption)
    create: async (data, callback) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(data.password, salt);
        const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
        db.run(query, [data.username, hashedPass, data.role], callback);
    },

    // 2. Get All Users (Password hide karke)
    getAll: (callback) => {
        db.all(`SELECT id, username, role, created_at FROM users`, [], callback);
    },

    // 3. Get User By ID
    getById: (id, callback) => {
        db.get(`SELECT id, username, role, created_at FROM users WHERE id = ?`, [id], callback);
    },

    // 4. Update User
    update: async (id, data, callback) => {
        let query, params;
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(data.password, salt);
            query = `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`;
            params = [data.username, hashedPass, data.role, id];
        } else {
            query = `UPDATE users SET username = ?, role = ? WHERE id = ?`;
            params = [data.username, data.role, id];
        }
        db.run(query, params, callback);
    },

    // 5. Delete User
    delete: (id, callback) => {
        db.run(`DELETE FROM users WHERE id = ?`, [id], callback);
    },
    // 6. Forget User password 
    resetPassword: async (username, newPassword, callback) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(newPassword, salt);
            
            const query = `UPDATE users SET password = ? WHERE username = ?`;
            db.run(query, [hashedPass, username], callback);
        } catch (error) {
            callback(error);
        }
    }
};

module.exports = UserModel;