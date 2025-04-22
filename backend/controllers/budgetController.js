const Budget = require("../models/budgetModel");
const Expense = require('../models/expenseModel');

exports.createBudget = async (req, res) => {
  const { budgetName, price, userId } = req.body;
  try {
    const budget = new Budget({ userId: userId, budgetName, price });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error("Create Budget Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  const { userId } = req.params;

  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const budgets = await Budget.find({ userId });


    const budgetsWithUsedAmount = await Promise.all(
      budgets.map(async (budget) => {
        const totalUsed = await Expense.aggregate([
          {
            $match: {
              userId: budget.userId,
              budgetId: budget._id.toString(),
              createdAt: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ]);

        return {
          ...budget.toObject(),
          usedAmount: totalUsed.length > 0 ? totalUsed[0].totalAmount : 0,
        };
      })
    );
    res.status(200).json(budgetsWithUsedAmount);
  } catch (err) {
    console.error("Get Budgets Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getBudgetById = async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await Budget.findById(id);
    res.status(200).json(budget);
  } catch (err) {
    console.error("Get Budgets Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateBudget = async (req, res) => {
  const { budgetName, price } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { budgetName, price },
      { new: true }
    );
    res.status(200).json(updatedBudget);
  } catch (err) {
    console.error("Update Budget Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      console.log("Budget not found");
      return res.status(404).json({ message: "Budget not found" });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Budget removed" });
  } catch (err) {
    console.error("Delete Budget Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.searchBudgets = async (req, res) => {
  const { q } = req.query;
  try {
    const budgets = await Budget.find({
      userId: req.userId,
      budgetName: { $regex: q, $options: "i" },
    });
    res.status(200).json(budgets);
  } catch (err) {
    console.error("Search Budgets Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
