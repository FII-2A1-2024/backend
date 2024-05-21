const express = require("express");
const router = express.Router();
const search = require("./../controllers/searchController");

router.get("/posts/search", search);

module.exports = router;
