const express = require("express");
const app = express();
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postFollowRoutes = require("./routes/postFollowRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

const adminRoutes = require("./routes/Admin&UserRoutes/adminRoutes");
const isUser = require("./utils/Middleware/isUser");

const cors = require("cors");
const signUpRoutes = require("./routes/signUp");
const loginRoutes = require("./routes/loginRoutes");
const optionsRoutes = require("./routes/optionsRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const deleteAccountRoutes = require("./routes/deleteAccountRoutes");
const searchRoute = require("./routes/searchRoute");
const socketRoutes = require("./routes/socketRoutes");

app.use(cors({ origin: "*" }));

app
	.use(express.json())
	.use(signUpRoutes)
	.use(postRoutes)
	.use(loginRoutes)
	.use(resetPasswordRoutes)
	.use(commentRoutes)
	.use(optionsRoutes)
	.use(postFollowRoutes)
	.use(messagesRoutes)
	.use(adminRoutes)
	.use(logoutRoutes)
	.use(deleteAccountRoutes)
	.use(searchRoute)
	.use(socketRoutes);
module.exports = app;
