/**
 * @swagger
 * tags:
 *   name: RoomTypes
 *   description: Management of room categories and their base pricing
 */

const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomtypeController');
const { checkActivation } = require('../controllers/authController');

/**
 * @swagger
 * /api/room-types/types:
 *   post:
 *     summary: Create a new room category
 *     tags: [RoomTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *                 example: "Executive Suite"
 *               description:
 *                 type: string
 *                 example: "King size bed, mini bar, and city view"
 *               base_price:
 *                 type: number
 *                 example: 7500
 *     responses:
 *       200:
 *         description: Room type created successfully
 *       400:
 *         description: Invalid request data
 *   get:
 *     summary: Get all room categories
 *     tags: [RoomTypes]
 *     responses:
 *       200:
 *         description: List of all room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type_name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   base_price:
 *                     type: number
 */
router.post('/types', checkActivation, roomTypeController.addType);
router.get('/types', checkActivation, roomTypeController.getTypes);

/**
 * @swagger
 * /api/room-types/types/{id}:
 *   put:
 *     summary: Update a room category
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the room type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *               base_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *       400:
 *         description: Invalid data or missing fields
 *       404:
 *         description: Room type not found
 *   delete:
 *     summary: Delete a room category
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the room type to delete
 *     responses:
 *       200:
 *         description: Room type deleted successfully
 *       404:
 *         description: Room type not found
 */
router.put('/types/:id', checkActivation, roomTypeController.updateType);
router.delete('/types/:id', checkActivation, roomTypeController.deleteType);

module.exports = router;