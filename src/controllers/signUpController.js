const userService = require('../services/signUpService')
const verifyEmailSyntax = require('../utils/verifyEmailSyntax')
const HttpCodes = require('../config/returnCodes')

async function signUp(req, res){
    try{
        const {username, password} = req.body;
        let code = HttpCodes.SUCCES
        if(!verifyEmailSyntax(username)){
            //emailul e invalid, nu are sintaxa buna
            code = HttpCodes.INVALID_EMAIL
            console.log("Nu introducem userul in baza de date, are email gresit");
        } else{
            const code = await userService.createUser(username, password)
        }
        res.send({resCode: code})
    } catch (error){
        res.status(500).send({error : error.message})
    }
}

module.exports = signUp;