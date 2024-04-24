const { PrismaClient } = require("@prisma/client");
const HttpCodes = require("../config/returnCodes.js");
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Verifica daca un email exista in baza de date, caz in care
// verifica daca se potriveste cu parola. Codul generat este
// returnat
async function existsInDBEmailAndPass(email, password) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				emailPrimary: email,
			},
		});
		const arePasswordsTheSame = await bcrypt.compare(password, user.password);
		
		if (user == null) {
			return HttpCodes.USER_DOESNOT_EXIST;
		}
		if (!arePasswordsTheSame) {
			return HttpCodes.WRONG_PASSWORD;
		}
		return HttpCodes.SUCCES;
	} catch (error) {
		console.error("Error retrieving user:", error);
	} finally {
		await prisma.$disconnect();
	}
}

module.exports = existsInDBEmailAndPass;
