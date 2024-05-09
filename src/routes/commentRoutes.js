const express = require("express");
const router = express.Router();
const commentController = require("./../controllers/commentController");
const authenticateToken = require('../utils/JWT/JWTAuthentication');

router.get("/comments", commentController.getAll);
router.post("/comments", commentController.post);
router.put("/comments", commentController.put);
router.delete("/comments", commentController.delete);
router.get("/comments/protected", authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to comments!' });
})

module.exports = router;
