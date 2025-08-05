const express = require('express');
const router = express.Router();
const createRequest = require("../requests/user/createRequest");
const loginRequest = require("../requests/user/loginRequest");
const userController = require("../controllers/userController");

router.post("/register", createRequest, userController.create);
router.post("/login", loginRequest, userController.login);

module.exports = router;
