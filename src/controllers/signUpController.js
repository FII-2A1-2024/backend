const signUpService = require('../services/signUpService')
const verifyEmailSyntax = require('../utils/verifyEmailSyntax')
const HttpCodes = require('../config/returnCodes')
const normalizeEmail = require('../utils/normalizeEmail')

async function signUp(req, res){
    try{
        const password = req.body.password;
        let username = req.body.email;

        //Vom normaliza emailul in cazul in care pune si litere mari
        username = normalizeEmail(username)
        // console.log("Normalized username: ", username);
        let code = HttpCodes.SUCCESS
        if(!verifyEmailSyntax(username)){
            //emailul e invalid, nu are sintaxa buna
            code = HttpCodes.INVALID_EMAIL
            console.log("Nu introducem userul in baza de date, are email gresit");
            message = "Invalid email format! Example of accepted syntax: example.example@student.uaic.ro"
        } else{
<<<<<<< HEAD
            result = (await signUpService.createUser(username, password)) 
            code = result.code
            message = result.message
=======
            code = await signUpService.createUser(username, password)
>>>>>>> cd356f5d33032043b991796edfba5b7fa897693f
        }
        res.send({resCode: code, message: message})
    } catch (error){
        res.status(500).send({error : error.message})
    }
}

module.exports = signUp;