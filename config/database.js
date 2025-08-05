const mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI;

function connectDB(){
    mongoose.connect(connectionString).then(() => {
        console.log("MongoDB connected");
    }).catch((error) => {
        console.log("MongoDB connection error: ", error);
    });
}

module.exports = connectDB;
