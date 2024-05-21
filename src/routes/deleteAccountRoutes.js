const express = require("express");
const router = express.Router();

const { authenticateToken, refreshTokenCheck } = require("../utils/JWT/JWTAuthentication");
const optionsController = require('../controllers/optionsController');
const accountDeletionController = require('../controllers/accountDeletionController');

router
    .get("/deleteAccount", refreshTokenCheck, authenticateToken,optionsController.sendDeletionMail)
    .get("/deleteAccount/verify", accountDeletionController.deleteAccount);

module.exports = router;