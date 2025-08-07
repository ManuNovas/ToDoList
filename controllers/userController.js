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
        try{
            bcrypt.hash(password, 10).then(hashedPassword => {
                User.create([{
                    name: name,
                    email: email,
                    password: hashedPassword,
                }], {
                    new: true,
                }).then(user => {
                    response.json({
                        token: userController.generateToken(user[0]),
                    });
                });
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un error al crear al usuario.");
        }
    },
    login: function(request, response){
        const {email, password} = request.body;
        try{
            User.findOne({
                email: email,
            }, null, {
                new: true,
            }).then(user => {
                if(user){
                    bcrypt.compare(password, user.password).then(match => {
                        if(match){
                            response.json({
                                token: userController.generateToken(user),
                            });
                        }else{
                            response.status(401).send("Las credenciales no son correctas.");
                        }
                    });
                }else{
                    response.status(400).send("El usuario no está registrado.");
                }
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un problema al iniciar sesión");
        }
    }
};

module.exports = userController;
