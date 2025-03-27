"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getOrderHistory = exports.placeOrder = void 0;
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const order_1 = __importDefault(require("../models/order"));
const errorHandler_1 = require("../errorController/errorHandler");
dotenv_1.default.config();
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, order } = req.body;
        const user = yield user_1.default.findById(id);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const cartBookIds = user.cart.map(item => item.toString());
        const invalidBooks = yield order.filter(bookId => !cartBookIds.includes(bookId));
        if (invalidBooks.length > 0) {
            throw new errorHandler_1.AppError('Some books are not in your cart', 400, { invalidBooks });
        }
        const newOrder = yield order_1.default.create({ user: id, books: order });
        yield user_1.default.findByIdAndUpdate(id, {
            $push: { order: newOrder._id },
            $pull: { cart: { $in: order } }
        });
        res.status(201).json({
            status: "success",
            message: "Order Placed Successfully",
            orderId: newOrder._id
        });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.placeOrder = placeOrder;
const getOrderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.headers;
        const userData = yield user_1.default.findById(id).populate({
            path: "order",
            populate: { path: "books" },
        });
        const orderData = userData.order.reverse();
        res.status(200).json({
            status: "success",
            data: orderData,
        });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getOrderHistory = getOrderHistory;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield order_1.default.find().populate({
            path: "books",
        })
            .populate({
            path: "user",
            select: "-password",
        }).sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            data: userData,
        });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getAllOrders = getAllOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const user = yield user_1.default.findById(id);
        if (user && user.role === 'admin') {
            const { orderId } = req.params;
            yield order_1.default.findByIdAndUpdate(orderId, { status: req.body.status });
            res.status(200).json({
                status: "success",
                message: "Status updated successfully",
            });
            return;
        }
        else {
            throw new errorHandler_1.AppError('Not Authorized', 403);
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.js.map