const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/Login/resetPasswordController");
const changePasswordController = require("../controllers/Login/changePasswordController");

router
	.get("/", (req, res) => {
		res.send({ data: "user wants to change password" });
	})
	.post("/", (req, res) => {
		resetPasswordController(req, res);
	})
	.get("/verify", (req, res) => {
		res.send({ data: "insert new password" });
	})
	.post("/verify", (req, res) => {
		changePasswordController(req, res);
	});

module.exports = router;
