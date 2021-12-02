const mongoose = require("mongoose");

const SauceSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true },
		desc: { type: String },
		img: { type: String },
		category: { type: Array },
		inStock: { type: Boolean, default: true },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Sauce", SauceSchema);
