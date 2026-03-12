/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Physical Room Inventory Management
 */

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { checkActivation } = require('../controllers/authController');

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Add a new room to inventory
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_no:
 *                 type: string
 *                 example: "101"
 *               type_id:
 *                 type: integer
 *                 example: 1
 *               floor:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: "available"
 *     responses:
 *       200:
 *         description: Room added successfully
 *   get:
 *     summary: Get all rooms with their categories
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all rooms
 */
router.post('/', checkActivation, roomController.addRoom);
router.get('/', checkActivation, roomController.getRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update room details
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_no:
 *                 type: string
 *               type_id:
 *                 type: integer
 *               floor:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated successfully
 *   delete:
 *     summary: Remove a room from inventory
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
router.put('/:id', checkActivation, roomController.updateRoom);
router.delete('/:id', checkActivation, roomController.deleteRoom);

/**
 * @swagger
 * /api/rooms/{id}/status:
 *   patch:
 *     summary: Update only the room status (Quick status change)
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "dirty"
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch('/:id/status', checkActivation, roomController.patchStatus);

module.exports = router;