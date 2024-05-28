const userService = require("../services/userServices");
const httpCodes = require("../config/returnCodes");

async function get(req, res) {
	console.log(req.params.id);
	const id = req.params.id;
	if (id === undefined) {
		res.send({ resCode: httpCodes.BAD_REQUEST, message: "invalid id" });
	} else {
		res.send(await userService.getSocketById(id));
	}
}

module.exports = { get: get };
