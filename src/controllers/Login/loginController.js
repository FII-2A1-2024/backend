const checkExistence = require("../../services/loginService");
const verifyEmailSyntax = require("../../utils/verifyEmailSyntax");
const passwordHashHandler = require("../../utils/generateHash");
const HttpCodes = require("../../config/returnCodes");
const tokenGeneration = require("../../utils/JWT/JWTGeneration");
const userServices = require("../../services/userServices");

/**
 * 	Get the json from the post endpoint them make the folowing checks
 * 		 1. The json is correct
 * 	YES: 2. The email respects the format: <name_1>.<name_2>@student.uaic.ro
 * 	YES: 3. The email exists in the database with the coresponding password
 *
 * 	NOTE: any NO will result in a proper error code
 */

async function login(req, res) {
	try {
		const { email, password } = req.body;
		let code = HttpCodes.SUCCESS;
		if (email === undefined || password === undefined) {
			handleErrorCodes(res, HttpCodes.BAD_REQUEST);
			return;
		}
		if (!verifyEmailSyntax(email)) {
			handleErrorCodes(res, HttpCodes.INVALID_EMAIL);
			return;
		}
		const hashedPassword = await passwordHashHandler(password);
		code = await checkExistence(email, hashedPassword);

		const errorAppeared = await handleErrorCodes(res, code);
		if (!errorAppeared) {
			const token = tokenGeneration.generateAccessToken(email);
			const uid = await userServices.getIdByEmail(email);

			const user = {
				uid: uid,
				username: "deocamdata username random nu e implementat",
				port: req.connection.remotePort.toString() // e asta metoda portivita pentru a obtine porturile?
			}
			userServices.logUserIn(user);
			res.send({
				resCode: code,
				token: token,
				id: uid,
				message: "The user has been succesfully logged in"
			});
		}
	} catch (error) {
		res.send({
			resCode: HttpCodes.INTERNAL_SERVER_ERROR,
			message: `Internal server error${error.message}`
		});
	}
}

async function handleErrorCodes(res, code) {
	switch (code) {
		case HttpCodes.WRONG_PASSWORD:
			res.send({
				resCode: code,
				message: "The password is wrong",
			});
			return true;
		case HttpCodes.USER_DOESNOT_EXIST:
			res.send({
				resCode: code,
				message: "The email does not exists in the database",
			});
			return true;
		case HttpCodes.UNVERIFIED_EMAIL:
			res.send({
				resCode: code,
				message: "The email has not been verified yet",
			});
			return true;
		case HttpCodes.BAD_REQUEST: // The error code needs to be changed?
			res.send({
				resCode: code,
				message:
					"Invalid json format. The format should be of type: " +
					"{email : <data>, password : <data>}",
			});
			return true;

		case HttpCodes.INVALID_EMAIL:
			res.send({
				resCode: code,
				message:
					"The email does not respect the format: " +
					"<name_1>.<name_2>@student.uaic.ro",
			});
			return true;
		default:
			return false;
	}
}

module.exports = login;