const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use(postRoutes);
app.use(commentRoutes);

module.exports = app;
