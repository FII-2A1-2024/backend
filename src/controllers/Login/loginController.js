const checkExistence = require("../../services/loginService");
const verifyEmailSyntax = require("../../utils/verifyEmailSyntax");
const HttpCodes = require("../../config/returnCodes");
const tokenGeneration = require("../../utils/JWT/JWTGeneration");
const passwordHashHandler = require('../../utils/generateHash');

async function login(req, res) {
	try {
		const { email, password } = req.body;
		let code = HttpCodes.SUCCESS;
		if (!verifyEmailSyntax(email)) {
			// email invalid
			code = HttpCodes.INVALID_EMAIL;
		} else {
			// email valid
			const hashedPassword = passwordHashHandler(password) ;
			code = await checkExistence(email, hashedPassword);
		}
		
		if(code == HttpCodes.SUCCESS){
			const token = tokenGeneration.generateAccessToken(email);
			// console.log(token);
			res.send({ resCode: code, token: token });
		} else {
			res.send({ resCode: code});
		}
			
		
	} catch (error) {
		res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
	}
}

module.exports = login;
