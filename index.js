import express from "express";
import db from "./config/Database.js";
import Users from "./models/user.model.js";
import router from "./routes/index.route.js";
import dotenv from "dotenv"

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
(async () => {
	try {
		await db.authenticate();
		console.log("Database connection has been established successfully.");

		await Users.sync();
	} catch (error) {
		console.log(error);
	}
})();

app.use(router);

app.listen(3000, () => {
	console.log("Server started on port 3000");
})

