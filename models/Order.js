const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		items: { type: Object, required: true },
		amount: { type: Number, required: true },
		shipping: { type: Object, required: true },
		instructions: { type: String },
		status: { type: String, default: "pending" },
		reference: { type: String },
		paymentMethod: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
