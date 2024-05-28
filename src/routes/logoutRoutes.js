const express = require('express')
const OptionsController = require('../controllers/optionsController');

const authenticateToken = require('../utils/JWT/JWTAuthentication')
const router = express.Router()

router
    .get("/", (req, res) => {
        res.send({ data: "User will add their secondary email" })
    })
    .post("/logout", authenticateToken,OptionsController.logoutUser);

module.exports = router