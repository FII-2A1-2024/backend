const userServices = require('../services/userServices')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function deleteLoggedUser(req, res) {
    try {
        const socket_id = req.query.socket
        const socketExists = await prisma.loggedUsers.findMany({
            where: {
                socket: socket_id
            }
        });
        //console.log(socketExists)
        if (socketExists.length === 0) {
            return res.json({ message: "wrong socket id" });
        }

        const result = await userServices.deleteUserFromLoggedTable(socket_id);
        return res.json(result);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }


}

async function addLoggedUser(req, res) {
    try {
        const userExists = await prisma.user.findUnique({
            where: {
                uid: req.body.uid
            }
        });
        if (!userExists) {
            return res.json({ message: "wrong user id" });
        }
        const user = {
            uid: req.body.uid,
            username: req.body.username,
            socket: req.body.socket,
        };
        const userExistsInLoggedTable = await prisma.loggedUsers.findMany({
            where: {
                socket: req.body.socket,
            }
        });
        if (!(userExistsInLoggedTable.length === 0)) {
            return res.json({ message: "socket already in use" });
        }
        const result = await userServices.logUserIn(user);
        return res.json(result);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}


module.exports = { deleteLoggedUser, addLoggedUser }