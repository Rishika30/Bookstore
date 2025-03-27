"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooksSchema = exports.addBookSchema = exports.loginUserSchema = exports.registerUserSchema = exports.updateOrderStatusSchema = exports.placeOrderSchema = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        next();
    };
};
exports.validateRequest = validateRequest;
// Order Schemas
exports.placeOrderSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    order: joi_1.default.array().items(joi_1.default.string()).min(1).required()
});
exports.updateOrderStatusSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    status: joi_1.default.string().valid('Order Placed', 'Out for Delivery', 'Delivered', 'Cancelled').required()
});
// User Schemas
exports.registerUserSchema = joi_1.default.object({
    username: joi_1.default.string().min(4).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(5).required(),
    address: joi_1.default.string().required()
});
exports.loginUserSchema = joi_1.default.object({
    username: joi_1.default.string().min(4).required(),
    password: joi_1.default.string().required()
});
// Book Schemas
exports.addBookSchema = joi_1.default.object({
    url: joi_1.default.string().uri().required(),
    title: joi_1.default.string().required(),
    author: joi_1.default.string().required(),
    price: joi_1.default.number().positive().required(),
    description: joi_1.default.string().required(),
    language: joi_1.default.string().required()
});
exports.getBooksSchema = joi_1.default.object({
    cursor: joi_1.default.string().optional(),
    limit: joi_1.default.number().integer().min(1).default(10),
});
//# sourceMappingURL=validator.js.map