const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");
const Income = require("../models/incomeModel");
const Wallet = require("../models/WalletModel");
const Goal = require("../models/goalModel");

exports.getData = async (req, res) => {
  const { userId } = req.params;

  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const wallet = await Wallet.find({ userId });

    const incomes = await Income.find({
      userId,
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    const expenses = await Expense.find({
      userId,
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const allIncome = await Income.find({ userId });
    const allExpenses = await Expense.find({ userId });

    const pendingGoals = await Goal.find({ userId, status: { $ne: 1 } }).limit(
      5
    );

    const completeGoals = await Goal.find({ userId, status: { $ne: 0 } }).limit(
      5
    );

    res.status(200).json({
      totalSaving: wallet[0].totalSaving,
      totalIncome,
      totalExpense,
      allIncome,
      allExpenses,
      pendingGoals,
      completeGoals,
    });
  } catch (err) {
    console.error("Get Budgets Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
