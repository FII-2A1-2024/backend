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
            const me = req.user.user
            const user = req.body.email
            const firstSubject = req.body.firstSubject
            let result;

            result = await adminServices.promoteTeacher(me, user, firstSubject)            
            
            res.status(result.code).send(result.message)
        } catch(error){
            res.status(500).send("Error occured: " + error)
        }
    }

    static async addSubjectToTeacher(req, res){
        try{
            const me = req.user.user
            const user = req.body.email
            const secondSubject = req.body.secondSubject
            let result;

            result = await adminServices.addSubjectToTeacher(me, user, secondSubject)
            res.status(result.code).send(result.message)
        } catch(error){
            res.status(500).send("Error occured: " + error)
        }
    }

    static async deleteTeacher(req, res){
        try{
            const me = req.user.user
            const user = req.body.email
            let result;

            result = await adminServices.deleteTeacher(me, user)
            res.status(result.code).send(result.message)
        } catch(error){
            res.status(500).send("Error occured: " + error  )
        }
    }

    static async reviewReport(req, res) {
        try {
            res.status(200).send("success");
        } catch (error) {
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
