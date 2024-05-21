const express = require("express");
const router = express.Router();

const loginController = require("../controllers/Login/loginController");

/**
 * 	The email post endpoint expects a json of type:
 * 	{
 * 		"email"    : <email used by user to auth>,
 * 		"password" : <password of the user>
 * 	}
 *
 * 	NOTE: 	the email has to be the primary one
 * 			(i.e. respects the format <name_1>.<name_2>@student.uaic.ro)
 *
 * 	TO DO: Password emcryption on frontEnd ?
 */

router
	.get("/", (req, res) => {
		res.send({ data: "Login Stage" });
	})
	.post("/login", (req, res) => {
		loginController.login(req, res);
	});

module.exports = router;
