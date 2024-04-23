const express = require('express')
const router = express.Router()
const signUpController = require('../controllers/signUpController')
const emailController = require('../controllers/emailController')


router
.get("/exists", (req, res) => {
    res.send({ data: "User exists" })
})

.get('/verify', async (req, res) => {
    emailController(req, res)
    // res.status(status).send(toSend)
})    
.post("/", (req, res) => {
    console.log("req: ", req.body)
    signUpController(req, res)
})
.get("/", (req, res) => {
    res.send({data : "No data yet"})
})
module.exports = router