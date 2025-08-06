const express = require('express');
const router = express.Router();

const createRequest = require("../requests/todo/createRequest");
const todoController = require('../controllers/todoController');
const updateRequest = require("../requests/todo/updateRequest");
const deleteRequest = require("../requests/todo/deleteRequest");

router.post("/", createRequest, todoController.create);
router.put("/:id", updateRequest, todoController.update);
router.delete("/:id", deleteRequest, todoController.delete);
router.get("/", todoController.list);

module.exports = router;
