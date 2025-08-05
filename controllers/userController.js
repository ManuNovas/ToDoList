const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    generateToken: function(user){
        return jwt.sign({
            username: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
    },
    create: function(request, response){
        const {name, email, password} = request.body;
        bcrypt.hash(password, 10).then(hashedPassword => {
            User.create([{
                name: name,
                email: email,
                password: hashedPassword,
            }]).then(user => {
                response.json({
                    token: userController.generateToken(user),
                });
            }).catch(error => {
                console.log(error);
                response.status(500).send("Ocurrió un error al crear al usuario.");
            });
        }).catch(error => {
            console.log(error);
            response.status(500).send("Ocurrió un error al crear al usuario.");
        });
    },
};

module.exports = userController;
