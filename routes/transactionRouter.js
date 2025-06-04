import express from "express";
import {createTransaction, deleteTransaction,getAllTransactions,getTransactionById,updateTransaction} from '../controllers/transactionController.js'
import authUser from "../Middlewares/auth.middlewares.js";
const router = express.Router();

//POST /transaction - to create a new transaction
router.post('/', authUser,createTransaction)

// GET /transaction - to get the transactions with filters
router.get("/", authUser,getAllTransactions);
// GET /transaction/:id get a transaction by id
router.get("/:id", authUser,getTransactionById);

// PUT /transaction:id - to update a transaction by id
router.put("/:id",authUser,updateTransaction)

//DEL /transaction/:id to delete a transaction by id
router.delete("/:id",authUser, deleteTransaction)

export default router;

