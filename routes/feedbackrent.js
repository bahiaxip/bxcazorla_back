'use strict'

const express = require("express");

const router = express.Router();
const FeedbackrentController = require('../controllers/feedbackrent');

router.get('/feedbackrents',FeedbackrentController.getFeeds);
router.get('/feedbackrents/:id',FeedbackrentController.getFeedsByRentId);
router.post('/feedbackrent',FeedbackrentController.saveFeed);
router.delete('/feedbacks',FeedbackrentController.deleteFeeds);
module.exports = router;
