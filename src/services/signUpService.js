const addInDb = require('../models/addInDb')
const existsInDB = require('../models/existsInDb')
const sendEmail = require('../utils/sendEmail.js')
const jwt = require('jsonwebtoken')
const HttpCodes = require('../config/returnCodes.js')

function generateVerificationToken(email){
    return jwt.sign({
        email: email,
        timestamp: Date.now() 
    }, process.env.JWT_SECRET, {expiresIn: '24h'})
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
            const verificationLink = `http://localhost:3000/signup/verify?token=${verificationToken}`;
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
    createUser: createUser
}