const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addUser(newUser) {
    const {username, password} = newUser
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword.length);

        // Create a new user in the database
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
module.exports = addUser
