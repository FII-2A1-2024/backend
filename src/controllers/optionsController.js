const HttpCodes = require('../config/returnCodes');
const OptionsService = require('../services/optionsService');
const jwt = require("jsonwebtoken");
const TokenBlackListHandler = require('../utils/JWT/tokenBlackList');
const UserService = require('../services/userServices')

class OptionsController{
     
    static async addEmail(req, res){
        try{
            const {email, newEmail} = req.body 
            const jsonResponse = await optionsService.addEmail(email, newEmail)
            res.status(jsonResponse.resCode).json(jsonResponse)
        } catch (error) {
            res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ "error": error })
        }
    }
    static async sendDeletionMail(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.decode(token);
            const user = decodedToken.user;
            const jsonResponse = await OptionsService.sendDeletionMail(user);
            res.status(jsonResponse.resCode).json(jsonResponse)
        } catch (error) {
            res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ "error": error })
        }
    }
    //nu e nevoie sa verificam daca requestul are token,deoarece in end-point se afla authenticateToken,care verifica
    //daca un token a fost pasat in headerul requestului.
    static async logoutUser(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.decode(token);
            const user = decodedToken.user;
            const result = await UserService.getIdByEmail(user);
            const uid = result.uid;
            console.log(uid);
            TokenBlackListHandler.addToBlacklist(user, token);
            UserService.deleteLoggedOutUser(uid);
            res.json({ message: 'Logout successful' });
        } catch (error) {
            res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ "error": error })
        }

    }
}
module.exports = OptionsController;
