const db = require('../database');

const AuthModel = {
    getSettings: (callback) => {
        db.get(`SELECT * FROM settings LIMIT 1`, [], callback);
    },
    activateSystem: (licenseKey, callback) => {
        // License key verify hone ke baad system ko active kar dena
        db.run(`UPDATE settings SET license_key = ?, is_activated = 1`, [licenseKey], callback);
    },
    findByUsername: (username, callback) => {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
    }
};

module.exports = AuthModel;