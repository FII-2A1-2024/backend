const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Verifica daca un email este verificat

// De sters la PR
// user?.verifiedEmail => 	verifica daca utilizatorul este null,
//							caz in care returneaza 0, altfel returneaza
//							valoarea campului verifiedEmail
async function userIsVerified(email) {
	const user = await prisma.user.findUnique({
		where: { emailPrimary: email },
	});
	console.log(user);
	return user?.verifiedEmail;
}

module.exports = userIsVerified;
