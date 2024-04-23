const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findEmail(email) {
	try {
		const emailFound = await prisma.user.findFirst({
			where: {
				emailPrimary: email,
			},
		});
		return emailFound != null;
	} catch (error) {
		console.error("Error retrieving email:", error);
	} finally {
		await prisma.$disconnect();
	}
}

module.exports = findEmail;
