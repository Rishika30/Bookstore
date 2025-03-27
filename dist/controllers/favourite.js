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
exports.getBooksFromFav = exports.deleteBookFromFav = exports.addBookToFavourites = void 0;
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("../errorController/errorHandler");
dotenv_1.default.config();
const addBookToFavourites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const { bookId } = req.params;
        const userData = user_1.default.findById(id);
        const isFavouriteBook = (yield userData).favourites.includes(new mongoose_1.default.Types.ObjectId(bookId));
        if (isFavouriteBook) {
            throw new errorHandler_1.AppError('Book is already in favourites', 409);
        }
        yield user_1.default.findByIdAndUpdate(id, { $push: { favourites: bookId } });
        res.status(201).json({ message: "Book Added to Fvaourites" });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.addBookToFavourites = addBookToFavourites;
const deleteBookFromFav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const { id } = req.body;
        const userData = yield user_1.default.findById(id);
        const isFavouriteBook = userData.favourites.includes(new mongoose_1.default.Types.ObjectId(bookId));
        if (isFavouriteBook) {
            yield user_1.default.findByIdAndUpdate(id, { $pull: { favourites: bookId } });
        }
        res.status(200).json({ message: "Book removed from favourites" });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.deleteBookFromFav = deleteBookFromFav;
const getBooksFromFav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.headers;
        const userData = yield user_1.default.findById(id).populate('favourites');
        const favouriteBooks = userData.favourites;
        res.status(200).json({
            status: "Success",
            data: favouriteBooks,
        });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getBooksFromFav = getBooksFromFav;
//# sourceMappingURL=favourite.js.map