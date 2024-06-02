const commentServices = require("./../services/commentServices");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

class CommentController {
    static async getAll(req, res) {
        const post_id = parseInt(req.query.post_id);
        try {
            const post = await commentServices.getAll(post_id);
            res.status(200).json({"status":"ok", post});
        } catch (error) {
            res.status(500).json({ "status":"err", "message":  error.message});
        }
    }
    static async post(req, res) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.decode(token);

        const { post_id, username, parent_id, author_id, description} = req.body;
        try {
            const users = await prisma.user.findMany({
                where: {
                  emailPrimary: decodedToken.user,
                },
              });
      
              const user = users.length > 0 ? users[0] : null;
              if (!user) {
                return res.status(404).json({ "status": "err", "message": "User not found" });
              }

            const comment_id = await commentServices.post(
                post_id,
                username,
                parent_id,
                author_id,
                user.uid,
                description
            );
            res.status(200).json({"status":"ok", comment_id});
        } catch (error) {
            res.status(500).json({"status":"err", "message": error.message});
        }
    }
    static async delete(req, res) {
        const id = parseInt(req.query.id);
        try{
            await commentServices.delete(id);
            res.status(200).json({ "status":"ok", "message":"Comment deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async put(req, res) {
        const { user_id, id, description, votes } = req.body;
        try {
            if (description !== undefined && votes == undefined) {
                await commentServices.putDescription(id, description);
            } else if (votes !== undefined && description == undefined) {
                await commentServices.putVotes(user_id, id, votes);
            } else {
                throw new Error("Too many or few parameters");
            }
            res.status(200).json({ "status":"ok", id});
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
}

module.exports = CommentController;
