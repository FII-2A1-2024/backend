const EmailSender = require("../../utils/sendEmail")
const resetTokenServices = require("../../utils/JWT/JWTGeneration");
const HttpCodes = require("../../config/returnCodes");
const userServices = require("../../services/userServices");

/**
 * 	The function below espects an email
 * 	If the email is found in the database then it sends a link on that email
 * 	with an URL for pasword changing
 */

async function resetPassword(req, res) {
	const email = req.body.email;
	if (email === undefined) {
		res.send({
			resCode: HttpCodes.BAD_REQUEST,
			message: "This method expects a json of type {email : password}",
		});
		return;
	}
	const emailFound = await userServices.existsInDB(email).value;
	if (emailFound) {
		const resetToken = resetTokenServices.generateResetToken(email);
		const resetLink = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/resetPass/verify?token=${resetToken}`;
		console.log(resetLink);
		EmailSender.sendCustomEmail(email, "Password Reset", resetLink);
		res.send({
			resCode: HttpCodes.SUCCESS,
			message: "The email was succesfuly sent",
		});
	} else {
		res.send({
			code: HttpCodes.USER_DOESNOT_EXIST,
			message: "User not found",
		});
	}
}

module.exports = resetPassword;
