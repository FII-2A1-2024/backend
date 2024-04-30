const HttpCodes = require("../config/returnCodes.js");
const UserService = require('../services/userServices.js')

async function checkExistence(email, password) {
	let code = HttpCodes.SUCCESS;
	//TODO
	const userExistsInDB = await UserService.validCredentials(email, password);
	if (userExistsInDB === HttpCodes.SUCCESS) {
		const userVerified = await UserService.isVerifed(email);
		if (userVerified) {
			code = HttpCodes.SUCCESS;
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
