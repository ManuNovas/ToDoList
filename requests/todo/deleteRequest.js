const {param} = require("express-validator");
const checkValidation = require("../../middleware/checkValidation");
const Todo = require("../../models/todo");

const deleteRequest = [
    param("id")
        .notEmpty().withMessage("El id es obligatorio.")
        .custom(async (id) => {
            const todo = await Todo.findById(id);
            if(!todo){
                throw new Error("La tarea no existe.");
            }
            return true;
        }),
    checkValidation,
];

module.exports = deleteRequest;
