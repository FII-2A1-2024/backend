const UserService = require("../services/userServices.js");
const sendEmail = require("../utils/sendEmail.js").sendEmail;
const HttpCodes = require("../config/returnCodes.js");

const path = require("path");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "../config", ".env.local");

const jwtHandler = require("../utils/JWT/JWTGeneration.js");
dotenv.config({ path: envPath });

async function createUser(username, password) {
	const newUser = { username: username, password: password };
	let code = 0;

	//	Eroare de la schimbarea returnarilor

	return UserService.existsInDB(username)
		.then((result) => {
			if (result.value == 1) {
				console.log("Exista deja in BD");
				code = HttpCodes.USER_ALREADY_EXISTS;
			} else {
				code = HttpCodes.SUCCESS;
				//verify email RIGHT HERE
				const verificationToken =
					jwtHandler.generateVerificationToken(username);
				const verificationLink = `http://localhost:${process.env.SERVER_PORT}/signup/verify?token=${verificationToken}`;
				console.log(verificationLink);
				sendEmail(username, verificationLink, process.env.TEMPLATE_ID);
				return UserService.addUser(newUser).resCode;
			}
			return Promise.resolve(code);
		})
		.then(() => {
			return code;
		})
		.catch((error) => {
			console.error("Error:", error);
			return HttpCodes.USER_ALREADY_EXISTS;
		});
}

module.exports = {
	createUser: createUser,
};
