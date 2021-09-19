'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = Schema({
	name: String,
	originalName: String,
	path: String,
	ext: String,
	size: Number,
	type: String,
	rentId:Schema.Types.ObjectId

})

module.exports = mongoose.model("ImageCardRent", ImageSchema);