const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const signUpRouter = require('./routes/signUp')


app
    .use(express.json())
    .use("/signup", signUpRouter)
    .use(postRoutes)


module.exports = app;

