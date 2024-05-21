const express = require("express");
const router = express.Router();
const commentController = require("./../controllers/commentController");
const { authenticateToken, refreshTokenCheck } = require('../utils/JWT/JWTAuthentication')

router.get("/comments", commentController.getAll);
router.post("/comments", authenticateToken, commentController.post);
router.put("/comments", commentController.put);
router.delete("/comments", commentController.delete);

module.exports = router;
