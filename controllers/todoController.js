const Todo = require("../models/todo");

const todoController = {
    create: function(request, response){
        const user = request.user;
        const {title, description} = request.body;
        try{
            Todo.create([{
                user: user._id,
                title: title,
                description: description,
            }], {
                aggregateErrors: true,
            }).then(todos => {
                response.json(todos[0]);
                user.todos.push(todos[0]._id);
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un problema al dar de alta la tarea.");
        }
    },
    update: function(request, response){
        const user = request.user;
        const {id} = request.params;
        const {title, description} = request.body;
        try{
            Todo.findOneAndUpdate({
                _id: id,
                user: user._id,
            }, {
                title: title,
                description: description
            }, {
                new: true,
            }).then(todo => {
                if(todo){
                    response.json(todo);
                }else{
                    response.status(404).send("La tarea no existe.");
                }
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un error al actualizar la tarea.");
        }
    },
    delete: function(request, response){
        const user = request.user;
        const {id} = request.params;
        try{
            Todo.findOneAndDelete({
                _id: id,
                user: user._id,
            }, {
                new: true,
            }).then(todo => {
                if(todo){
                    response.status(204).json(todo);
                }else{
                    response.status(404).send("La tarea no existe.");
                }
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un error al eliminar la tarea.");
        }
    },
    list: function(request, response){
        const user = request.user;
        const page = parseInt(request.query.page || 1);
        const limit = parseInt(request.query.limit || 10);
        const skip = (page - 1) * limit;
        try{
            Todo.find({
                user: user._id,
            }).limit(limit).skip(skip).then(todos => {
                if(todos.length > 0){
                    Todo.countDocuments({
                        user: user._id,
                    }).then(total => {
                        response.json({
                            "data": todos,
                            "page": page,
                            "limit": limit,
                            "total": total,
                        });
                    })
                }else{
                    response.status(404).send("No hay tareas.");
                }
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un error al listar las tareas.");
        }
    }
};

module.exports = todoController;
