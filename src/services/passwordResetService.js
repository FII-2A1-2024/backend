const jwt = require("jsonwebtoken");
const resetTokenServices = require("../utils/JWT/JWTSecretGeneration");
const HttpCodes = require("../config/returnCodes");
const userServices = require("../services/userServices");

const sendEmail = require("../utils/sendEmail").sendCustomEmail;

class PasswordResetService {
    async validateToken(token) {
        return PasswordResetService.checkTokenValidity(token)
    }

    async validatePassword(password) {
        return PasswordResetService.checkPasswordValidity(password)
    }

    async validateEmail(email) {
        return PasswordResetService.checkEmailValidity(email)
    }

    async retriveEmail(token) {
        return PasswordResetService.retriveEmailFromToken(token)
    }

    static async retriveEmailFromToken(token) {
        const decoded = jwt.verify(token, resetTokenServices.jwtSecret);
        return decoded.email
    }

    static async checkEmailValidity(email) {
        if (email === undefined) {
            return {
                resCode: HttpCodes.BAD_REQUEST,
                message: "This method expects a json of type {email : password}"
            };
        }
        const emailFound = await userServices.existsInDB(email);
        if (!emailFound) {
            return {
                code: HttpCodes.USER_DOESNOT_EXIST,
                message: "User not found",
            }
        }
        return {
            resCode: HttpCodes.SUCCESS,
            message: "User was found"
        };
    }

    static async checkPasswordValidity(password) {
        if (password === undefined) {
            return {
                resCode: HttpCodes.BAD_REQUEST,
                message: "This method expects a json of type {password : <password>}"
            };
        }
        return {
            resCode: HttpCodes.SUCCESS,
            message: "Password is valid"
        };
    }

    static async checkTokenValidity(token) {
        if (token === undefined) {
            return {
                resCode: HttpCodes.BAD_REQUEST,
                message: "Token is undefined"
            }
        }
        const decoded = jwt.verify(token, resetTokenServices.jwtSecret);
        const currTime = Date.now();
        const tokenStamp = decoded.timestamp;
        const maxVerifyTime = 5 * 60 * 1000; //5 min in milisec
        if (currTime - tokenStamp > maxVerifyTime) {
            return {
                resCode: HttpCodes.TOKEN_EXPIRED,
                message: "Reset token expired"
            };
        }
        return {
            resCode: HttpCodes.SUCCESS,
            message: "Token is valid"
        };
    }
}

module.exports = new PasswordResetService()