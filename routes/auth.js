const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register

router.post("/register", async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json(error);
	}
});

//login
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			res.status(401).json("user does not exist");
		}

		//get hashed password in the db, unhash it and compare to the one in req.body
		const originalPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(
			CryptoJS.enc.Utf8
		);
		if (originalPassword !== req.body.password) {
			res.status(401).json("Wrong password");
		}

		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_KEY,
			{ expiresIn: "3d" }
		);

		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, accessToken });
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
