import express from 'express';
import {loginUser, getAllUsers,getUserById,updateUser,deleteUser,createUser } from '../controllers/userController.js';

const router = express.Router();

//POST /user to create a new user
router.post('/',createUser)
//POST /user/login to login 
router.post('/login',loginUser)

//GET /user to get all the users
router.get('/', getAllUsers)
//GET /user/id to get the user by id 
router.get('/:id', getUserById);

//PUT /user/id to update the user
router.put('/:id', updateUser);

//DELETE /user/id to delete the user 
router.delete('/:id', deleteUser);


export default router;