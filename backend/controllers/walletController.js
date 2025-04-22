const Wallet = require("../models/WalletModel");

exports.getWallet = async (req, res) => {
  const { userId } = req.params;
  try {
    const wallet = await Wallet.find({ userId });
    res.status(200).json(wallet);
  } catch (err) {
    console.error("Get Incomes Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};