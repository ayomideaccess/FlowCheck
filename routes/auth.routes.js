import express from 'express';

const router = express.Router();

// Importing authentication controller functions
import { registerBusinessOwner, verifyOTP, loginOwner, loginUser, logoutUser, forgottenPassword, resetPassword, resendOTP } from '../controller/auth.controller.js';

/**
 * @swagger
 * /auth/register:
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

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify owner's email address
 *     description: Verifies the OTP sent to the owner's email after registration.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post('/verify-otp', verifyOTP);

/**
 * @swagger
 * /auth/login-owner:
 *   post:
 *     summary: Login business owner
 *     description: Authenticates a business owner and returns an access token. Only users with the owner role can log in through this endpoint.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - email
 *               - password
 *             properties:
 *               businessId:
 *                 type: string
 *                 example: 688b6f4c2a7d4d5f0d123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: owner@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Account not verified or user is not an owner
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/login-owner', loginOwner);

/**
 * @swagger
 * /auth/login-user:
 *   post:
 *     summary: Login business staff
 *     description: Authenticates an admin, manager, or sales attendant. Password is not required for this endpoint.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - email
 *             properties:
 *               businessId:
 *                 type: string
 *                 example: 688b6f4c2a7d4d5f0d123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not have permission to log in through this endpoint
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/login-user', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs the authenticated user out.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Request password reset
 *     description: Sends an OTP to the user's email for password reset.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */
router.post('/forgotpassword', forgottenPassword);

/**
 * @swagger
 * /auth/reset:
 *   post:
 *     summary: Reset password
 *     description: Resets a user's password after OTP verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/reset', resetPassword);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     description: Generates and sends a new OTP to the user's registered email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - email
 *             properties:
 *               businessId:
 *                 type: string
 *                 example: 688b6f4c2a7d4d5f0d123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: owner@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/resend-otp', resendOTP);

export default router;