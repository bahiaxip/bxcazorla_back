'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
var CardrentSchema = Schema({
	title: String,
	minPrice : String,
	minNights: Number,
	minCapacity: Number,
	capacity: [Number],
	services:[String],
	logo: String,
	image: String,
	images:[String],
	thumbnail: String,
	type:[String],
	web: String,
	phone: String,
	numLevelFeedback: String,
	numLevelLocation: Number,
	maps:String,
	text:String,	
	//emitterCard:Schema.Types.ObjectId
	//emitterCard:{type:Schema.ObjectId,ref:"User"}

})

module.exports = mongoose.model('Cardrent',CardrentSchema);