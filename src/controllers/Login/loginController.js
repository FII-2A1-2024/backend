const checkExistence = require("../../services/loginService");
const verifyEmailSyntax = require("../../utils/verifyEmailSyntax");
const HttpCodes = require("../../config/returnCodes");
const bcrypt = require('bcrypt');
const tokenGeneration = require("../../utils/JWT/JWTGeneration");
const passwordHashHandler = require("../../utils/addUserInDb")

async function login(req, res) {
	try {
		const { email, password } = req.body;
		let code = HttpCodes.SUCCES;
		if (!verifyEmailSyntax(email)) {
			// email invalid -  nu are sens sa verificam existenta sa in
			//                  baza de date
			code = HttpCodes.INVALID_EMAIL;
		} else {
			// email valid -    verificam daca exista in baza de date si
		//                  actualizam codul
		const hashedPassword = await passwordHashHandler.generateHash(password) ;
		code = await checkExistence(email, hashedPassword);
		}
		if(code === HttpCodes.SUCCESS){
			const token = tokenGeneration.generateAccessToken(email);
			res.send({ resCode: code, token: token });
		} else {
			res.send({ resCode: code});
		}
			
		
	} catch (error) {
		res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
	}
}

module.exports = login;