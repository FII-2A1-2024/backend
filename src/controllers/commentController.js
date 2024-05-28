const commentServices = require("./../services/commentServices");

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
        const { post_id, parent_id, author_id, description, votes } = req.body;
        try {
            const comment_id = await commentServices.post(
                post_id,
                parent_id,
                author_id,
                description,
                votes
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
