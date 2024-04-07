import express from "express";
import db from "./config/Database.js";
import Users from "./models/user.model.js";
import router from "./routes/index.route.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(router);

(async () => {
	try {
		await db.authenticate();
		console.log("Database connection has been established successfully.");

		await Users.sync();
	} catch (error) {
		console.log(error);
	}
})();



app.listen(3000, () => {
	console.log("Server started on port 3000");
})

