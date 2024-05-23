const express = require("express");
const router = express.Router();
const socketController = require("../controllers/socketController");

router.get("/socket/:id", socketController.get);

module.exports = router;
