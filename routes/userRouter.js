import express from 'express';
import {loginUser, getAllUsers,getUserById,updateUser,deleteUser,createUser } from '../controllers/userController.js';
import authUser from '../Middlewares/auth.middlewares.js';

const router = express.Router();

//POST /user to create a new user
router.post('/',createUser)
//POST /user/login to login 
router.post('/login',loginUser)

//GET /user to get all the users
router.get('/',authUser, getAllUsers)
//GET /user/id to get the user by id 
router.get('/:id',authUser, getUserById);

//PUT /user/id to update the user
router.put('/:id', authUser,updateUser);

//DELETE /user/id to delete the user 
router.delete('/:id', authUser,deleteUser);


export default router;