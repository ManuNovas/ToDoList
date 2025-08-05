const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 128,
    },
    email: {
        type: String,
        required: true,
        maxLength: 128,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        maxLength: 128,
    },
    todos: [{
        type: Schema.Types.ObjectId,
        ref: "Todo"
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
