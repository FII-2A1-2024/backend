//Acest fisier nu trebuie sa existe.Functia generateResetToken trebuie adaugata in utils/jwt/JWTGeneration

const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

function generatePrivateKey() {
	// Generate a 256-bit (32-byte) random private key
	const privateKey = crypto.randomBytes(32).toString("hex");
	return privateKey;
}

const privateKey = generatePrivateKey();

function generateResetToken(email) {
	return jwt.sign(
		{
			email: email,
			timestamp: Date.now(),
		},
		privateKey,
		{ expiresIn: "5min" },
	);
}

module.exports = {
	generateResetToken: generateResetToken,
	privateKey: privateKey,
};
