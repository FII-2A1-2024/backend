const express = require("express");
const router = express.Router();

const authenticateToken = require("../utils/JWT/JWTAuthentication");
const optionsController = require('../controllers/optionsController');
const accountDeletionController = require('../controllers/accountDeletionController');

router
    .get("/deleteAccount", authenticateToken,optionsController.sendDeletionMail)
    .get("/deleteAccount/verify", accountDeletionController.deleteAccount);

module.exports = router;