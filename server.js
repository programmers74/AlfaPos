const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { getMachineHash } = require('./security');
const db = require('./database');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const roomtypeRoutes = require('./routes/roomtypeRoutes');
const reservations = require('./routes/reservationRoutes');

// const roomRoutes = require('./routes/roomRoutes'); // Baad mein jab file ban jaye tab uncomment karein

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ---------------------------------------------------------
// 1. Hardware Security Check (Startup)
// ---------------------------------------------------------
async function initializeSecurity() {
    try {
        const currentHash = await getMachineHash();
        console.log("-----------------------------------------");
        console.log("PC Hardware Fingerprint:", currentHash);
        
        // Database se saved HWID check karein
        db.get("SELECT hwid_hash, is_activated FROM settings LIMIT 1", [], (err, row) => {
    if (err) {
        console.error("Security Check Error:", err.message);
    } else if (!row || row.is_activated === 0) {
        // Agar software activate hi nahi hua, toh hardware mismatch ka alert dena logical nahi
        console.log("ℹ️ SYSTEM STATUS: Software is not yet activated.");
        console.log("Please use Swagger to activate with your HWID.");
    } else if (row.hwid_hash !== currentHash) {
        // Agar activate ho chuka hai LEKIN hardware badal gaya hai, TAB alert dein
        console.log("⚠️ SECURITY ALERT: Unauthorized Hardware Detected!");
        console.log("This license belongs to another PC.");
    } else {
        console.log("✅ Hardware Verified Successfully.");
    }
});
    } catch (error) {
        console.error("Failed to initialize security:", error);
    }
}

initializeSecurity();

// ---------------------------------------------------------
// 2. Swagger Documentation Setup
// ---------------------------------------------------------
// Is URL par sari API docs nazar ayengi: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------------------------------------------------------
// 3. API Routes
// ---------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);       
app.use('/api/room-types', roomtypeRoutes);
app.use('/api/reservations', reservations);
// Default Route
app.get('/', (req, res) => {
    res.send('Hotel Management System Backend is Running. Go to /api-docs for API Documentation.');
});

// ---------------------------------------------------------
// 4. Error Handling Middleware (Juniors k liye achi practice)
// ---------------------------------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`📡 Local Network Access: Connect mobile apps via PC's IP at port ${PORT}`);
});