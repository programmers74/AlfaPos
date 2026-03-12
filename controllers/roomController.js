const RoomModel = require('../models/roomModel');

// Rooms Logic
exports.addRoom = (req, res) => {
    RoomModel.createRoom(req.body, (err) => {
        if (err) return res.status(500).json({ error: "Room No must be unique" });
        res.json({ message: "Room Added to Inventory!" });
    });
};

exports.getRooms = (req, res) => {
    RoomModel.getAllRooms((err, rows) => res.json(rows));
};

exports.patchStatus = (req, res) => {
    RoomModel.updateRoomStatus(req.params.id, req.body.status, (err) => {
        res.json({ message: "Room status updated to " + req.body.status });
    });
};

exports.updateRoom = (req, res) => {
    RoomModel.updateRoom(req.params.id, req.body, (err) => res.json({ message: "Room details updated" }));
};

exports.deleteRoom = (req, res) => {
    RoomModel.deleteRoom(req.params.id, (err) => res.json({ message: "Room Deleted" }));
};