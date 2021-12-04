const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		items: { type: Object },
		amount: { type: Number, required: true },
		shipping: { type: Object, required: true },
		instructions: { type: String },
		status: { type: String, default: "pending" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
