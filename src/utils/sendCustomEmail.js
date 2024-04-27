const sgMail = require("@sendgrid/mail");

const path = require("node:path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../config", ".env.local");
dotenv.config({ path: envPath });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, content) {
	const msg = {
		to: to,
		from: {
			name: "AOT@doNotReply.com",
			email: process.env.FROM_EMAIL,
		},
		subject: subject,
		text: content,
	};

	try {
		await sgMail.send(msg);
	} catch (error) {
		console.error(error);

		if (error.response) {
			console.error(error.response.body);
		}
	}
}

module.exports = sendEmail;
