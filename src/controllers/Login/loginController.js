const checkExistence = require("../../services/loginService");
const verifyEmailSyntax = require("../../utils/verifyEmailSyntax");
const HttpCodes = require("../../config/returnCodes");
const bcrypt = require('bcrypt');
const tokenGeneration = require("../../utils/JWT/JWTGeneration");
const passwordHashHandler = require("../../utils/addUserInDb");
const e = require("express");

async function login(req, res) {
	try {
		const { email, password } = req.body;
		let code = HttpCodes.SUCCESS;
		if (!verifyEmailSyntax(email)) {
			// email invalid
			code = HttpCodes.INVALID_EMAIL;
		} else {
			// email valid
			const hashedPassword = await passwordHashHandler.generateHash(password) ;
			code = await checkExistence(email, hashedPassword);
		}
		
		if(code == HttpCodes.SUCCESS){
			const token = tokenGeneration.generateAccessToken(email);
			// console.log(token);
			res.send({ resCode: code, token: token });
		} else {
			console.log("Am intrat in astalalt");
			res.send({ resCode: code});
		}
			
		
	} catch (error) {
		res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
	}
}

module.exports = login;
