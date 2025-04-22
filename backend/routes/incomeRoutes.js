const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  getIncomeById,
  searchIncomes,
} = require('../controllers/incomeController');


router.post('/', createIncome);
router.get('/user/:userId', getIncomes);
router.get('/:id',getIncomeById);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);
router.get('/search', searchIncomes);

module.exports = router;