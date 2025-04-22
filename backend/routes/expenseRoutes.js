const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById,
  searchExpenses,
} = require('../controllers/expenseController');


router.post('/', createExpense);
router.get('/user/:userId', getExpenses);
router.get('/:id',getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/search', searchExpenses);

module.exports = router;