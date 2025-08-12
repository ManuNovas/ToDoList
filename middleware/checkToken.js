const jwt = require("jsonwebtoken");
const User = require("../models/user");

function checkToken(request, response, next){
    const header = request.header("Authorization") || "";
    const token = header.replace("Bearer ", "");
    let payload;
    try{
        payload = jwt.verify(token, process.env.JWT_SECRET);
        User.findOne({
            email: payload.username,
        }, null, {
            new: true,
        }).then(user => {
            if(user){
                request.user = user;
                next();
            }else{
                response.status(404).send("El usuario no existe.");
            }
        }).catch(error => {
            response.status(400).send("El token no es válido");
        });
    }catch(error){
        console.log(error);
        response.status(401).send("No estás autorizado para acceder a esta ruta.");
    }
}

module.exports = checkToken;
