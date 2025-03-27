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
exports.getBooksFromCart = exports.deleteBookFromCart = exports.addBookToCart = void 0;
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("../errorController/errorHandler");
dotenv_1.default.config();
const addBookToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const { bookId } = req.params;
        const userData = user_1.default.findById(id);
        const isBookInCart = (yield userData).cart.includes(new mongoose_1.default.Types.ObjectId(bookId));
        if (isBookInCart) {
            throw new errorHandler_1.AppError('Book is already in cart', 403);
        }
        yield user_1.default.findByIdAndUpdate(id, { $push: { cart: bookId } });
        res.status(200).json({ message: "Book Added to Cart" });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.addBookToCart = addBookToCart;
const deleteBookFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const { id } = req.body;
        const userData = yield user_1.default.findById(id);
        const isBookInCart = userData.cart.includes(new mongoose_1.default.Types.ObjectId(bookId));
        if (isBookInCart) {
            yield user_1.default.findByIdAndUpdate(id, { $pull: { cart: bookId } });
        }
        res.status(200).json({ message: "Book removed from cart" });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.deleteBookFromCart = deleteBookFromCart;
const getBooksFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.headers;
        const userData = yield user_1.default.findById(id).populate('cart');
        const booksInCart = userData.cart.reverse();
        res.status(200).json({
            status: "Success",
            data: booksInCart,
        });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getBooksFromCart = getBooksFromCart;
//# sourceMappingURL=cart.js.map