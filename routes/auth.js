const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		role: req.body.role,
		password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
	});
	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Login
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });

		if (!user) {
			res.status(401).json("Wrong credentials");
		} else {
			//Get the hashed password in the db, decrypt it and convert to string using utf8 encoding
			const originalPassword = CryptoJS.AES.decrypt(
				user.password,
				process.env.PASSWORD_SECRET
			).toString(CryptoJS.enc.Utf8);
			originalPassword !== req.body.password && res.status(401).json("Wrong credentials");
			const accessToken = jwt.sign(
				{
					id: user._id,
					role: user.role,
				},
				process.env.JWT_KEY
				// { expiresIn: "2d" }
			);
			const { password, ...others } = user._doc;
			res.status(200).json({ ...others, accessToken });
		}
	} catch (err) {
		console.log(err);
		// res.status(500).json(err);
	}
});

module.exports = router;
