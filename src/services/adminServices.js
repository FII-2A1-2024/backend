const post = require("./../models/postModel");
const dbQuery = require("./../utils/dbQuery");
const sqlForUser = require("./../utils/userTableSql"); //interogari db

class AdminService {
    static async timeoutUser(id) {
        return 0;
    }
    static async promoteUser(id) {
        return 0;
    }
    static async reviewReport( ) {
        return 0;
     }
    static async sendWarning(id ) {
    return 0;  }
    static async deletePost(id) {
        /*
        const values = [id];
        const results = await dbQuery(values, sql.sqlDelete);
        */
       return 0;
    }
}

module.exports = AdminService;
