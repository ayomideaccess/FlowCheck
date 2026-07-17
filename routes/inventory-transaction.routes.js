import express from 'express';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';
import { addStockIn, adjustInventory, getInventoryLog } from '../controller/inventory-transaction.controller.js'; 

const router = express.Router();

router.post('/stock-in', protect, authorize("owner","admin","manager"), addStockIn);
router.post('/adjustment', protect, authorize("owner","admin","manager"), adjustInventory);
router.get('/transactions', protect, authorize("owner","admin","manager", "sales-attendant"), getInventoryLog);

export default router;