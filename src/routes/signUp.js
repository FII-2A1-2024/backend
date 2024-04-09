const express = require('express')
const router = express.Router()
const signUpController = require('../controllers/signUpController')
const userExistsInDb = require('../models/existsInDb')

router
.post("/", (req, res) => {
    signUpController(req, res)
})

.get("/", (req, res) => {
    res.send({data : "No data yet"})
})

.get("/exists", (req, res) => {
        res.send({ data: "User exists" })
    })

module.exports = router