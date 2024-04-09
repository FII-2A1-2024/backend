class PostController {
    static get(req, res) {
        const id = req.id;
        res.status(200).send("Post got from db");
    }
    static post(req, res) {
        const id = req.id;
        res.status(200).send("Post added in db");
    }
    static put(req, res) {
        const id = req.id;
        res.status(200).send("Post modified in db");
    }
    static delete(req, res) {
        const id = req.id;
        res.status(200).send("Post deleted from db");
    }
}

module.exports = PostController;
