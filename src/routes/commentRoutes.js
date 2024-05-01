const express = require("express");
const router = express.Router();
const commentController = require("./../controllers/commentController");

router.get("/", commentController.getAll);
router.post("/", commentController.post);
router.put("/", commentController.put);
router.delete("/", commentController.delete);

module.exports = router;
