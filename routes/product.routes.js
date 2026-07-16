import express from 'express';
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from '../controller/product.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post('/add', protect, authorize("owner","admin","manager"), addProduct);
router.get('/', protect, authorize("owner","admin","manager","sales-attendant"), getAllProducts);
router.get('/:productId', protect, authorize("owner","admin","manager","sales-attendant"), getProductById);
router.patch('/:productId', protect, authorize("owner","admin","manager"), updateProduct);
router.delete('/:id', protect, authorize("owner","admin","manager"), deleteProduct);

export default router;