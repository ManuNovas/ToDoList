const jwt = require("jsonwebtoken");
const User = require("../models/User");

function checkToken(request, response, next){
    const header = request.header("Authorization") || "";
    const token = header.replace("Bearer ", "");
    let payload;
    try{
        payload = jwt.verify(token, process.env.JWT_SECRET);
        User.findOne({
            email: payload.username,
        }).then(user => {
            if(user){
                request.user = user;
                next();
            }else{
                response.status(401).send("El token no es válido.");
            }
        });
    }catch(error){
        console.log(error);
        return response.status(401).send("No estás autorizado para acceder a esta ruta.");
    }
}

module.exports = checkToken;
