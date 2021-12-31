const router = require("express").Router();
const Order = require("../models/Order");
const {
	verifyTokenAndAuthorisation,
	verifyTokenAndAdmin,
	verifyTokenAndAdminManager,
	verifyToken,
} = require("./verifyToken");

//Create order
router.post("/new", async (req, res) => {
	const order = new Order(req.body);
	try {
		const savedOrder = await order.save();
		res.status(201).json(savedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

// //Get user order
// router.get("/find/:userId", verifyTokenAndAuthorisation, async (req, res) => {
// 	try {
// 		const order = Order.findOne({ userId: req.params.userId });
// 		res.status(200).json(order);
// 	} catch (error) {
// 		res.status(500).json(error);
// 	}
// });

//Update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get Order
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		res.status(200).json(order);
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
router.get("/", async (req, res) => {
	try {
		const orders = await Order.find();

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get income stats
router.get("/income-stats", async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: previousMonth } } },
			{
				$project: {
					month: { $month: "$createdAt" },
					sales: "$amount",
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: "$sales" },
				},
			},
		]);

		res.status(200).json(income);
	} catch (error) {
		res.status(500).json(error);
	}
});
//Get order stats
router.get("/order-stats", async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

	try {
		const data = await Order.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{ $project: { month: { $month: "$createdAt" } } },
			{ $group: { _id: "$month", total: { $sum: 1 } } },
		]);

		res.status(200).json(data);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
