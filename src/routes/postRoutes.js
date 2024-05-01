const express = require("express");
const router = express.Router();
const postController = require("./../controllers/postController");

router.get("/", postController.get);
router.get("/all", postController.getAll);
router.post("/", postController.post);
router.put("/", postController.put);
router.delete("/", postController.delete);

module.exports = router;
