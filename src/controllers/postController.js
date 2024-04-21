const postServices = require("./../services/postServices");

class PostController {
    static async get(req, res) {
        const id = parseInt(req.query.id);
        try {
            const post = await postServices.get(id);
            res.status(200).json({ post });
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async getAll(req, res) {
        try {
            const posts = await postServices.getAll();
            res.status(200).json({ posts });
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async post(req, res) {
        const { author_id, title, description, votes } = req.query;
        try {
            await postServices.post(
                author_id,
                title,
                description,
                votes
            );
            res.status(200).send("Post added to db");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async put(req, res) {
        const { id, author_id, title, description, votes } =
            req.query;
        try {
            await postServices.put(
                id,
                author_id,
                title,
                description,
                votes
            );
            res.status(200).send("Post updated in db");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async delete(req, res) {
        const id = parseInt(req.query.id);
        try {
            await postServices.delete(id);
            res.status(200).send("Post deleted from Db");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
}

module.exports = PostController;
