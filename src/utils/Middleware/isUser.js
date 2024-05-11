const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function isUser(req, res, next) {
    const user = req.user;
    // console.log(user); 
    if (!user || !user['user']) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userEmail = user['user'];
        const admin = await prisma.admin.findUnique({
            where: {
                email: userEmail,
            },
        });

        if (admin) {
            return res.status(401).json({ error: 'Unauthorized access - this is an admin' });
        } else {
            next();
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = isUser;
