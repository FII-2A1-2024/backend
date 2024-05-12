const express = require('express')
const router = express.Router()
const optionsController = require('../controllers/optionsController')

router
.get("/", (req, res) => {
    res.send({data: "User will add their secondary email"})
})
.post("/options/addEmail", optionsController.addEmail)

module.exports = router