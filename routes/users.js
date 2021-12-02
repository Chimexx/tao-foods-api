const User = require("../models/User");
const { verifyTokenAndAuthorisation, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//update
router.put("/:id", verifyTokenAndAuthorisation, async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json(error);
	}
});

//delete a user
router.delete("/:id", verifyTokenAndAuthorisation, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("User deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//get a user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	const query = req.query.new;
	try {
		const users = query ? await User.find().sort({ _id: -1 }).limit(10) : await User.find();

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
