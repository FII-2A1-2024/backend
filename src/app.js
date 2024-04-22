const express = require("express");
const app = express();
const resetPassword = require("./routes/resetPassword");

app.use(express.json()).use("/resetPass", resetPassword);

module.exports = app;
