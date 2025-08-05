const {body, param} = require('express-validator');
const checkValidation = require('../../middleware/checkValidation');
const Todo = require("../../models/todo");

const updateRequest = [
    param("id")
        .notEmpty().withMessage("El id es obligatorio.")
        .custom(async (id) => {
            const todo = await Todo.findById(id);
            if(!todo){
                throw new Error("La tarea no existe.")
            }
            return true;
        }),
    body("title")
        .trim()
        .notEmpty().withMessage("El título es obligatorio.")
        .isLength({
            max: 64
        }).withMessage("El título no puede ser mayor a 64 caracteres."),
    body("description")
        .trim()
        .notEmpty().withMessage("La descripción es obligatoria.")
        .isLength({
            max: 128
        }).withMessage("La descripción no puede ser mayor a 128 caracteres."),
    checkValidation,
];

module.exports = updateRequest;
