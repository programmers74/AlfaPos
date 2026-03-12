const RoomTypeModel = require('../models/roomtypeModel');

// Categories Logic
exports.addType = (req, res) => {
    RoomTypeModel.createType(req.body, (err) => {
        if (err) return res.status(500).json({ error: "Category already exists or DB Error" });
        res.json({ message: "Room Category Added!" });
    });
};

exports.getTypes = (req, res) => {
    RoomTypeModel.getAllTypes((err, rows) => res.json(rows));
};

exports.updateType = (req, res) => {
    RoomTypeModel.updateType(req.params.id, req.body, (err) => res.json({ message: "Type Updated" }));
};

exports.deleteType = (req, res) => {
    RoomTypeModel.deleteType(req.params.id, (err) => res.json({ message: "Type Deleted" }));
};
