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

// Folosim aceasta functie pt testare, daca nu stergem emailul din bd, 
// nu putem testa ca iese din executie cu exceptia "exista deja in bd(453)" 
deleteByEmail('razvan.boita@student.uaic.ro');