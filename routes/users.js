const express = require('express');
const router = express.Router();
const createRequest = require("../requests/user/createRequest");
const loginRequest = require("../requests/user/loginRequest");
const checkRefreshToken = require("../middleware/checkRefreshToken");
const userController = require("../controllers/userController");

router.post("/register", createRequest, userController.create);
router.post("/login", loginRequest, userController.login);
router.post("/refresh-token", checkRefreshToken, userController.refreshToken);

module.exports = router;
