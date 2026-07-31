import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controller/category.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Add a new category
 *     description: Creates a new product category for the authenticated business.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 */
router.post('/category', protect, authorize("owner","admin","manager"), addCategory);


// router.post('/category', protect, authorize("owner","admin","manager"), addCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves all categories belonging to the authenticated business.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
// router.get('/categories', protect, authorize("owner","admin","manager","sales-attendant"), getAllCategories);
router.get('/categories', protect, authorize("owner","admin","manager","sales-attendant"), getAllCategories);

/**
 * @swagger
 * /{categoryId}/category:
 *   patch:
 *     summary: Update a category
 *     description: Updates an existing category.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
// router.patch('/:categoryId/category', protect, authorize("owner","admin","manager"), updateCategory);
router.patch('/:categoryId/category', protect, authorize("owner","admin","manager"), updateCategory);

/**
 * @swagger
 * /{categoryId}/category:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category from the authenticated business.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
// router.delete('/:categoryId/category', protect, authorize("owner","admin","manager"), deleteCategory);
router.delete('/:categoryId/category', protect, authorize("owner","admin","manager"), deleteCategory);

export default router;