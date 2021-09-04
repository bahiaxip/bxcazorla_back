'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
var CardrentSchema = Schema({
	title: String,
	minPrice : Number,
	minNights: Number,
	minCapacity: Number,
	capacity: Number,
	logo: String,
	image: String,
	thumbnail: String,
	type:[String],
	web: String,
	phone: String,
	numLevelFeedback: String,
	numLevelLocation: Number,
	maps:String,
	text:String,
	emitterCard:Schema.Types.ObjectId
})

module.exports = mongoose.model('Cardrent',CardrentSchema);