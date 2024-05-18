const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const checkProfanity = require("./../utils/ProfanityDetector/profanityValidator");
const Socket = require('./../utils/SocketIO');

class messagesService {
    static async post(
        sender_id,
        receiver_id,
        content
    ) {
        if(!sender_id || isNaN(parseInt(sender_id)) || parseInt(sender_id) <= 0)  
            throw new Error("Invalid sender_id");
        if(!receiver_id || isNaN(parseInt(receiver_id)) || parseInt(receiver_id) <= 0)  
            throw new Error("Invalid receiver_id");

        let profanityResult = await checkProfanity(content);
        profanityResult = JSON.parse(profanityResult);
        if(profanityResult.status){
            throw new Error("Message contains profane words: " + profanityResult.words);
        }
    
        let users = null;
        try {
            users = await prisma.loggedUsers.findMany({
                where: {
                    uid: parseInt(receiver_id)
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await prisma.$disconnect();
        }

        if (users == null || users.length <= 0) 
            throw new Error("User with receiver_id couldn't be found");
        
        const io = Socket.getSocket();

        users.forEach((user) => {
            if (io) {
                io.to(user.socket).emit('message', {sender_id, content});
            } else {
                throw new Error("Failed sending the message through socket");
            }
        });

        return {
            sender_id,
            receiver_id,
            content
        };
    }
}

module.exports = messagesService;
