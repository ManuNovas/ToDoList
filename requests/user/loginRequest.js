const { body } = require('express-validator');
const User = require('../../models/User');
const checkValidation = require('../../middleware/checkValidation');

const loginRequest = [
    body("email")
        .trim()
        .notEmpty().withMessage("El email es obligatorio.")
        .isLength({max: 128}).withMessage("El email no puede ser mayor a 128 caracteres.")
        .custom(async (email) => {
            const user = User.findOne({
                email: email,
            });
            if(!user){
                throw new Error("El email no se encuentra registrado.");
            }
            return true;
        }),
    body("password")
        .trim()
        .notEmpty().withMessage("La contraseña es obligatoria.")
        .isLength({
            min: 8,
            max: 64,
        }).withMessage("La contraseña debe tener entre 8 y 64 caracteres."),
    checkValidation,
];

module.exports = loginRequest;
