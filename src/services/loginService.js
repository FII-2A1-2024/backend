const UserService = require('../services/userServices.js')
const HttpCodes = require("../config/returnCodes.js");
const userServices = require('../services/userServices.js');

/**
 * 	Gets an email and a password, checks wether the pair (email, password)
 * 	exists in database and it is verified in order to return a code
 */

async function checkExistence(email, password) {
	const userExistsInDB = await userServices.validCredentials(email, password);
	if (userExistsInDB === HttpCodes.SUCCESS) {
		const userVerified = await userServices.isVerifed(email);
		if (!userVerified) {
			return HttpCodes.UNVERIFIED_EMAIL;
		}
	} else {
		return userExistsInDB;
	}
	return HttpCodes.SUCCESS;
}

module.exports = checkExistence;