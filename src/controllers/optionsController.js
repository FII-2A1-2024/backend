const HttpCodes = require('../config/returnCodes')
const optionsService = require('../services/optionsService')
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
}

module.exports = OptionsController