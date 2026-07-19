import express from 'express';
import { getLowStock, getStockValuation, getSalesSummary } from '../controller/report.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/low-stock', protect, authorize("owner","admin","manager"), getLowStock);
router.get('/stock-valuation', protect, authorize("owner","admin","manager"), getStockValuation);
router.get('/sales-summary', protect, authorize("owner","admin"), getSalesSummary);

export default router;