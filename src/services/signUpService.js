const UserService = require("../services/userServices.js");
const EmailSender = require("../utils/sendEmail.js")
const HttpCodes = require("../config/returnCodes.js");

const path = require("path");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "../config", ".env.local");

const jwtHandler = require("../utils/JWT/JWTGeneration.js");
const { log } = require('console');
dotenv.config({ path: envPath });

<<<<<<< HEAD
async function createUser(username, password, originating_domain){
    const newUser = {username: username, password: password}
	// console.log(originating_domain);
    let code = 0
    let message = "All done! Proceed verifying your email in order to be able to log in!"
    return UserService.existsInDB(username).then(result => {
        if(result == 1){
            console.log("Exista deja in BD");
            code = HttpCodes.USER_ALREADY_EXISTS
            message = "An account with this username already exists!"
        }
        else{
            code = HttpCodes.SUCCESS
            //verify email RIGHT HERE
            const verificationToken = jwtHandler.generateVerificationToken(username)
            const verificationLink = `${originating_domain}/signup/verify?token=${verificationToken}`;
            console.log(verificationLink)
            sendEmail(username, verificationLink, process.env.TEMPLATE_ID)
            return UserService.addUser(newUser)
        }
        return Promise.resolve(code)
    }).then(() => {
        return {code: code, message: message};
    }).catch(error => {
        console.error("Error:", error)
        return {code: HttpCodes.BAD_REQUEST, message: message};
    })
   
=======
async function createUser(username, password) {
	const newUser = { username: username, password: password };
	let code = 0;

	//	Eroare de la schimbarea returnarilor

	return UserService.existsInDB(username)
		.then((result) => {
			if (result.value == 1) {
				console.log("Exista deja in BD");
				code = HttpCodes.USER_ALREADY_EXISTS;
			} else {
				console.log("Am intrat aici");
				code = HttpCodes.SUCCESS;
				//verify email RIGHT HERE
				const verificationToken =
					jwtHandler.generateVerificationToken(username);
				const verificationLink = `https://dev.octavianregatun.com/api/signup/verify?token=${verificationToken}`;
				console.log(verificationLink);
				console.log("Am trecut pe aici")
				EmailSender.sendEmail(username, verificationLink, process.env.TEMPLATE_ID);
				return UserService.addUser(newUser).resCode;
			}
			return Promise.resolve(code);
		})
		.then(() => {
			return code;
		})
		.catch((error) => {
			console.error("Error:", error);
			return HttpCodes.USER_ALREADY_EXISTS;
		});
>>>>>>> ac26ee59438eb4cb54212bebb3d07c4e333efcc3
}

module.exports = {
	createUser
};