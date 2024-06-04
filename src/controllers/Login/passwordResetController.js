const passwordHashHandler = require('../../utils/generateHash')
const HttpCodes = require("../../config/returnCodes");
const userServices = require("../../services/userServices");
const PasswordResetService = require("../../services/passwordResetService")

const sendEmail = require("../../utils/sendEmail").sendCustomEmail;
const resetTokenServices = require("../../utils/JWT/JWTGeneration");


/**
 * 	The function below expects a query token from wich it
 * 	will extract an email and a timestamp.
 * 	The code below verify if the token has expired.
 * 	If not it will request a password to be replaced in the database
 */

async function change(req, res) {
	try {
		const token = req.query.token;
		let response = await PasswordResetService.validateToken(token);
		if (response.resCode !== HttpCodes.SUCCESS) {
			res.send(response);
			return;
		}

		response = await PasswordResetService.validatePassword(req.body.password)
		if (response.resCode !== HttpCodes.SUCCESS) {
			res.send(response);
			return;
		}

		const email = await PasswordResetService.retriveEmail(token)
		const hashedPassword = passwordHashHandler(req.body.password);
		response = await userServices.changePassword(email, hashedPassword)
		res.send(response);

	} catch (error) {
		console.error("Error verifying token: ", error);
		res.send({
			resCode: HttpCodes.INVALID_REQUEST,
			message: "Invalid token"
		});
	}
}

/**
 * 	The function below espects an email
 * 	If the email is found in the database then it sends a link on that email
 * 	with an URL for pasword changing
 */

async function requestChange(req, res) {
	const email = req.body.email;

	const response = await PasswordResetService.validateEmail(email); console.log(1); console.log(response)
	if (response.resCode !== HttpCodes.SUCCESS) {
		res.send(response);
		return;
	}

	const resetToken = resetTokenServices.generateResetToken(email);
	const resetLink = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/resetPass/verify?token=${resetToken}`;
	console.log(resetLink);
	sendEmail(email, "Password Reset", resetLink);
	res.send({
		resCode: HttpCodes.SUCCESS,
		message: "The email was succesfuly sent"
	});
}

module.exports = {
	changePassword: change,
	requestChange: requestChange
};
