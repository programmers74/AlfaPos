const UserModel = require('../models/userModel');

exports.addUser = (req, res) => {
    UserModel.create(req.body, (err) => {
        if (err) return res.status(500).json({ error: "Username already exists or DB error" });
        res.json({ message: "User created successfully with encrypted password!" });
    });
};

exports.getUsers = (req, res) => {
    UserModel.getAll((err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(users);
    });
};

exports.getUser = (req, res) => {
    UserModel.getById(req.params.id, (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    });
};

exports.updateUser = (req, res) => {
    UserModel.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: "Update failed" });
        res.json({ message: "User updated successfully" });
    });
};

exports.deleteUser = (req, res) => {
    UserModel.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.json({ message: "User deleted" });
    });
};


exports.forgetPassword = (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;

    // 1. Basic Validation
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match!" });
    }

    // 2. Database Update
    UserModel.resetPassword(username, newPassword, (err) => {
        if (err) return res.status(500).json({ error: "Update failed" });
        
        // Agar koi row update nahi hui (username galat tha)
        // Note: SQLite row count check karna behtar hai
        res.json({ message: "Password has been reset successfully. Please login with your new password." });
    });
};