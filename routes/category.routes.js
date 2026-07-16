import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controller/category.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post('/category', protect, authorize("owner","admin","manager"), addCategory);
router.get('/categories', protect, authorize("owner","admin","manager","sales-attendant"), getAllCategories);
router.patch('/:categoryId/category', protect, authorize("owner","admin","manager"), updateCategory);
router.delete('/:categoryId/category', protect, authorize("owner","admin","manager"), deleteCategory);

export default router;