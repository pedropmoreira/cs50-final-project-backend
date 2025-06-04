import express from 'express';
import {getAllCategories, getCategoryById,} from '../controllers/categoryController.js';
import authUser from "../Middlewares/auth.middlewares.js";

const router = express.Router();

//GET/category  to get all categories
router.get('/', authUser, getAllCategories);

//GET/category/:id to get a category by id
router.get('/:id',authUser,  getCategoryById);

export default router