const adminServices = require("../services/adminServices");
const UserService = require("../services/userServices")


class AdminController {
    static async timeoutUser(req, res) {
        try {
            const email = req.body.email;
            const result =  await UserService.getIdByEmail(email);
            const user = {
                uid: result.uid,
                email: email,
                timeout_start: new Date(),
                timeout_duration: 1
            }
            UserService.insertIntoTimedOutUsers(user);
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async promoteUser(req, res) {
        try {
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
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
