const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function markUserAsVerified(email) {
    await prisma.user.update({
        where: { emailPrimary: email },
        data: { verifiedEmail: 1 }
    });
}

module.exports = markUserAsVerified