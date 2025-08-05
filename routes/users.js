const express = require('express');
const router = express.Router();
const createRequest = require("../requests/user/createRequest");
const userController = require("../controllers/userController");

router.post("/register", createRequest, userController.create);

module.exports = router;
