const express = require("express");
const router = express.Router();
const socketController = require("../controllers/socketController");
const authenticateToken=require('../utils/JWT/JWTAuthentication')
const {deleteLoggedUser,addLoggedUser} = require("../controllers/readdSocketController");

router.get("/socket/:id", socketController.get);

router.delete("/socket/delete", authenticateToken,deleteLoggedUser);
router.post("/socket/add",authenticateToken,addLoggedUser)

module.exports = router;
