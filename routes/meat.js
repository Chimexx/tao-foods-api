const router = require("express").Router();
const Meat = require("../models/Meat");
const { verifyTokenAndAdmin } = require("./verifyToken");

//create meat
router.post("/new", verifyTokenAndAdmin, async (req, res) => {
	const meat = new Meat(req.body);
	try {
		const savedMeat = await meat.save();
		res.status(201).json(savedMeat);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get meat
router.get("/find/:id", async (req, res) => {
	try {
		const meat = await Meat.findById(req.params.id);
		res.status(200).json(meat);
	} catch (error) {
		res.status(500).json(error);
	}
});

//update meat
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedMeat = await Meat.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
		res.status(200).json(updatedMeat);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Delete meat
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		await Meat.findByIdAndDelete(req.params.id);
		res.status(200).json("Meat deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get All Meats

router.get("/", async (req, res) => {
	const catQuery = req.query.category;

	try {
		let meats;

		if (catQuery) {
			meats = await Meat.find({ category: { $in: [catQuery] } }).limit(10);
		} else {
			meats = await Meat.find();
		}

		res.status(200).json(meats);
	} catch (error) {
		res.status(500).json(error);
		console.log(error);
	}
});

module.exports = router;
