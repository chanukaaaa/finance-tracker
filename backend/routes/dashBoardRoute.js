const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    getData,
} = require('../controllers/dashBoardController');


router.get('/:userId', getData);

module.exports = router;