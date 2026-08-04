import express from 'express';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';
import { addStockIn, adjustInventory, getInventoryLog } from '../controller/inventory-transaction.controller.js'; 

const router = express.Router();

/**
 * @swagger
 * /transactions/stock-in:
 *   post:
 *     summary: Record stock-in
 *     description: Records a stock-in transaction and increases the quantity of a product.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - supplierId
 *               - quantity
 *               - unitCost
 *               - note
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a6ba60ab4acabc4fd39cd82
 *               supplierId:
 *                 type: string
 *                 example: 6a6ba60ab4acabc4fd39cd82
 *               quantity:
 *                 type: number
 *                 example: 100
 *               unitCost:
 *                 type: number
 *                 format: float
 *                 example: 10.50
 *               note:
 *                 type: string
 *                 example: Initial stock purchase
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
 * /transactions/adjustment:
 *   post:
 *     summary: Adjust inventory
 *     description: Performs a manual inventory adjustment for a product.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:  
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - supplierId
 *               - quantity
 *               - unitCost
 *               - note
 *               - adjustmentType
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a6ba60ab4acabc4fd39cd82
 *               supplierId:
 *                 type: string
 *                 example: 6a6ba60ab4acabc4fd39cd82
 *               quantity:
 *                 type: number
 *                 example: 100
 *               unitCost:
 *                 type: number
 *                 example: 10.50
 *               note:
 *                 type: string
 *                 example: diapers refunded
 *               adjustmentType:
 *                 type: string
 *                 example: "increase"
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
router.get('/', protect, authorize("owner","admin","manager", "sales-attendant"), getInventoryLog);

export default router;

// {
//   "productId": "6a6f9d45b5fe04e26ede9d28",
//   "supplierId": "6a6f955049470fe150dffd24",
//   "quantity": 100,
//   "unitCost": 10.5,
//   "note": "Initial stock purchase"
// }

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTZiYTYwY2I0YWNhYmM0ZmQzOWNkODMiLCJidXNpbmVzc0lkIjoiNmE2YmE2MGFiNGFjYWJjNGZkMzljZDgyIiwicm9sZSI6Im93bmVyIiwiaWF0IjoxNzg1NzcxNTc0LCJleHAiOjE3ODYzNzYzNzR9.3WAzge6wH1HMj94bpkMb5nJiGVEOobXBI3TPLlPhy4k