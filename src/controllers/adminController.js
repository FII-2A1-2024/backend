const adminServices = require("../services/adminServices");


class AdminController {
    static async timeoutUser(req, res) {
        try {
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
