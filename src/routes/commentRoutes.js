const express = require("express");
const router = express.Router();
const commentController = require("./../controllers/commentController");

router.get("/comments", commentController.get);
router.post("/comments", commentController.post);
router.put("/comments", commentController.put);
router.delete("/comments", commentController.delete);

module.exports = router;
