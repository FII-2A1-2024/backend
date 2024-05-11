const { log } = require("console");
const adminServices = require("../services/adminServices");


class AdminController {
    static async timeoutUser(req, res) {
        try {
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }

    static async promoteToAdmin(req, res) {
        try {
            //whats my level? can i promote somebody with a higher level than me?
            const me = req.user.user
            const {email: user, motive, level} = req.body
            console.log(`${me} is trying to promote user ${user} to admin of level ${level}, with motive: ${motive}`);

            let result = (await adminServices.promoteUser(me, user, level))
            const resCode = result.code
            const message = result.message
            res.status(resCode).send(message);
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }

    static async promoteToTeacher(req, res){
        try{
            const user = req.email
            const motive = req.motive
            let result = (await adminServices.promoteTeacher(user))
        } catch(error){
            res.status(500).send("Error occured: " + error)
        }
    }

    static async viewReports(req, res) {
        try {
            const allReports = await adminServices.viewReports(); 
            res.json(allReports); 
        } catch (error) {
            console.error('Eroare la preluarea datelor:', error);
            res.status(500).send("Error occured: " + error); 
         }
    }
    static async sendWarning(req, res) {
        try {
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async deletePost(req, res) {
        try {
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
}

module.exports = AdminController;
