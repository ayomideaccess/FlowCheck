import express from 'express';
import { addSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier } from '../controller/supplier.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post('/', protect, authorize("owner", "admin", "manager"), addSupplier);
router.get('/', protect, authorize("owner", "admin", "manager", "sales-attendant"),getAllSuppliers);
router.patch('/:supplierId',protect, authorize("owner", "admin", "manager"), updateSupplier);
router.delete('/:supplierId',protect, authorize("owner", "admin", "manager"), deleteSupplier);

export default router;