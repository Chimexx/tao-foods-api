//packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

//routes
const dishRoute = require("./routes/dish");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const meatRoute = require("./routes/meat");
const sauceRoute = require("./routes/sauce");

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("DB connection successful");
	})
	.catch((error) => {
		console.log(error);
	});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/dishes", dishRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/meat", meatRoute);
app.use("/api/sauce", sauceRoute);

app.listen(process.env.PORT || 5000, () => {
	console.log("Server running");
});
