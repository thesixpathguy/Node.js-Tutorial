const express = require("express");
const router = express.Router();
const register = require("../controllers/refreshTokenController");

router.get("/", register.handleRefreshToken);

module.exports = router;
