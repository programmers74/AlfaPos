const db = require('../database');
const AuthModel = require('../models/authModel');
const { getMachineHash } = require('../security');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const SECRET_SALT = "SAIF_SOFTWARE_HOUSE_SECRET_2026"; // Must match your keygen

// exports.login = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const currentHWID = await getMachineHash();

//         AuthModel.getSettings((err, settings) => {
//             // Agar hardware match nahi karta (Dummy data mein HWID insert karni hogi)
//             if (settings && settings.hwid_hash !== currentHash) {
//                 // Abhi bypass karne k liye sirf warning de rahe hain
//                 console.log("HWID Mismatch detected.");
//             }

//             AuthModel.findByUsername(username, (err, user) => {
//                 if (err || !user) return res.status(401).json({ error: "User not found" });
                
//                 if (user.password !== password) {
//                     return res.status(401).json({ error: "Invalid password" });
//                 }

//                 res.json({
//                     message: "Login successful",
//                     user: { id: user.id, username: user.username, role: user.role }
//                 });
//             });
//         });
//     } catch (e) {
//         res.status(500).json({ error: "Auth Error" });
//     }
// };



exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check karein ke user database mein hai ya nahi
        AuthModel.findByUsername(username, async (err, user) => {
            if (err) return res.status(500).json({ error: "Database Error" });
            
            if (!user) {
                return res.status(401).json({ error: "Invalid Username or Password" });
            }

            // 2. Password Match karein (Plain password vs Hashed password)
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Password sahi hai
                res.json({
                    success: true,
                    message: "Login Successful",
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                });
            } else {
                // Password galat hai
                res.status(401).json({ error: "Invalid Username or Password" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Login process failed" });
    }
};

exports.activate = async (req, res) => {
    const { activation_key } = req.body;
    
    try {
        // 1. Current PC ka HWID dobara nikalain
        const currentHWID = await getMachineHash();

        // 2. Verify karein ke key sahi hai ya nahi
        const expectedKey = crypto.createHmac('sha256', SECRET_SALT)
                                 .update(currentHWID)
                                 .digest('hex');

        if (activation_key === expectedKey) {
            // 3. Database mein is_activated, license_key AUR hwid_hash teeno save karein
            const query = `
                UPDATE settings 
                SET is_activated = 1, 
                    license_key = ?, 
                    hwid_hash = ? 
                WHERE id = 1
            `;

            db.run(query, [activation_key, currentHWID], (err) => {
                if (err) return res.status(500).json({ error: "Database Update Failed" });
                
                res.json({ 
                    success: true, 
                    message: "Software Activated Successfully! HWID Bound to this PC." 
                });
            });
        } else {
            res.status(400).json({ error: "Invalid Activation Key for this Hardware." });
        }
    } catch (error) {
        res.status(500).json({ error: "Security Check Failed during activation" });
    }
};
// exports.activate = async (req, res) => {
//     const { activation_key } = req.body;
//     const currentHWID = await getMachineHash();

//     // Verify: Kya ye key isi PC ke liye bani hai?
//     const expectedKey = crypto.createHmac('sha256', SECRET_SALT)
//                              .update(currentHWID)
//                              .digest('hex');

//     if (activation_key === expectedKey) {
//         // Database update karein
//         db.run(`UPDATE settings SET license_key = ?, is_activated = 1`, 
//         [activation_key], (err) => {
//             if (err) return res.status(500).json({ error: "Database Error" });
            
//             res.json({ 
//                 success: true, 
//                 message: "Software Activated Successfully! Restarting services..." 
//             });
//         });
//     } else {
//         res.status(400).json({ 
//             success: false, 
//             error: "Invalid Activation Key for this hardware." 
//         });
//     }
// };


exports.checkActivation = async (req, res, next) => {
    try {
        const currentHWID = await getMachineHash();

        AuthModel.getSettings((err, settings) => {
            if (err) return res.status(500).json({ error: "Database Error" });

            // Agar settings table khali hai ya activated nahi hai
            if (!settings || settings.is_activated === 0) {
                return res.status(402).json({ 
                    error: "Product Not Activated", 
                    your_hwid: currentHWID,
                    message: "Please send this HWID to Saif Software House to get your Activation Key."
                });
            }

            // License key verification (HWID match check)
            const expectedKey = crypto.createHmac('sha256', SECRET_SALT)
                                     .update(currentHWID)
                                     .digest('hex');

            if (settings.license_key !== expectedKey) {
                return res.status(403).json({ error: "License Mismatch! Hardware changed or Pirated copy." });
            }

            // Agar sab sahi hai
            if (next) {
                next(); // Agar as a middleware use ho raha ho
            } else {
                res.json({ status: "Active", hotel_name: settings.hotel_name });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Security Initialization Failed" });
    }
};