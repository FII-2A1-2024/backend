const userService = require('./userServices');
const HttpCodes = require('../config/returnCodes');

class AccountDeletionService{
    static async deleteAccount(email) {
        userService.deleteUserByEmail(email);
        return { resCode: HttpCodes.SUCCESS, message: "Account succesfully deleted." };
    }
}

module.exports = AccountDeletionService;