"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    },
    books: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'books'
        },
    ],
    status: {
        type: String,
        default: 'Order Placed',
        enum: ['Order Placed', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
}, { timestamps: true });
const orderModel = (0, mongoose_1.model)('order', orderSchema);
exports.default = orderModel;
//# sourceMappingURL=order.js.map