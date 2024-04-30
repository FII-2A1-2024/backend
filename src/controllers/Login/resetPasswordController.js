// This module is responsable with cheking wether
// an user is in the DataBase and sends an email
// with a reset link

const sendEmail = require('../../utils/sendEmail')
const tokenGeneration = require("../../utils/JWT/JWTGeneration")
const resetTokenServices = require("../../utils/JWT/resetToken");

const HttpCodes = require("../../config/returnCodes");
const UserService = require('../../services/userServices')



async function resetPassword(req, res) {
	const email = req.body.email;
	const emailFound = await UserService.existsInDB(email);
	if (emailFound) {
		console.log("Am gasit email-ul: " + email);
		const resetToken = tokenGeneration.generateResetToken(email);
		const resetLink = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/resetPass/verify?token=${resetToken}`;
		//process.env.TEMPLATE_ID este temporar folosit aici,env.local va fi actualizat cu un template nou pentru
		//emailul de resetare a parolei
		sendEmail(email, resetLink, process.env.TEMPLATE_ID);
		res.sendStatus(HttpCodes.SUCCESS);
	} else {
		console.log("Nu am gasit email-ul: " + email);
		res.sendStatus(HttpCodes.USER_DOESNOT_EXIST);
	}
}

module.exports = resetPassword;
