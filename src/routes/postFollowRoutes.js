const express = require("express");
const router = express.Router();
const postFollowController = require("./../controllers/postFollowController");

router.get("/postFollow/user", postFollowController.getByUser);
router.get("/postFollow/post", postFollowController.getByPost);
router.post("/postFollow", postFollowController.post);
router.delete("/postFollow/user", postFollowController.deleteByUser);
router.delete("/postFollow/post", postFollowController.deleteByPost);

module.exports = router;
