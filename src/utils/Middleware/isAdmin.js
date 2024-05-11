const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function isAdmin(req, res, next) {
    const user = req.user;
    //console.log(user); 
    if (!user || !user['user']) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userEmail = user['user'];

        // daca exista emailul in admins atunci next()
        const admin = await prisma.admin.findUnique({
            where: {
                email: userEmail,
            },
        });

        if (admin) {
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized - this is an user' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = isAdmin;
