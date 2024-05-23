const userService = require("../services/userServices")

async function get(req, res) {
    const id = req.body.id;
    if (id === undefined) {
        res.send({ resCode: httptCodes.BAD_REQUEST, message: "invalid id" })
    }
    else {
        res.send(await userService.getSocketById(id));
    }
}

module.exports = { get: get }