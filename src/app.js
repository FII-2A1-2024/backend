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
const cookieParser = require('cookie-parser');
const optionsRoutes = require("./routes/optionsRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const deleteAccountRoutes = require("./routes/deleteAccountRoutes");
const searchRoute = require("./routes/searchRoute");
const socketRoutes = require("./routes/socketRoutes");
const jwt = require('jsonwebtoken')
const { authenticateToken,isUserTimedOut } = require("./utils/JWT/JWTAuthentication");

app.use(cors({ origin: "*" }));
app.use(cookieParser());

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
	.use(socketRoutes)
	.get('/protected', authenticateToken, isUserTimedOut, (req, res) => {
		const token = req.cookies.accessToken;
		const decodedTOken = jwt.decode(token);
		console.log(decodedTOken)
		const user = decodedTOken.user;
		console.log(user)
		res.status(200).json({ message: `Hello this is user ${user}` });
	});
module.exports = app;
