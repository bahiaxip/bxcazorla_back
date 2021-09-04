'use strict'

const express = require("express");

const router = express.Router();
const FeedbackrentController = require('../controllers/feedbackrent');

router.get('/feedbackrent',FeedbackrentController.getFeed);

module.exports = router;
