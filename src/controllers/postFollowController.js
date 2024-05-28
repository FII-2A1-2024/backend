const postFollowServices = require("./../services/postFollowServices");

class PostFollowController {
    static async getByUser(req, res) {
        const user_id = parseInt(req.query.id);
        try {
            const postFollow = await postFollowServices.getByUser(user_id);
            res.status(200).json({ "status":"ok", postFollow });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async getByPost(req, res) {
        const post_id = parseInt(req.query.id);
        try {
            const postFollow = await postFollowServices.getByPost(post_id);
            res.status(200).json({ "status":"ok", postFollow });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async post(req, res) {
        const { user_id, post_id } = req.body;
        try {
            const postFollow = await postFollowServices.post(
                user_id,
                post_id
            );
            res.status(200).json({ "status":"ok", postFollow });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async delete(req, res) {
        const user_id = parseInt(req.query.user_id);
        const post_id = parseInt(req.query.post_id);
        try {
            await postFollowServices.delete(user_id, post_id);
            res.status(200).json({ "status":"ok", "message":"post follow deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async deleteByUser(req, res) {
        const user_id = parseInt(req.query.id);
        try {
            await postFollowServices.deleteByUser(user_id);
            res.status(200).json({ "status":"ok", "message":"post follow deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async deleteByPost(req, res) {
        const post_id = parseInt(req.query.id);
        try {
            await postFollowServices.deleteByPost(post_id);
            res.status(200).json({ "status":"ok", "message":"post follow deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
}

module.exports = PostFollowController;
