"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    favourites: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'books'
        },
    ],
    cart: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'books'
        },
    ],
    order: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'order'
        },
    ],
}, { timestamps: true });
const userModel = (0, mongoose_1.model)('user', userSchema);
exports.default = userModel;
//# sourceMappingURL=user.js.map