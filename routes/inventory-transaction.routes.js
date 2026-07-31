import express from 'express';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';
import { addStockIn, adjustInventory, getInventoryLog } from '../controller/inventory-transaction.controller.js'; 

const router = express.Router();

/**
 * @swagger
 * /stock-in:
 *   post:
 *     summary: Record stock-in
 *     description: Records a stock-in transaction and increases the quantity of a product.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Stock added successfully
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
router.post('/stock-in', protect, authorize("owner","admin","manager"), addStockIn);

/**
 * @swagger
 * /adjustment:
 *   post:
 *     summary: Adjust inventory
 *     description: Performs a manual inventory adjustment for a product.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Inventory adjusted successfully
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
router.post('/adjustment', protect, authorize("owner","admin","manager"), adjustInventory);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get inventory transactions
 *     description: Retrieves all inventory transactions for the authenticated business.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory transactions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/transactions', protect, authorize("owner","admin","manager", "sales-attendant"), getInventoryLog);

export default router;