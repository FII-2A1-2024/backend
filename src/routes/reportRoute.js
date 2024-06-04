const authenticateToken = require(".././utils/JWT/JWTAuthentication");
const express = require("express");
const router = express.Router();
const {reportPost,reportComment} = require(".././controllers/reportController");

router.post("/posts/report",authenticateToken, reportPost);
router.post("/comments/report",authenticateToken, reportComment);

module.exports= router;