const HttpCodes = require("../config/returnCodes.js");
const UserService = require('../services/userServices.js')

async function checkExistence(email, password) {
	const userExistsInDB = await UserService.validCredentials(email, password);

	if (userExistsInDB !== HttpCodes.SUCCESS) {
		return userExistsInDB;
	}

	const userVerified = await UserService.isVerifed(email);

	if (!userVerified) {
		return HttpCodes.UNVERIFIED_EMAIL;
	}

	return HttpCodes.SUCCESS;
}

module.exports = checkExistence;
