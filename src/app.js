const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const signUpRouter = require('./routes/signUp')
const jwtSecretHandler = require('./utils/JWT/JWTSecretGeneration')
const authenticateToken = require('./utils/JWT/JWTAuthentication')
const generateAccessToken = require('./utils/JWT/JWTGeneration')
<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const adminRoutes = require("./routes/adminRoutes");
=======
const loginRouter = require("./routes/login");
const jwt = require('jsonwebtoken')
>>>>>>> fe97d095fb2329399564d0c78601660fbb4a9c2d


app
    .use(express.json())
    .use("/signup", signUpRouter)
    .use(postRoutes)
<<<<<<< HEAD
    .use(adminRoutes)

=======
    .use("/login", loginRouter)
    .use(commentRoutes);
    
>>>>>>> fe97d095fb2329399564d0c78601660fbb4a9c2d

module.exports = app;
