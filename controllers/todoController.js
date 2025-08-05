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
            }).then(todo => {
                response.json(todo);
                user.todos.push(todo._id);
            });
        }catch(error){
            console.log(error);
            response.status(500).send("Ocurrió un problema al dar de alta la tarea.");
        }
    },
};

module.exports = todoController;
