const jwt = require("jsonwebtoken");
const resetTokenServices = require("../../utils/JWT/resetToken");
const HttpCodes = require("../../config/returnCodes");
const passwordHashHandler = require('../../utils/generateHash')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



async function changePassword(req, res) {
	const token = req.query.token;

	try {
		const decoded = jwt.verify(token, resetTokenServices.privateKey);
		const currTime = Date.now();
		const tokenStamp = decoded.timestamp;
		const maxVerifyTime = 5 * 60 * 1000; //5 min in milisecunde
		if (currTime - tokenStamp > maxVerifyTime) {
			res.status(HttpCodes.TOKEN_EXPIRED).send("Verification token expired");
			console.log(HttpCodes.TOKEN_EXPIRED, "Verification token expired");
			return;
		}

		const email = decoded.email;
		const hashedPassword = passwordHashHandler(req.body.password); //aici mai era un param 10?!
		await prisma.user.update({
			where: { emailPrimary: email },
			data: { password: hashedPassword },
		});

		res
			.status(HttpCodes.SUCCESS)
			.send("Your password has been succesfully changed");
	} catch (error) {
		console.error("Error verifying token: ", error);
		res.status(HttpCodes.INVALID_REQUEST).send("<p>Invalid token</p>");
	}
}

module.exports = changePassword;
