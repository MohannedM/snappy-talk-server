"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        index: true,
    },
    password: {
        required: true,
        type: String,
    },
    postsCreated: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
    ],
    postsLiked: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
    ],
});
exports.default = mongoose_1.model('User', userSchema);
