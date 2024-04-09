const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

async function existsInDB(newUser) {
    const {username} = newUser
    try {
        const user = await prisma.user.findUnique({
            where: {
                emailPrimary: username
            }
        });
        return user!==null;

    } catch (error) {
        console.error('Error retrieving user:', error);
    } finally {
        await prisma.$disconnect();
    }
}
//? Exemplu de usage
// existsInDB("newUser");

module.exports = existsInDB