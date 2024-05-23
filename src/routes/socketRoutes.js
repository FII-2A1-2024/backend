const express = require("express");
const router = express.Router();
const socketController = require("../controllers/socketController");
const httptCodes = require("../config/returnCodes")

router
    .get("/socket",
        socketController.get
    )

module.exports = router;
