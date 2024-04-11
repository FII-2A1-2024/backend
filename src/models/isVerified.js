const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function userIsVerified(email) {
    const user = await prisma.user.findUnique({
        where: { emailPrimary: email }
    });
    return user && user.verifiedEmail === 1; // Returns true if user is verified, false otherwise
}

module.exports = userIsVerified