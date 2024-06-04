const accountDeletionService = require('../services/accountDeletionService')
const jwt = require('jsonwebtoken')
const HttpCodes = require('../config/returnCodes');
const privateKeyHandler = require('../utils/JWT/JWTSecretGeneration')
const tokenBlacklistInstance = require('../utils/JWT/tokenBlackList')
const UserService = require("../services/userServices")
class AccountDeletionController{
    static async deleteAccount(req, res) {
        const token = req.query.token;
        try {
            const decoded = jwt.verify(token, privateKeyHandler.jwtSecret);
            const email = decoded.email;
            const result = await UserService.getIdByEmail(email);
            const uid = result.uid;
            UserService.deleteLoggedOutUser(uid);
            const jsonResponse = await accountDeletionService.deleteAccount(email);
            res.status(HttpCodes.SUCCESS).send(jsonResponse);
            tokenBlacklistInstance.addToBlacklist(email);    
        } catch (error) {
            console.error("Error verifying token: ", error);
            res.status(HttpCodes.INVALID_REQUEST).send("<p>Invalid token</p>");
        }   
    }
}

module.exports = AccountDeletionController;