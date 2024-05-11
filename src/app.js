const express = require("express");
const app = express();
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postFollowRoutes = require("./routes/postFollowRoutes");

const adminRoutes = require("./routes/Admin&UserRoutes/adminRoutes");
const isUser = require("./utils/Middleware/isUser");


const cors = require('cors')
const signUpRoutes = require('./routes/signUp')
const loginRoutes = require("./routes/login");
const optionsRoutes = require('./routes/optionsRoutes')
const logoutRoutes = require('./routes/logoutRoutes');
const deleteAccountRoutes = require('./routes/deleteAccountRoutes')



app.use(cors());

app
    .use(express.json())
    .use(signUpRoutes)
    .use(postRoutes)
    .use(loginRoutes)
    .use(resetPasswordRoutes)
    .use(commentRoutes)
    .use(optionsRoutes)
    .use(postFollowRoutes)
    .use(adminRoutes)
    .use(logoutRoutes)
    //de invalidat jwt-ul
    .use(deleteAccountRoutes);
module.exports = app;

