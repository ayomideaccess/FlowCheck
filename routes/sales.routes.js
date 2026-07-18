import express from 'express';
import { createSale, getAllSales, getSaleById } from '../controller/sales.controller.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, createSale);
router.get('/', protect, getAllSales);
router.get('/:saleId', protect, getSaleById);

export default router;