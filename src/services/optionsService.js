const UserService = require('./userServices')
const HttpCodes = require('../config/returnCodes')
const validator = require('validator')

class OptionsService{

    static async addEmail(email, newEmail){
        //TODO data validation
        //1. email exists
        let result = await UserService.existsInDB(email)
        if(!result){
            return {"resCode": HttpCodes.USER_DOESNOT_EXIST, "message": "Your primary email doesn't exist."}
        }

        //2. new email is different from the first
        if(email == newEmail){
            return {resCode: HttpCodes.INVALID_REQUEST, message: "Secondary email can't be the same with the primary one."}
        }

        //3. verify newEmail syntax(any kind of email is allowed)
        if(!validator.isEmail(newEmail)){
            return {resCode: HttpCodes.INVALID_EMAIL, message: "Check your new email spelling again."}
        }        

        //4. is user verified?
        result = await UserService.isVerifed(email) 
        if(!result){
            return {resCode: HttpCodes.UNVERIFIED_EMAIL, message: "Your account is not verified yet..."}
        }

        //5. already has secondary email (?? de cate ori)
        result = await UserService.hasSecondaryEmail(email)
        if(result){
            return {resCode: HttpCodes.HAS_SECOND_EMAIL, message: "You already have a second email added!"}
        }

        UserService.addEmail(email, newEmail)
        return {resCode: HttpCodes.SUCCESS, message: "Everything went well."}
    }
}

module.exports = OptionsService