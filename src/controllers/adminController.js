const { log } = require("console");
const adminServices = require("../services/adminServices");
const timeOutListHandler = require("../utils/JWT/manageTimeOutToken");
const userTokensListHandler = require("../utils/JWT/userTokens")

class AdminController {
    static async timeoutUser(req, res) {
        try {
            const userEmail = req.body.email;
            timeOutListHandler.invalidateToken(userTokensListHandler.getToken(userEmail),1);
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

    static async promoteToTeacher(req, res) {
        try {
            const me = req.user.user
            const user = req.body.email
            const firstSubject = req.body.firstSubject
            let result;

            result = await adminServices.promoteTeacher(me, user, firstSubject)

            res.status(result.code).send(result.message)
        } catch (error) {
            res.status(500).send("Error occured: " + error)
        }
    }

    static async addSubjectToTeacher(req, res) {
        try {
            const me = req.user.user
            const user = req.body.email
            const secondSubject = req.body.secondSubject
            let result;

            result = await adminServices.addSubjectToTeacher(me, user, secondSubject)
            res.status(result.code).send(result.message)
        } catch (error) {
            res.status(500).send("Error occured: " + error)
        }
    }

    static async deleteTeacher(req, res) {
        try {
            const me = req.user.user
            const user = req.body.email
            let result;

            result = await adminServices.deleteTeacher(me, user)
            res.status(result.code).send(result.message)
        } catch (error) {
            res.status(500).send("Error occured: " + error)
        }
    }

    static async viewReports(req, res) {
        try {
            const allReports = await adminServices.viewReports();
            res.status(200).json(allReports);
        } catch (error) {
            //console.error('Eroare la preluarea datelor:', error);
            res.status(500).send("Error occured at viewing reports: " + error);
        }
    }
    static async evaluateReport(req, res) {
        try {
            if (!req.body.report_id || !req.body.state) {
                return res.status(400).json("report_id and state fields are missing from the body of the req");
            }
            if (req.body.state != 'report rejected' && req.body.state != 'report accepted') {
                return res.status(400).json("state can be <report accepted> or <report rejected> ");
            }
            const report_id = req.body.report_id;
            const wantedState = req.body.state;
            const confirmationOfReview = await adminServices.reviewReport(report_id, wantedState);
            res.status(200).json(confirmationOfReview);
        } catch (error) {
            res.status(500).send("Error occured at evaluating report: " + error);
        }
    }
    static async sendWarning(req, res) {
        try {
            if (!req.body.user_id|| !req.body.warning) {
                return res.status(400).send("user_id and warning fields are missing from the body of the req");
            }
            
            const confirmationForSendingWarning = await adminServices.sendWarning(req.body.user_id,req.body.warning);
            res.status(200).json(confirmationForSendingWarning);
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async deletePost(req, res) {
        try {


            if (!req.body.post_id || !req.body.reason) {
                return res.status(400).send("post_id and reason are missing from the body of the req");
            }

            const confirmationForDeletePost = await adminServices.deletePost(req.body.post_id, req.body.reason);
            res.status(200).json(confirmationForDeletePost);

        } catch (error) {
            res.status(500).send("Error occured at deleting a post: " + error);
        }

    }
}

module.exports = AdminController;
