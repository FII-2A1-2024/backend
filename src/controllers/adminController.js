const adminServices = require("./../services/adminServices");


class AdminController {
    static async timeoutUser(req, res) {
        try {
            const post = await adminServices.timeoutUser(id);
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async promoteUser(req, res) {
        try {
            const posts = await adminServices.promoteUser(id);
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async reviewReport(req, res) {
        try {
            const posts = await adminServices.reviewReport(id);
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async sendWarning(req, res) {
        try {
            const posts = await adminServices.sendWarning(id);
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async deletePost(req, res) {
        const id = parseInt(req.query.id);
        try {
            await postServices.delete(id); 
            res.status(200).send("success");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
}

module.exports = AdminController;
