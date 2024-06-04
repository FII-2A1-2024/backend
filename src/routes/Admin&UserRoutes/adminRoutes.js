const authenticateToken = require("../../utils/JWT/JWTAuthentication");
const isAdmin = require("../../utils/Middleware/isAdmin"); 
const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
//permissions admin

router.patch("/timeoutUser", authenticateToken, isAdmin, adminController.timeoutUser); 

router.patch("/promoteToAdmin", authenticateToken, isAdmin, adminController.promoteToAdmin);

router.patch("/promoteToTeacher", authenticateToken, isAdmin, adminController.promoteToTeacher)
router.delete("/teachers", authenticateToken, isAdmin, adminController.deleteTeacher)
router.post("/teachers/subjects/add", authenticateToken, isAdmin, adminController.addSubjectToTeacher)

router.get("/reports", authenticateToken,isAdmin, adminController.viewReports);

router.patch("/reports/posts", authenticateToken,isAdmin, adminController.evaluateReport); //reporturi postari

router.patch("/reports/comments", authenticateToken,isAdmin, adminController.evaluateCommentReport);//reporturi comments 
 
router.post("/warning", authenticateToken,isAdmin, adminController.sendWarning);
router.delete("/posts/deleteByAdmin", authenticateToken,isAdmin, adminController.deletePost);

module.exports= router;