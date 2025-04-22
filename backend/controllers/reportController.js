const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");
const Income = require("../models/incomeModel");
const Wallet = require("../models/WalletModel");
const Goal = require("../models/goalModel");

exports.getReportData = async (req, res) => {
  let { userId, year, month } = req.params;
  console.log(year);

  try {
    year = parseInt(year, 10);
    month = parseInt(month, 10) - 1;

    if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
      return res.status(400).json({ message: "Invalid year or month format" });
    }

    const wallet = await Wallet.find({ userId });

    const incomes = await Income.find({
      userId,
      createdAt: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    const expenses = await Expense.find({
      userId,
      createdAt: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });

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

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const goals = await Goal.find({ userId });

    const budgets = await Budget.find({ userId });

    const budgetsWithUsedAmount = await Promise.all(
      budgets.map(async (budget) => {
        const totalUsed = await Expense.aggregate([
          {
            $match: {
              userId: budget.userId,
              budgetId: budget._id.toString(),
              createdAt: {
                $gte: new Date(year, month, 1),
                $lt: new Date(year, month + 1, 1),
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

    res.status(200).json({
      summary: [
        {
          totalSaving: wallet[0].totalSaving,
          totalIncome,
          totalExpense,
        },
      ],
      incomes,
      expenses,
      goals,
      budgetsWithUsedAmount,
    });
  } catch (err) {
    console.error("Get Report Data Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
