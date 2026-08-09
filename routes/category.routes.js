import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controller/category.controller.js';
import { protect } from '../middleware/protect.js';
import { authorize } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import {  categoryQuerySchema } from '../validators/query.validator.js';

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: Devices and gadgets    
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


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search categories by name
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name]
 *         description: Field to sort categories by
 *
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of categories per page
 *
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/categories', protect, authorize("owner","admin","manager","sales-attendant"), validate(categoryQuerySchema, "query"), getAllCategories);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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