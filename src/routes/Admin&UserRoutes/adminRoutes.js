const authenticateToken = require("../../utils/JWT/JWTAuthentication");
const isAdmin = require("../../utils/Middleware/isAdmin"); 
const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
//permissions admin

router.patch("/admin/timeoutUser", authenticateToken, isAdmin, adminController.timeoutUser); 

router.patch("/admin/promoteToAdmin",authenticateToken, isAdmin, adminController.promoteToAdmin);

router.patch("/admin/promoteToTeacher", authenticateToken, isAdmin, adminController.promoteToTeacher)

router.get("/admin/viewReports", authenticateToken,isAdmin, adminController.viewReports);

router.post("/admin/sendWarning", authenticateToken,isAdmin, adminController.sendWarning);

router.delete("/admin/deletePost", authenticateToken,isAdmin, adminController.deletePost);

module.exports= router;