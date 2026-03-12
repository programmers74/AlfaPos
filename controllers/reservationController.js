const ReservationModel = require('../models/reservationModel');

exports.processCheckIn = (req, res) => {
    // Junior Tip: Check-in date agar frontend se nahi aa rahi toh current time lein
    const checkInData = {
        ...req.body,
        check_in: req.body.check_in || new Date().toISOString()
    };

    ReservationModel.checkIn(checkInData, (err, result) => {
        if (err) return res.status(500).json({ error: "Check-in failed. Room might be occupied." });
        res.json({ message: "Guest checked in successfully!", reservationId: result.id });
    });
};

exports.getActiveGuests = (req, res) => {
    ReservationModel.getActiveReservations((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.getAvailableRooms = (req, res) => {
    ReservationModel.getAvailableRooms((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};