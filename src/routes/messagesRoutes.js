const express = require("express");
const router = express.Router();
const messagesController = require("./../controllers/messagesController");

router.post("/messages", messagesController.post);

module.exports = router;
