import express from 'express';
import { createSale, getAllSales, getSaleById } from '../controller/sales.controller.js';
import { protect } from '../middleware/protect.js';

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
 *     description: Retrieves all sales transactions for the authenticated business.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, getAllSales);

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