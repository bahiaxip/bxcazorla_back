'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeedbackrentSchema = Schema({
	nick:String,	
	email: String,
	feedback:Number,		
	text:String,			
	rentId:{type:Schema.ObjectId,ref:"Cardrent"}

})

module.exports = mongoose.model("Feedbackrent", FeedbackrentSchema);