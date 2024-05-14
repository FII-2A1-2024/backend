const verifyEmailSyntax = require("../../utils/verifyEmailSyntax");
const passwordHashHandler = require("../../utils/generateHash");
const handleErrorCodes = require("../../utils/handleErrorCodesLogin");
const HttpCodes = require("../../config/returnCodes");
const tokenGeneration = require("../../utils/JWT/JWTGeneration");
const userServices = require("../../services/userServices");
const tokenBlackListHandler = require('../../utils/JWT/tokenBlackList')
const userTokensListHandler = require('../../utils/JWT/userTokens')
const writeEnvLocal = require("../../utils/JWT/JWTSecretGeneration")

/**
 * 	Get the json from the post endpoint them make the folowing checks
 * 		 1. The json is correct
 * 	YES: 2. The email respects the format: <name_1>.<name_2>@student.uaic.ro
 * 	YES: 3. The email exists in the database with the coresponding password
 * 			and is verified
 *
 * 	NOTE: any NO will result in a proper error code
 */

async function login(req, res) {
	try {
		const { email, password, socket } = req.body;
		let code = HttpCodes.SUCCESS;

		if (email === undefined || password === undefined || socket === undefined) {
			handleErrorCodes(res, HttpCodes.BAD_REQUEST);
			return;
		}
		//if (!verifyEmailSyntax(email)) {
		//	handleErrorCodes(res, HttpCodes.INVALID_EMAIL);
		//	return;
		//}
		const hashedPassword = await passwordHashHandler(password);

		code = (await userServices.validCredentials(email, hashedPassword)).resCode;
		let errorAppeared = await handleErrorCodes(res, code);
		if (errorAppeared) return;

		code = (await userServices.isVerifed(email)).resCode;
		errorAppeared = await handleErrorCodes(res, code);

		if (!errorAppeared) {
			let token = 0;
			if (code === HttpCodes.SUCCESS && !tokenBlackListHandler.isTokenBlacklisted(email)) {
				token = tokenGeneration.generateAccessToken(email);
			} else if (code === HttpCodes.SUCCESS && tokenBlackListHandler.isTokenBlacklisted(email)) {
				token = tokenBlackListHandler.getToken(email);
				tokenBlackListHandler.removeFromBlacklist(email);
			}
			const result = await userServices.getIdByEmail(email);
			if (result.resCode !== HttpCodes.SUCCESS) {
				res.send(result);
				return;
			}
			const uid = result.uid;
			const user = {
				uid: uid,
				username: "deocamdata username random nu e implementat",
				socket: socket,
			};
			userServices.logUserIn(user);
			userTokensListHandler.addToUserTokensList(email, token);
			res.send({
				resCode: code,
				token: token,
				id: uid,
				message: "The user has been succesfully logged in",
			});
		}
	} catch (error) {
		console.log(error)
		res.send({
			resCode: HttpCodes.INTERNAL_SERVER_ERROR,
			message: `Internal server error${error.message}`
		});
	}
}
module.exports = login;

