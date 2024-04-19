const checkExistence = require("../../services/loginService");
const verifyEmailSyntax = require("../../utils/verifyEmailSyntax");
const HttpCodes = require("../../config/returnCodes");

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
			code = await checkExistence(email, password);
		}
		res.send({ resCode: code });
	} catch (error) {
		res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
	}
}

module.exports = login;
