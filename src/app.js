const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const signUpRouter = require('./routes/signUp')
const jwtSecretHandler = require('./utils/JWT/JWTSecretGeneration')
const authenticateToken = require('./utils/JWT/JWTAuthentication')
const generateAccessToken = require('./utils/JWT/JWTGeneration')
const jwt = require('jsonwebtoken')


app
    .use(express.json())
    .use("/signup", signUpRouter)
    .use(postRoutes)
    .use(commentRoutes)
    

module.exports = app;
