import express from 'express';
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from '../controller/product.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Add a new product
 *     description: Creates a new product and adds it to the authenticated business.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Product already exists
 *       500:
 *         description: Internal server error
 */
router.post('/product', protect, authorize("owner","admin","manager"), addProduct);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all products
 *     description: Retrieves all products belonging to the authenticated business.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, authorize("owner","admin","manager","sales-attendant"), getAllProducts);

/**
 * @swagger
 * /{productId}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieves a single product by its ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:productId', protect, authorize("owner","admin","manager","sales-attendant"), getProductById);

/**
 * @swagger
 * /{productId}:
 *   patch:
 *     summary: Update a product
 *     description: Updates an existing product.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:productId', protect, authorize("owner","admin","manager"), updateProduct);

/**
 * @swagger
 * /{productId}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product from the authenticated business.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:productId', protect, authorize("owner","admin","manager"), deleteProduct);

export default router;