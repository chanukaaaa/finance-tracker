const express = require('express');
const router = express.Router();
const {
    getReportData,
} = require('../controllers/reportController');


router.get('/:userId/:year/:month', getReportData);

module.exports = router;