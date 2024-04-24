const authenticateToken = require("../utils/JWT/JWTAuthentication");
const isAdmin = require("../utils/isAdmin"); 
const express = require("express");
const router = express.Router();
const adminController = require("./../controllers/adminController");
//permissions admin
router.patch("/admin/timeoutUser", authenticateToken, isAdmin, adminController.timeoutUser); 

router. patch("/admin/promoteUser",authenticateToken,isAdmin,adminController.promoteUser);

router. get("/reviewReport",authenticateToken,isAdmin,adminController.reviewReport);

router. post("/admin/sendWarning",authenticateToken,isAdmin,adminController.sendWarning);
router. delete("/admin/deleteAPost",authenticateToken,isAdmin,adminController.deletePost);

module.exports= router;