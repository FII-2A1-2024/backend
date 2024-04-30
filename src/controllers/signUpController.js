const signUpService = require('../services/signUpService')
const verifyEmailSyntax = require('../utils/verifyEmailSyntax')
const HttpCodes = require('../config/returnCodes')
const normalizeEmail = require('../utils/normalizeEmail')

async function signUp(req, res){
    try{
        const password = req.body.password;
        let username = req.body.username;

        //Vom normaliza emailul in cazul in care pune si litere mari
        username = normalizeEmail(username)
        // console.log("Normalized username: ", username);
        let code = HttpCodes.SUCCESS
        if(!verifyEmailSyntax(username)){
            //emailul e invalid, nu are sintaxa buna
            code = HttpCodes.INVALID_EMAIL
            console.log("Nu introducem userul in baza de date, are email gresit");
        } else{
            code = await signUpService.createUser(username, password)
        }
        res.send({resCode: code})
    } catch (error){
        res.status(500).send({error : error.message})
    }
}

module.exports = signUp;