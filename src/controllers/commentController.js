const commentServices = require("./../services/commentServices");

class CommentController {
    static async get(req, res) {
        const id = parseInt(req.query.id);
        try {
            const post = await commentServices.get(id);
            res.status(200).json({ post });
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async post(req, res) {
        const { post_id, parent_id, author_id, description, votes} = req.query;
        console.log("id ul postari este: ", post_id);
        try {
            await commentServices.post(
                post_id,
                parent_id,
                author_id,
                description,
                votes
            );
            res.status(200).send("Post added to db");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async put(req, res) {
        const { id,description} =
            req.query;
        try {
            await commentServices.put(
                id,
                description,
            );
            res.status(200).send("Post updated in db");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
    static async delete(req, res) {
        const {id, post_id} = req.query;
        try{
            await commentServices.delete(
                id,
                post_id,
            );
            res.status(200).send("Comment deleted from db");
        } catch (error) {
            res.status(500).send("Error occured: " + error);
        }
    }
}

module.exports = CommentController;
