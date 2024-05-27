const authenticateToken = require(".././utils/JWT/JWTAuthentication");
const express = require("express");
const router = express.Router();
const report = require(".././controllers/reportController");

router.post("/posts/report",authenticateToken, report);

module.exports= router;