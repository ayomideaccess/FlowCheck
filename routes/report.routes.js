import express from 'express';
import { getLowStock, getStockValuation, getSalesSummary } from '../controller/report.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /low-stock:
 *   get:
 *     summary: Get low-stock products
 *     description: Retrieves all products that have reached or fallen below their minimum stock level.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low-stock products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/low-stock', protect, authorize("owner","admin","manager"), getLowStock);

/**
 * @swagger
 * /stock-valuation:
 *   get:
 *     summary: Get inventory valuation
 *     description: Calculates and returns the total value of the current inventory.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock valuation retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/stock-valuation', protect, authorize("owner","admin","manager"), getStockValuation);

/**
 * @swagger
 * /sales-summary:
 *   get:
 *     summary: Get sales summary
 *     description: Retrieves a summary of sales, including revenue and other sales statistics for the authenticated business.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/sales-summary', protect, authorize("owner","admin"), getSalesSummary);

export default router;