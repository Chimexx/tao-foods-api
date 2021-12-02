const router = require("express").Router();
const Sauce = require("../models/Sauce");
const { verifyTokenAndAdmin } = require("./verifyToken");

//create sauce
router.post("/new", verifyTokenAndAdmin, async (req, res) => {
	const sauce = new Sauce(req.body);
	try {
		const savedSauce = await sauce.save();
		res.status(201).json(savedSauce);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get sauce
router.get("/find/:id", async (req, res) => {
	try {
		const sauce = await Sauce.findById(req.params.id);
		res.status(200).json(sauce);
	} catch (error) {
		res.status(500).json(error);
	}
});

//update sauce
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedSauce = await Sauce.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
		res.status(200).json(updatedSauce);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Delete sauce
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		await Sauce.findByIdAndDelete(req.params.id);
		res.status(200).json("Sauce deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get All Sauces

router.get("/", async (req, res) => {
	const catQuery = req.query.category;

	try {
		let sauces;

		if (catQuery) {
			sauces = await Sauce.find({ category: { $in: [catQuery] } }).limit(10);
		} else {
			sauces = await Sauce.find();
		}

		res.status(200).json(sauces);
	} catch (error) {
		res.status(500).json(error);
		console.log(error);
	}
});

module.exports = router;
