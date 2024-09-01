const express = require('express');
const {createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction, getSummary, getByCategory, getByDate, getCategories} = require('../controllers/transactionController');
const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/by-date', getByDate);
router.get('/categories', getCategories);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;