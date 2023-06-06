const express = require("express");
const router = express.Router();
const register = require("../controllers/registerController");

router.post("/", register.handleNewUser);

module.exports = router;
