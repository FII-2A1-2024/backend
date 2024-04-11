const express = require('express')
const app = express()

const signUpRouter = require('./routes/signUp')

app
    .use(express.json())
    .use("/signup", signUpRouter)

module.exports = app