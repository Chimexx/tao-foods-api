const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, process.env.JWT_KEY, (err, user) => {
			if (err) {
				res.status(403).json("Token is not valid");
			} else {
				req.user = user;
				next();
			}
		});
	} else {
		res.status(401).json("You are not authenticated");
	}
};

const verifyTokenAndAuthorisation = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("You dont have access for this");
		}
	});
};

const verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.role === "admin") {
			next();
		} else {
			res.status(403).json("You are not authorised for this action");
		}
	});
};
const verifyTokenAndAdminManager = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.role === "admin" || req.user.role === "manager") {
			next();
		} else {
			res.status(403).json("You are not authorised for this action");
		}
	});
};

module.exports = {
	verifyToken,
	verifyTokenAndAdmin,
	verifyTokenAndAdminManager,
	verifyTokenAndAuthorisation,
};
