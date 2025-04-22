const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getWallet,
} = require('../controllers/walletController');

router.get('/user/:userId', getWallet);

module.exports = router;