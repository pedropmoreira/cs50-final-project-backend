import express from "express";
import {createTransaction} from '../controllers/transactionController.js'

const router = express.Router();

//POST /transaction - to create a new transaction

router.post('/',createTransaction)

export default router;

