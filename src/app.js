const express = require("express");
const app = express();
const resetPasswordRoutes = require("./routes/resetPassword");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postFollowRoutes = require("./routes/postFollowRoutes");
<<<<<<< HEAD
const signUpRouter = require('./routes/signUp')
const jwtSecretHandler = require('./utils/JWT/JWTSecretGeneration')
const authenticateToken = require('./utils/JWT/JWTAuthentication')
const generateAccessToken = require('./utils/JWT/JWTGeneration')
const loginRouter = require("./routes/login");
const jwt = require('jsonwebtoken')
const adminRoutes = require("./routes/Admin&UserRoutes/adminRoutes");
const isUser = require("./utils/Middleware/isUser");

app
    .use(express.json())
    .use("/signup", signUpRouter)
    .use("/login", loginRouter)
    .use("/resetPass", resetPassword)
    //we need token here, also the path remains the same, however i put the prefix like this 
    //for the isUser to function correctly 
    .use("/posts",authenticateToken,isUser,postRoutes) 
    .use("/comments",authenticateToken,isUser,commentRoutes)
    .use(adminRoutes) 
=======

const cors = require('cors')
const signUpRoutes = require('./routes/signUp')
const loginRoutes = require("./routes/login");
const optionsRoutes = require('./routes/options')

app.use(cors())

app
    .use(express.json())
    .use(signUpRoutes)
    .use(postRoutes)
    .use(loginRoutes)
    .use(resetPasswordRoutes)
    .use(commentRoutes)
    .use(optionsRoutes)
    .use(postFollowRoutes);
    
>>>>>>> cd13b46b7b0f7067c424317fdeb6ed68e8683143
module.exports = app;
