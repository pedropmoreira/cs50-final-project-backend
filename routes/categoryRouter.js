import express from 'express';
import {getAllCategories, getCategoryById,} from '../controllers/categoryController.js';

const router = express.Router();

//GET/category  to get all categories
router.get('/', getAllCategories);

//GET/category/:id to get a category by id
router.get('/:id', getCategoryById);

export default router