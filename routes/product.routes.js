import express from 'express';
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from '../controller/product.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';
import { productQuerySchema } from '../validators/query.validator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

/**
 * @swagger
 * /products/product:
 *   post:
 *     summary: Add a new product
 *     description: Creates a new product and adds it to the authenticated business.
 *     tags:
 *       - Products
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
 *               - description
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Diapers"
 *               description:
 *                 type: string
 *                 example: "Disposable diapers for babies"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               quantity:
 *                 type: number
 *                 example: 100
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
 * /products/:
 *   get:
 *     summary: Get all products
 *     description: Retrieves all products belonging to the authenticated business.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter products by category ID
 * 
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter products by active status
 * 
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Filter products by minimum price
 * 
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Filter products by maximum price
 * 
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name, unitPrice, costPrice, currentStock]
 *         description: Fields to sort products by
 * 
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 * 
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page Number
 * 
 *       - in: query
 *         name: limit
 *         required: false
 *         schema: 
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of products per page
 * 
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
router.get('/', protect, authorize("owner","admin","manager","sales-attendant"), validate(productQuerySchema, "query"), getAllProducts);

/**
 * @swagger
 * /products/{productId}:
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
 * /products/{productId}:
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
 * /products/{productId}:
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