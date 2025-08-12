const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    generateToken: function(userData, expiresIn = "1h"){
        return jwt.sign({
            username: userData,
        }, process.env.JWT_SECRET, {
            expiresIn: expiresIn,
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
                        token: userController.generateToken(user[0].email),
                        refreshToken: userController.generateToken(user[0]._id, "1d"),
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
                                token: userController.generateToken(user.email),
                                refreshToken: userController.generateToken(user._id, "1d"),
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
    },
    refreshToken: function(request, response){
        const user = request.user;
        try{
            response.json({
                token: userController.generateToken(user.email),
                refreshToken: userController.generateToken(user._id, "1d"),
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un error al refrescar el token.");
        }
    },
};

module.exports = userController;
