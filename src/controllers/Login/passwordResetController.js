const jwt = require("jsonwebtoken");
const resetTokenServices = require("../../utils/JWT/resetToken");
const HttpCodes = require("../../config/returnCodes");
const passwordHashHandler = require('../../utils/generateHash')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 	The function below expects a query token from wich it
 * 	will extract an email and a timestamp.
 * 	The code below verify if the token has expired.
 * 	If not it will request a password to be replaced in the database
 */

async function changePassword(req, res) {
	const token = req.query.token;

	try {
		const decoded = jwt.verify(token, resetTokenServices.privateKey);
		const currTime = Date.now();
		const tokenStamp = decoded.timestamp;
		const maxVerifyTime = 5 * 60 * 1000; //5 min in milisecunde
		if (currTime - tokenStamp > maxVerifyTime) {
			res.send({
				resCode: HttpCodes.TOKEN_EXPIRED,
				message: "Reset token expired"
			});
			return;
		}
		if (req.body.password === undefined) {
			res.send({
				resCode: HttpCodes.BAD_REQUEST,
				message: "This method expects a json of type {password : <password>}"
			});
			return;
		}

		const email = decoded.email;
		const hashedPassword = passwordHashHandler(req.body.password);
		await prisma.user.update({
			where: { emailPrimary: email },
			data: { password: hashedPassword },
		});

		res.send({
			resCode: HttpCodes.SUCCESS,
			message: "Your password has been succesfully changed"
		});
	} catch (error) {
		console.error("Error verifying token: ", error);
		res.send({
			resCode: HttpCodes.INVALID_REQUEST,
			message: "Invalid token"
		});
	}
}

module.exports = changePassword;
