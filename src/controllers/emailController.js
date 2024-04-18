const jwt = require('jsonwebtoken')
const existsInDB = require('../models/existsInDb')
const userIsVerified = require('../models/isVerified')
const markUserAsVerified = require('../models/markVerified')
const HttpCodes = require('../config/returnCodes')
const signUpService = require('../services/signUpService')


async function verifyEmail(req, res){
    const token = req.query.token;
    
    try {
        const decoded = jwt.verify(token, signUpService.privateKey);
        const currTime = Date.now()
        const tokenStamp = decoded.timestamp;
        const maxVerifyTime = 24 * 60 * 60 * 1000; //24 hr in milisecunde
        if(currTime - tokenStamp > maxVerifyTime){
            res.status(HttpCodes.TOKEN_EXPIRED).send('Verification token expired')
            console.log(HttpCodes.TOKEN_EXPIRED, 'Verification token expired');
            return
        }
        
        
        const email = decoded.email
        
        //!exista userul??
        const userExistsResult = await existsInDB(email);
        if (!userExistsResult) {
            res.status(HttpCodes.DOESNOT_EXIST).send('User does not exist');
            console.log("Eroare de user does not exist");
            return
        }

        //! e deja verificat userul??
        const userIsVerifiedResult = await userIsVerified(email);
        if (userIsVerifiedResult) {
            res.status(HttpCodes.ALREADY_VERIFIED).send('You are already verified');
            console.log("Eroare de user already verified");
            return
        }
        //TODO verifica userul
        await markUserAsVerified(email);
        console.log("Totul e ok si userul a fost verificat");

        //? Cand e totul ok
        res.send("Your account has been succesfully verified")
    } catch(error){
        console.error("Error verifying token: ", error);
        res.status(HttpCodes.INVALID_REQUEST).send("<p>Invalid token</p><a href='#'>Resend</a>")
    }
}

module.exports = verifyEmail