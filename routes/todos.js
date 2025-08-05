const express = require('express');
const router = express.Router();

const createRequest = require("../requests/todo/createRequest");
const todoController = require('../controllers/todoController');

router.post("/", createRequest, todoController.create);

module.exports = router;
