'use strict'

const express = require("express");
const PricerentController = require('../controllers/pricerent');
const router = express.Router();

router.get('/pricerent',PricerentController.getPrice);

module.exports = router;