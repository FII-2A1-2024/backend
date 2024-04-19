const express = require("express");
const app = express();

const loginRouter = require("./routes/login");

app.use(express.json()).use("/login", loginRouter);

module.exports = app;
