const router = require("express").Router();
const Order = require("../models/Order");
const { verifyTokenAndAuthorisation, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");

//create order
router.post("/new", async (req, res) => {
	const order = new Order(req.body);
	try {
		const savedOrder = await order.save();
		res.status(201).json(savedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get user order
router.get("/find/:userId", verifyTokenAndAuthorisation, async (req, res) => {
	try {
		const order = Order.findOne({ userId: req.params.userId });
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json(error);
	}
});

//update order
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);

		res.status(200).json("Order deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get All Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find();

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;