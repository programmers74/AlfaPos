/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Front Desk - Check-in and Guest Management
 */

const express = require('express');
const router = express.Router();
const resController = require('../controllers/reservationController');
const { checkActivation } = require('../controllers/authController');

/**
 * @swagger
 * /api/reservations/check-in:
 *   post:
 *     summary: Check-in a new guest
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primary_guest_name:
 *                 type: string
 *                 example: "Saif Ali"
 *               primary_guest_cnic:
 *                 type: string
 *                 example: "42101-xxxxxxx-x"
 *               guest_contact:
 *                 type: string
 *                 example: "03001234567"
 *               room_id:
 *                 type: integer
 *                 example: 1
 *               other_guests_info:
 *                 type: object
 *                 example: { count: 1, names: "Arslan" }
 *     responses:
 *       200:
 *         description: Check-in successful
 *       400:
 *         description: Invalid input or missing fields
 *       404:
 *         description: Room not found
 */
router.post('/check-in', checkActivation, resController.processCheckIn);

/**
 * @swagger
 * /api/reservations/active:
 *   get:
 *     summary: List of currently staying guests
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of currently staying guests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   guest_name:
 *                     type: string
 *                   room_number:
 *                     type: string
 *                   check_in_date:
 *                     type: string
 *                     format: date-time
 *                   check_out_date:
 *                     type: string
 *                     format: date-time
 *                   guest_contact:
 *                     type: string
 *     responses:
 *       500:
 *         description: Server error while fetching active guests
 */
router.get('/active', checkActivation, resController.getActiveGuests);

/**
 * @swagger
 * /api/reservations/available-rooms:
 *   get:
 *     summary: Get list of rooms ready for booking
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of available rooms for booking
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room_id:
 *                     type: integer
 *                   room_number:
 *                     type: string
 *                   type:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   status:
 *                     type: string
 *                     example: "available"
 *     responses:
 *       500:
 *         description: Server error while fetching available rooms
 */
router.get('/available-rooms', checkActivation, resController.getAvailableRooms);

module.exports = router;