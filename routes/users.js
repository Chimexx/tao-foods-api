const User = require("../models/User");
const {
	verifyTokenAndAuthorisation,
	verifyTokenAndAdmin,
	verifyTokenAndAdminManager,
} = require("./verifyToken");
const router = require("express").Router();

//Update User
router.put("/:id", verifyTokenAndAdminManager, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			if (user.role === "admin") {
				res.status(403).json("You can't update an admin account");
			} else {
				if (req.body.password) {
					req.body.password = CryptoJS.AES.encrypt(
						req.body.password,
						process.env.PASSWORD_SECRET
					).toString();
				}
				const updatedUser = await User.findByIdAndUpdate(
					req.params.id,
					{ $set: req.body },
					{ new: true }
				);
				res.status(200).json(updatedUser);
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

//Delete User
router.delete("/:id", verifyTokenAndAdminManager, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		user.role === "admin" && res.status(403).json("You can't delete an Admin");

		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("User deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get User
router.get("/find/:id", verifyTokenAndAdminManager, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get Users
router.get("/", verifyTokenAndAdminManager, async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
