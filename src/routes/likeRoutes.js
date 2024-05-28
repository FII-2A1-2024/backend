const express = require("express");
const router = express.Router();
const likeController = require("./../controllers/likeController");

router.get("/postLikes", likeController.getFromPost);
router.get("/likedPosts", likeController.getLikedPosts);
router.get("/commentLikes", likeController.getFromComment);
router.get("/likedComments", likeController.getLikedComments);

module.exports = router;
