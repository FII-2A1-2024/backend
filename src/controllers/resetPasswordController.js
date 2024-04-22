const findEmail = require("../utils/findEmail");
const sendEmail = require("../utils/sendEmail");

async function resetPassword(req, res) {
	sendEmail(req.body.email, "testMail", "test content");
	const emailFound = await findEmail(req.body.email);
	if (emailFound) {
		console.log("am gasit email");
		sendEmail(req.body.email, "testMail", "test content");
	} else {
		console.log("nu am gasit email");
	}

	res.send({ data: "Dummy" });
}

module.exports = resetPassword;
