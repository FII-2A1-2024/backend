const authenticateToken = require("../../utils/JWT/JWTAuthentication");
const isUser= require("../../utils/Middleware/isUser"); 
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/Admin&UserController/userController");
//permissions user
router.patch("/user/something", authenticateToken, isUser,userController.timeoutUser); 

router. patch("/user/something2",authenticateToken,isUser,userController.promoteUser);

router. get("/user/something3",authenticateToken,isUser,userController.reviewReport);

router. post("/user/something4",authenticateToken,isUser,userController.sendWarning);
router. delete("/user/something5",authenticateToken,isUser,userController.deletePost);

module.exports= router;