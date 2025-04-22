const Expense = require("../models/expenseModel");
const Budget = require("../models/budgetModel");
const Wallet = require("../models/WalletModel");

exports.createExpense = async (req, res) => {
  const { title, description, amount, userId, budgetId } = req.body;
  try {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, totalSaving: "0" });
      await wallet.save();
    }

    const newTotalSaving = parseFloat(wallet.totalSaving) - parseFloat(amount);
    wallet.totalSaving = newTotalSaving.toString();
    await wallet.save();

    const expense = new Expense({
      userId: userId,
      title,
      description,
      amount,
      budgetId,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Create Expense Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  const { userId } = req.params;
  try {
    const expenses = await Expense.find({ userId });

    for (let expense of expenses) {
      if (expense.budgetId === "0") {
        expense.budgetName = "Other";
      } else {
        const budget = await Budget.findById(expense.budgetId);
        if (budget) {
          expense.budgetName = budget.budgetName;
        } else {
          expense.budgetName = null;
        }
      }
    }

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Get Expenses Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    res.status(200).json(expense);
  } catch (err) {
    console.error("Get Expenses Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { title, description, amount, budgetId } = req.body;
  try {
    const expense = await Expense.findById(req.params.id);
    const userId = expense.userId;
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, totalSaving: "0" });
      await wallet.save();
    }

    const newAmount = parseFloat(expense.amount) - amount;
    const newTotalSaving =
      parseFloat(wallet.totalSaving) + parseFloat(newAmount);
    wallet.totalSaving = newTotalSaving.toString();
    await wallet.save();
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, description, amount, budgetId },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (err) {
    console.error("Update Expense Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      console.log("Expense not found");
      return res.status(404).json({ message: "Expense not found" });
    }

    const userId = expense.userId;
        let wallet = await Wallet.findOne({ userId });
    
        if (!wallet) {
          wallet = new Wallet({ userId, totalSaving: "0" });
          await wallet.save();
        }
    
        const newTotalSaving = parseFloat(wallet.totalSaving) + parseFloat(expense.amount);
        wallet.totalSaving = newTotalSaving.toString();
        await wallet.save();

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense removed" });
  } catch (err) {
    console.error("Delete Expense Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.searchExpenses = async (req, res) => {
  const { q } = req.query;
  try {
    const expenses = await Expense.find({
      userId: req.userId,
      title: { $regex: q, $options: "i" },
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.error("Search Expenses Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
