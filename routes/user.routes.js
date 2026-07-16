import express from 'express';
import { addStaff, getAllUsers, updateUserById, deleteUser } from '../controller/user.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post('/:businessId/users', protect, authorize("owner","admin"), addStaff);
router.get('/:businessId/users', protect, authorize("owner","admin"), getAllUsers);
router.patch('/:businessId/:userId/user', protect, authorize("owner","admin"), updateUserById);
router.delete('/:businessId/:userId/user', protect, authorize("owner","admin"), deleteUser);

export default router;