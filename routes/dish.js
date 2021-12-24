const router = require("express").Router();
const Dish = require("../models/Dish");
const { verifyTokenAndAdminManager } = require("./verifyToken");

//Create dish
router.post("/new", verifyTokenAndAdminManager, async (req, res) => {
	const dish = new Dish(req.body);
	try {
		const savedDish = await dish.save();
		res.status(201).json(savedDish);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get dish
router.get("/find/:id", async (req, res) => {
	try {
		const dish = await Dish.findById(req.params.id);
		res.status(200).json(dish);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Update dish
router.put("/update/:id", verifyTokenAndAdminManager, async (req, res) => {
	try {
		const updatedDish = await Dish.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
		res.status(200).json(updatedDish);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Delete dish
router.delete("/:id", verifyTokenAndAdminManager, async (req, res) => {
	try {
		await Dish.findByIdAndDelete(req.params.id);
		res.status(200).json("Dish deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get All Dishes

router.get("/", async (req, res) => {
	const catQuery = req.query.category;

	try {
		let dishes;

		if (catQuery) {
			dishes = await Dish.find({ category: { $in: [catQuery] } }).limit(10);
		} else {
			dishes = await Dish.find();
		}

		res.status(200).json(dishes);
	} catch (error) {
		res.status(500).json(error);
		console.log(error);
	}
});

module.exports = router;
