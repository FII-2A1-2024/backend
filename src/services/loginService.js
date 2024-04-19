const existsInDB = require("../models/existsInDb");
const isVerified = require("../models/isVerified");
const HttpCodes = require("../config/returnCodes.js");

async function checkExistence(email, password) {
	let code = HttpCodes.SUCCES;

	const userExistsInDB = await existsInDB(email, password);
	if (userExistsInDB === HttpCodes.SUCCES) {
		const userVerified = await isVerified(email);
		if (userVerified) {
			code = HttpCodes.SUCCES;
		} else {
			code = HttpCodes.UNVERIFIED_EMAIL;
		}
	} else if (userExistsInDB === HttpCodes.USER_DOESNOT_EXIST) {
		code = userExistsInDB;
	} else if (userExistsInDB === HttpCodes.WRONG_PASSWORD) {
		code = userExistsInDB;
	}
	return code;
}

module.exports = checkExistence;
