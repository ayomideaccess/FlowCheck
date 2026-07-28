import express from 'express';

const router = express.Router();

// Importing authentication controller functions
import { registerBusinessOwner, verifyOTP, loginUser, logoutUser, forgottenPassword, resetPassword } from '../controller/auth.controller.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new business and its owner
 *     description: Registers a new business and its owner and sends an OTP to the owner's email for account verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - businessName
 *               - businessAddress 
 *               - businessPhoneNo 
 *               - businessEmail 
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNo
 *               - password
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: FlowCheck Ltd
 *               businessAddress:
 *                 type: string
 *                 example: Airport
 *               businessPhoneNo:
 *                 type: string
 *                 example: 08012345678
 *               businessEmail:
 *                 type: string
 *                 format: email
 *                 example: flowcheck@example.com
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phoneNo:
 *                 type: string
 *                 example: "08012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Owner registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerBusinessOwner);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgotpassword', forgottenPassword);
router.post('/reset', resetPassword);

export default router;