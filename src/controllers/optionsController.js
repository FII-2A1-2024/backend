const HttpCodes = require('../config/returnCodes')
const optionsService = require('../services/optionsService')

const TokenBlackListHandler = require('../utils/JWT/tokenBlackList')

class OptionsController{
     
    static async addEmail(req, res){
        try{
            const {email, newEmail} = req.body 
            const jsonResponse = await optionsService.addEmail(email, newEmail)
            res.status(jsonResponse.resCode).json(jsonResponse)
        } catch(error){
            res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({"error": error})
        }
    }

     static async logoutUser(req, res) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        TokenBlackListHandler.addToBlacklist(token);
        res.json({ message: 'Logout successful' });
    }
}

module.exports = OptionsController;

