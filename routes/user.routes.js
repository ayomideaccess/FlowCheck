import express from 'express';
import { addStaff, getAllUsers, updateUserById, deleteUser } from '../controller/user.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { userQuerySchema } from '../validators/query.validator.js';

const router = express.Router();

/**
 * @swagger
 * /{businessId}/users:
 *   post:
 *     summary: Add a staff member
 *     description: Creates a new staff account (Admin, Manager, or Sales Attendant). Only the business owner and admin can perform this action.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - role
 *             properties:
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
 *               role:
 *                 type: string
 *                 enum: [admin, manager, salesAttendant]
 *                 example: manager
 *     responses:
 *       201:
 *         description: Staff added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/:businessId/users', protect, authorize("owner","admin"), addStaff);

 /**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [admin, manager, sales-attendant]
 *         description: Filter users by role
 *
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter users by active status
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search users by first name, last name, or email
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, role]
 *         description: Field to sort users by
 *
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users', protect, authorize("owner","admin"), validate(userQuerySchema, "query"), getAllUsers);

/**
 * @swagger
 * /{businessId}/{userId}/user:
 *   patch:
 *     summary: Update a staff member
 *     description: Updates a staff member's information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:businessId/:userId/user', protect, authorize("owner","admin"), updateUserById);

/**
 * @swagger
 * /{businessId}/{userId}/user:
 *   delete:
 *     summary: Delete a staff member
 *     description: Deletes a staff member from the business.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:businessId/:userId/user', protect, authorize("owner","admin"), deleteUser);

export default router;