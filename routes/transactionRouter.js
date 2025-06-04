import express from "express";
import {createTransaction, deleteTransaction,getAllTransactions,getTransactionById,updateTransaction} from '../controllers/transactionController.js'

const router = express.Router();

//POST /transaction - to create a new transaction
router.post('/',createTransaction)

// GET /transaction - to get the transactions with filters
router.get("/", getAllTransactions);
// GET /transaction/:id get a transaction by id
router.get("/:id", getTransactionById);

// PUT /transaction:id - to update a transaction by id
router.put("/:id",updateTransaction)

//DEL /transaction/:id to delete a transaction by id
router.delete("/:id", deleteTransaction)

export default router;

