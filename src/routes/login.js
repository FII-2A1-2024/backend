const express = require("express");
const router = express.Router();

const loginController = require("../controllers/Login/loginController");
const authenticateToken = require("../utils/JWT/JWTAuthentication");

router
	.get("/", (req, res) => {
		res.send({ data: "No data yet" });
	})
	.post("/login", (req, res) => {
		loginController(req, res);
	});

module.exports = router;
