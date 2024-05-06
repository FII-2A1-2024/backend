const express = require('express')
const router = express.Router()
const signUpController = require('../controllers/signUpController')
const emailController = require('../controllers/emailController')


router
.get("/exists", (req, res) => {
    res.send({ data: "User exists" })
})

.get('/signup/verify', async (req, res) => {
    emailController(req, res)
    // res.status(status).send(toSend)
})    
.post("/signup", (req, res) => {
    console.log("req: ", req.body)
    signUpController(req, res)
})
.get("/", (req, res) => {
    res.send({data : "No data yet"}).status(200)
    console.log("Am primit req");
})
module.exports = router