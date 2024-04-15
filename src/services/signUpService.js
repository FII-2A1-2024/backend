const addInDb = require('../models/addInDb')
const existsInDB = require('../models/existsInDb')
const sendEmail = require('../utils/sendEmail.js')
const jwt = require('jsonwebtoken')
const HttpCodes = require('../config/returnCodes.js')
const crypto = require('crypto');

function generatePrivateKey() {
    // Generate a 256-bit (32-byte) random private key
    const privateKey = crypto.randomBytes(32).toString('hex');
    return privateKey;
}

const privateKey = generatePrivateKey();

function generateVerificationToken(email){
    return jwt.sign({
        email: email,
        timestamp: Date.now() 
    }, privateKey, {expiresIn: '24h'})
}

async function createUser(username, password){
    const newUser = {username: username, password: password}
    let code = 0
    return existsInDB(username).then(result => {
        if(result == 1){
            console.log("Exista deja in BD");
            //aici ar trebui sa trimitem si un raspuns la server, nush cum
            code = HttpCodes.ALREADY_EXISTS
        }
        else{
            code = HttpCodes.SUCCES
            //verify email RIGHT HERE
            const verificationToken = generateVerificationToken(username)
            const verificationLink = `http://localhost:8000/signup/verify?token=${verificationToken}`;
            console.log(verificationToken)
            sendEmail(username, verificationLink)
            return addInDb(newUser)
        }
        return Promise.resolve(code)
    }).then(() => {
        return code;
    }).catch(error => {
        console.error("Error:", error)
        return HttpCodes.ALREADY_EXISTS;
    })
   
}

module.exports = {
    createUser: createUser,
    privateKey
}