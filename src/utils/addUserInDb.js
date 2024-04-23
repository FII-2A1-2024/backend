const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const crypto = require('crypto');

function generateHash(key) {
    const hash = crypto.createHash('sha256');
    hash.update(key);
    return hash.digest('hex');
}
async function addUser(newUser) {
    const {username, password} = newUser
    try {
        const hashedPassword = await generateHash(password);
        console.log(hashedPassword);
        // console.log(hashedPassword.length);

        const newUser = await prisma.user.create({
            data: {
                emailPrimary: username,
                password: hashedPassword,
                emailSecondary : "null",
                profesorFlag : 0,
                verifiedEmail : 0
            }
        });

        console.log(`User '${newUser.emailPrimary}' added to the database.`);
    } catch (error) {
        console.error('Error adding user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Example usage:
// addUser("newUser", "newPassword");
module.exports = {
    addUser,
    generateHash
};
