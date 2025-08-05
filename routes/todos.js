const express = require('express');
const router = express.Router();

const createRequest = require("../requests/todo/createRequest");
const todoController = require('../controllers/todoController');
const updateRequest = require("../requests/todo/updateRequest");

router.post("/", createRequest, todoController.create);
router.put("/:id", updateRequest, todoController.update);

module.exports = router;
