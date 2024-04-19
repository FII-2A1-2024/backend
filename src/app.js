const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");

app.use(postRoutes);

module.exports = app;
