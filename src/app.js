
const express = require("express");
const app = express();
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postFollowRoutes = require("./routes/postFollowRoutes");
const signUpRouter = require('./routes/signUp')
const jwtSecretHandler = require('./utils/JWT/JWTSecretGeneration')
const authenticateToken = require('./utils/JWT/JWTAuthentication')
const generateAccessToken = require('./utils/JWT/JWTGeneration')
const loginRouter = require("./routes/login");
const jwt = require('jsonwebtoken')
const optionsRouter = require('./routes/options')

const adminRoutes = require("./routes/Admin&UserRoutes/adminRoutes");
const isUser = require("./utils/Middleware/isUser");

const cors = require('cors')
const signUpRoutes = require('./routes/signUp')
const loginRoutes = require("./routes/loginRoutes"); 3
const optionsRoutes = require('./routes/optionsRoutes')

app.use(cors())

app
    .use(express.json())
    .use(signUpRoutes)
    .use(postRoutes)
    .use(loginRoutes)
    .use(resetPasswordRoutes)
    .use(commentRoutes)
    .use(optionsRoutes)
    .use(postFollowRoutes)
    .use(adminRoutes);
module.exports = app;