const express = require("express");
const router = express.Router();
const postController = require("./../controllers/postController");

router.get("/posts", postController.get);
router.get("/posts/all", postController.getAll);
router.post("/posts", postController.post);
router.put("/posts", postController.put);
router.delete("/posts", postController.delete);
router.delete("/posts/file", postController.deleteFile);

module.exports = router;
