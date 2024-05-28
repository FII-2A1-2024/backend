const likeServices = require("./../services/likeService");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LikeController {
    static async getFromPost(req, res) { //toate like-urile unei postari
        console.log("aici");
        const post_id = parseInt(req.query.post_id);
        try {
            const likes = await likeServices.getFromPost(post_id);
            res.status(200).json({"status":"ok", likes});
        } catch (error) {
            res.status(500).json({ "status":"err", "message":  error.message});
        }
    }

    static async getLikedPosts(req, res) { //toate postarile la care un user a dat like
        const user_id = parseInt(req.query.user_id);
        try {
            const likedPosts = await likeServices.getLikedPosts(user_id);
            res.status(200).json({"status":"ok", likedPosts});
        } catch (error) {
            res.status(500).json({ "status":"err", "message":  error.message});
        }
    }

    static async getFromComment(req, res) { //toate like-urile unui comentariu
        const comment_id = parseInt(req.query.comment_id);
        try {
            const likes = await likeServices.getFromComment(comment_id);
            res.status(200).json({"status":"ok", likes});
        } catch (error) {
            res.status(500).json({ "status":"err", "message":  error.message});
        }
    }

    static async getLikedComments(req, res) { //toate comentariile la care un user a dat like
        const user_id = parseInt(req.query.user_id);
        try {
            const likedComments = await likeServices.getLikedComments(user_id);
            res.status(200).json({"status":"ok", likedComments});
        } catch (error) {
            res.status(500).json({ "status":"err", "message":  error.message});
        }
    }
}

module.exports = LikeController;