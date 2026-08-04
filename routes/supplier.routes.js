import express from 'express';
import { addSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier } from '../controller/supplier.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Add a new supplier
 *     description: Creates a new supplier for the authenticated business.
 *     tags:
 *       - Suppliers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - contactPerson
 *               - phone
 *               - email
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Baby Care Supplies
 *               contactPerson:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 09065357753
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               address:
 *                 type: string
 *                 example: 123 Main St, City, Country
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Supplier already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', protect, authorize("owner", "admin", "manager"), addSupplier);


/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     description: Retrieves all suppliers belonging to the authenticated business.
 *     tags:
 *       - Suppliers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, authorize("owner", "admin", "manager", "sales-attendant"),getAllSuppliers);

/**
 * @swagger
 * /suppliers/{supplierId}:
 *   get:
 *     summary: Get supplier by ID
 *     description: Retrieves a supplier using its ID.
 *     tags:
 *       - Suppliers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */
router.get('/:supplierId', protect, authorize("owner", "admin", "manager", "sales-attendant"),getSupplierById);

/**
 * @swagger
 * /suppliers/{supplierId}:
 *   patch:
 *     summary: Update supplier
 *     description: Updates an existing supplier.
 *     tags:
 *       - Suppliers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:supplierId',protect, authorize("owner", "admin", "manager"), updateSupplier);

/**
 * @swagger
 * /suppliers/{supplierId}:
 *   delete:
 *     summary: Delete supplier
 *     description: Deletes a supplier from the authenticated business.
 *     tags:
 *       - Suppliers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:supplierId',protect, authorize("owner", "admin", "manager"), deleteSupplier);

export default router;