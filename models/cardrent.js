'use strict'

const mongoose = require("mongoose");


//necesario añadir un pricerent array de objetos algo similar a:
//....,
//pricerent:[{capacity:Number,minNights:Number,priceBase:Number,priceNight:Number}],
//....,

const Schema = mongoose.Schema;
var CardrentSchema = Schema({
	title: String,
	minPrice : String,
	minNights: Number,
	minCapacity: Number,
	capacity: [Number],
	capacities:[],
	services:[String],
	logo: String,
	image: String,
	images:[String],
	selectedImage:String,
	thumbnail: String,
	type:[String],
	web: String,
	phone: String,
	numLevelFeedback: Number,
	numLevelLocation: Number,
	maps:String,
	text:String,	
	//emitterCard:Schema.Types.ObjectId
	//emitterCard:{type:Schema.ObjectId,ref:"User"}

})

module.exports = mongoose.model('Cardrent',CardrentSchema);