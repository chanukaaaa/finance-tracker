const Income = require("../models/incomeModel");
const Wallet = require("../models/WalletModel");

exports.createIncome = async (req, res) => {
  const { title, description, amount, userId } = req.body;
  try {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, totalSaving: "0" });
      await wallet.save();
    }

    const newTotalSaving = parseFloat(wallet.totalSaving) + parseFloat(amount);
    wallet.totalSaving = newTotalSaving.toString();
    await wallet.save();

    const income = new Income({ userId: userId, title, description, amount });
    await income.save();

    res.status(201).json(income);
  } catch (err) {
    console.error("Create Income Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getIncomes = async (req, res) => {
  const { userId } = req.params;
  try {
    const incomes = await Income.find({ userId });
    res.status(200).json(incomes);
  } catch (err) {
    console.error("Get Incomes Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getIncomeById = async (req, res) => {
  const { id } = req.params;
  try {
    const income = await Income.findById(id);
    res.status(200).json(income);
  } catch (err) {
    console.error("Get Incomes Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  const { title, description, amount } = req.body;
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });
    const userId = income.userId;
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, totalSaving: "0" });
      await wallet.save();
    }
    const newAmount = parseFloat(income.amount) - amount;
    const newTotalSaving =
      parseFloat(wallet.totalSaving) - parseFloat(newAmount);
    wallet.totalSaving = newTotalSaving.toString();
    await wallet.save();

    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { title, description, amount },
      { new: true }
    );
    res.status(200).json(updatedIncome);
  } catch (err) {
    console.error("Update Income Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      console.log("Income not found");
      return res.status(404).json({ message: "Income not found" });
    }

    const userId = income.userId;
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, totalSaving: "0" });
      await wallet.save();
    }

    const newTotalSaving = parseFloat(wallet.totalSaving) - parseFloat(income.amount);
    wallet.totalSaving = newTotalSaving.toString();
    await wallet.save();

    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income removed" });
  } catch (err) {
    console.error("Delete Income Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.searchIncomes = async (req, res) => {
  const { q } = req.query;
  try {
    const incomes = await Income.find({
      userId: req.userId,
      title: { $regex: q, $options: "i" },
    });
    res.status(200).json(incomes);
  } catch (err) {
    console.error("Search Incomes Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
