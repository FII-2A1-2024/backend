const express = require("express");
const router = express.Router();
const postController = require("./../controllers/postController");

router.get("/posts", postController.get);
router.post("/posts", postController.post);
router.put("/posts", postController.put);
router.delete("/posts", postController.delete);

module.exports = router;
