// This module is responsable with cheking wether
// an user is in the DataBase and sends an email
// with a reset link

const findEmail = require("../utils/findEmail");
const sendEmail = require("../utils/sendCustomEmail");
const resetTokenServices = require("../services/resetToken");
const HttpCodes = require("../config/returnCodes");

async function resetPassword(req, res) {
	const email = req.body.email;
	const emailFound = await findEmail(email);
	if (emailFound) {
		console.log("am gasit email");
		const resetToken = resetTokenServices.generateResetToken(email);
		const resetLink = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/resetPass/verify?token=${resetToken}`;
		sendEmail(email, "Password Reset", resetLink);
		res.send(HttpCodes.SUCCES);
	} else {
		console.log("nu am gasit email");
		res.send(HttpCodes.USER_DOESNOT_EXIST);
	}
}

module.exports = resetPassword;
