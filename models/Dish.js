const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true },
		desc: { type: String },
		img: { type: String, required: true },
		category: { type: Array },
		inStock: { type: Boolean, default: true },
		price: { type: Number, required: true },
		imgName: { type: String },
		requireSauce: { type: Boolean, required: true, default: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Dish", DishSchema);
