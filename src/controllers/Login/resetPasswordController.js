// This module is responsable with cheking wether
// an user is in the DataBase and sends an email
// with a reset link

const sendEmail = require('../../utils/sendEmail')
const resetTokenServices = require("../../utils/JWT/resetToken");
const HttpCodes = require("../../config/returnCodes");
const UserService = require('../../services/userServices')



async function resetPassword(req, res) {
	const email = req.body.email;
	const emailFound = await UserService.existsInDB(email);
	if (emailFound) {
		console.log("Am gasit email-ul: " + email);
		const resetToken = resetTokenServices.generateResetToken(email);
		const resetLink = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/resetPass/verify?token=${resetToken}`;
		sendEmail(email, resetLink, process.env.TEMPLATE_ID_CHANGEPASS);
		res.sendStatus(HttpCodes.SUCCESS);
	} else {
		console.log("Nu am gasit email-ul: " + email);
		res.sendStatus(HttpCodes.USER_DOESNOT_EXIST);
	}
}

module.exports = resetPassword;
