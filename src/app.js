const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const signUpRouter = require('./routes/signUp')
const jwtSecretHandler = require('./utils/JWT/JWTSecretGeneration')
const authenticateToken = require('./utils/JWT/JWTAuthentication')
const generateAccessToken = require('./utils/JWT/JWTGeneration')
const loginRouter = require("./routes/login");
const jwt = require('jsonwebtoken')
const adminRoutes = require("./routes/adminRoutes");


app
    .use(express.json())
    .use("/signup", signUpRouter)
    .use(postRoutes)
    .use("/login", loginRouter)
    .use(commentRoutes)
    .use(adminRoutes)

module.exports = app;
