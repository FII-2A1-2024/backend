const userService = require('../services/signUpService')

async function signUp(req, res){
    try{
        const {username, password} = req.body;
        const code = await userService.createUser(username, password)
        res.send({resCode: code}) //aici
    } catch (error){
        res.status(500).send({error : error.message})
    }
}

module.exports = signUp;