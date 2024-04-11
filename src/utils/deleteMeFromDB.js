const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteByEmail(email) {
    try {
        await prisma.user.deleteMany({
            where: { emailPrimary: email }
        });
        console.log(`Deleted all occurrences with email ${email} from the database`);
    } catch (error) {
        console.error('Error deleting occurrences from the database: ', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Call the function with the specified email
deleteByEmail('razvanboita1609@gmail.com');