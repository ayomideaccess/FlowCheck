import express from 'express';
import { createSale, getAllSales, getSaleById } from '../controller/sales.controller.js';
import { protect } from '../middleware/protect.js';
import validate from '../middleware/validate.js';
import { salesQuerySchema } from '../validators/query.validator.js';

const router = express.Router();

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Record a sale
 *     description: Creates a new sales transaction and updates the product inventory accordingly.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "12345"
 *                     quantity:
 *                       type: number
 *                       example: 10
 *                     price:
 *                       type: number
 *                       example: 5000   
 *     responses:
 *       201:
 *         description: Sale recorded successfully
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
router.post('/', protect, createSale);

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: soldBy
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter sales by the staff member who made the sale
 *
 *       - in: query
 *         name: minAmount
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum sale amount
 *
 *       - in: query
 *         name: maxAmount
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum sale amount
 *
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering sales
 *
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering sales
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [createdAt, totalAmount]
 *         description: Field to sort sales by
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
 *         description: Number of sales per page
 *
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, validate(salesQuerySchema, "query"), getAllSales);

/**
 * @swagger
 * /sales/{saleId}:
 *   get:
 *     summary: Get sale by ID
 *     description: Retrieves the details of a specific sales transaction.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.get('/:saleId', protect, getSaleById);

export default router;