const jwt = require("jsonwebtoken");
const HttpCodes = require("../config/returnCodes");
const privateKeyHandler = require("../utils/JWT/JWTSecretGeneration");

const UserService = require("../services/userServices");

async function verifyEmail(req, res) {
	const token = req.query.token;

	try {
		const decoded = jwt.verify(token, privateKeyHandler.jwtSecret);
		const currTime = Date.now();
		const tokenStamp = decoded.timestamp;
		const maxVerifyTime = 24 * 60 * 60 * 1000; //24 hr in milisecunde
		if (currTime - tokenStamp > maxVerifyTime) {
			res.status(HttpCodes.TOKEN_EXPIRED).send("Verification token expired");
			console.log(HttpCodes.TOKEN_EXPIRED, "Verification token expired");
			return;
		}

		const email = decoded.email;

		//!exista userul??
		UserService.existsInDB(email).then((result) => {
			if (!result.value) {
				res.status(HttpCodes.USER_DOESNOT_EXIST).send("User does not exist");
				console.log("Eroare de user does not exist");
				return;
			}
		});

		//! e deja verificat userul??
		const userIsVerifiedResult = (await UserService.isVerifed(email)).value;
		if (userIsVerifiedResult) {
			res.status(HttpCodes.ALREADY_VERIFIED).send("You are already verified");
			console.log("Eroare de user already verified");
			return;
		}
		//TODO verifica userul
		await UserService.markUserVerified(email);
		console.log("Totul e ok si userul a fost verificat");

		//? Cand e totul ok
		res.send("Your account has been succesfully verified");
	} catch (error) {
		console.error("Error verifying token: ", error);
		res
			.status(HttpCodes.INVALID_REQUEST)
			.send("<p>Invalid token</p><a href='#'>Resend</a>");
	}
}

module.exports = verifyEmail;