const postServices = require("./../services/postServices");

class PostController {
    static async get(req, res) {
        const id = parseInt(req.query.id);
        try {
            const post = await postServices.get(id);
            res.status(200).json({ "status":"ok", post });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const posts = await postServices.getAll();
            res.status(200).json({ "status":"ok", posts });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async post(req, res) {
        const { author_id, title, description, votes, category } = req.body;
        try {
            await postServices.post(
                author_id,
                title,
                description,
                votes,
                category
            );
            res.status(200).json({ "status":"ok", "message":"post created successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async put(req, res) {
        const { id, title, description, votes } =
            req.body;
        try {
            if (title !== undefined && description == undefined && votes == undefined) {
                await postServices.putTitle(id, title);
            } else if (description !== undefined && title == undefined && votes == undefined) {
                await postServices.putDescription(id, description);
            } else if (votes !== undefined && title == undefined && description == undefined) {
                await postServices.putVotes(id, votes);
            }
            res.status(200).json({ "status":"ok", "message":"post updated successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
    static async delete(req, res) {
        const id = parseInt(req.query.id);
        try {
            await postServices.delete(id);
            res.status(200).json({ "status":"ok", "message":"post deleted successfully" });
        } catch (error) {
            res.status(500).json({ "status":"err", "message": error.message });
        }
    }
}

module.exports = PostController;
