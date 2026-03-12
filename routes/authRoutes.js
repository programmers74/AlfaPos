/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check if software is activated
 *     tags: [Security]
 *     responses:
 *       200:
 *         description: Software is active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Active"
 */

/**
 * @swagger
 * /api/auth/activate:
 *   post:
 *     summary: Software ko activation key ke zariye unlock karein
 *     tags: [Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activation_key:
 *                 type: string
 *                 example: "c3ddeb9684d7d7dd75ccd48d00640897d75dd1a180d140e7e0afc75357f773a3"
 *     responses:
 *       200:
 *         description: Software activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Software activated successfully"
 *       400:
 *         description: Invalid activation key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid activation key"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful
 *       401:
 *         description: Unauthorized
 */



const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to check software activation status
router.get('/status', authController.checkActivation, (req, res) => {
    res.json({ status: "Active" });
});

// Route to activate the software with a license key
router.post('/activate', authController.activate);
router.post('/login',  authController.checkActivation, authController.login);
module.exports = router;