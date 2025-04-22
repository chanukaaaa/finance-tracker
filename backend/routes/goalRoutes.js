const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getGoalById,
  completeGoal,
  searchGoals,
} = require('../controllers/goalController');


router.post('/', createGoal);
router.post('/goal-completed/:id', completeGoal);
router.get('/user/:userId', getGoals);
router.get('/:id',getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.get('/search', searchGoals);

module.exports = router;