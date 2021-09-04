'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeedbackrentSchema = Schema({
	feedLevel:Number,
	feedText:String,			
	emitterId:Schema.Types.ObjectId

})

module.exports = mongoose.model("Feedbackrent", FeedbackrentSchema);