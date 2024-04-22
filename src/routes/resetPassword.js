const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/resetPasswordController");

router
	.get("/", (req, res) => {
		res.send({ data: "user wants to change password" });
	})
	.post("/", (req, res) => {
		resetPasswordController(req, res);
	});

module.exports = router;
