"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    likers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.model('Post', postSchema);
