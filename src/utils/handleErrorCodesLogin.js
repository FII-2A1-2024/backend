const HttpCodes = require("../config/returnCodes");

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
				message: "The email does not exists in the database - !!!!!!! wow",
			});
			return true;
		case HttpCodes.UNVERIFIED_EMAIL:
			res.send({
				resCode: code,
				message: "The email has not been verified yet - !!!!!!! wow",
			});
			return true;
		case HttpCodes.BAD_REQUEST: // The error code needs to be changed?
			res.send({
				resCode: code,
				message:
					"Invalid json format. The format should be of type: " +
					"{email : <data>, password : <data>, socket : <data>}",
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

module.exports = handleErrorCodes;
