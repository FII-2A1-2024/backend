const express = require("express");
const router = express.Router();
const passwordResetRequest = require("../controllers/Login/passwordResetRequest");
const passwordResetController = require("../controllers/Login/passwordResetController");

/**
 * 	The resetPassword/ post endpoint expects a json of type:
 * 	{
 * 		"email" : <email for wich is required a password reset>
 * 	}
 *
 * 	NOTE: 	the email has to be the primary one
 * 			(i.e. respects the format <name_1>.<name_2>@student.uaic.ro)
 */

router
	.get("/", (req, res) => {
		res.send({ data: "Password change request stage" });
	})
	.post("/resetPass", (req, res) => {
		resetPasswordController(req, res);
	})
	.get("/resetPass/verify", (req, res) => {
		res.send({ data: "insert new password" });
	})
	.post("/resetPass/verify", (req, res) => {
		changePasswordController(req, res);
	});

module.exports = router;
