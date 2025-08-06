const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        maxLength: 64,
    },
    description: {
        type: String,
        required: true,
        maxLength: 128,
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            return {
                id: ret._id,
                title: ret.title,
                description: ret.description,
            }
        }
    }
});

module.exports = mongoose.model("Todo", todoSchema);
