const express = require("express");
const router = express.Router();
const register = require("../controllers/logoutController");

router.get("/", register.handleLogout);

module.exports = router;
