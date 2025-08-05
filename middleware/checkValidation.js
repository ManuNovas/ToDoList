const { validationResult } = require("express-validator");

const checkValidation = (request, response, next) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({
            errors: errors.array()
        });
    }
    next();
}

module.exports = checkValidation;
