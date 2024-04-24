const authenticateToken = require("../utils/JWT/JWTAuthentication");
const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
//permissions user
router.patch("/timeoutUser", authenticateToken, userController.timeoutUser); 

router. patch("/promoteUser",authenticateToken,userController.promoteUser);

router. get("/reviewReport",authenticateToken,userController.reviewReport);

router. post("/sendWarning",authenticateToken,userController.sendWarning);
router. delete("/deleteAPost",authenticateToken,userController.deletePost);

module.exports= router;