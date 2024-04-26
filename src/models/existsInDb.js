const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')

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
		if (user == null) {
			return HttpCodes.USER_DOESNOT_EXIST;
		}
		if (user.password !== password) {
			return HttpCodes.WRONG_PASSWORD;
		}
		return HttpCodes.SUCCESS;
	} catch (error) {
		console.error("Error retrieving user:", error);
	} finally {
		await prisma.$disconnect();
	}
}



module.exports = existsInDBEmailAndPass