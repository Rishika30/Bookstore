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
exports.getBookById = exports.getRecentBooks = exports.getAllBooks = exports.deleteBook = exports.updateBook = exports.addBook = void 0;
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_1 = __importDefault(require("../models/book"));
const errorHandler_1 = require("../errorController/errorHandler");
const app_1 = require("../app");
dotenv_1.default.config();
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findById(id);
        if (user && user.role === 'admin') {
            const { url, title, author, price, description, language } = req.body;
            yield book_1.default.create({ url, title, author, price, description, language });
            res.status(201).json({ message: "Added book successfully" });
            return;
        }
        throw new errorHandler_1.AppError('Not Authorized', 403);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.addBook = addBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findById(id);
        if (user && user.role === 'admin') {
            const { bookId } = req.query;
            const updates = req.body;
            const updatedBook = yield book_1.default.findByIdAndUpdate(bookId, updates, { new: true, runValidators: true });
            if (!updatedBook) {
                throw new errorHandler_1.AppError('Book not found', 404);
            }
            res.status(200).json({
                message: "Updated book successfully",
                book: updatedBook,
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
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findById(id);
        if (user && user.role === 'admin') {
            const { bookId } = req.query;
            yield book_1.default.findByIdAndDelete(bookId);
            res.status(200).json({ message: "Book Deleted Successfully" });
            return;
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.deleteBook = deleteBook;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedQuery = {
            cursor: req.query.cursor,
            limit: parseInt(req.query.limit, 10) | 10,
        };
        const cacheKey = `books:cursor:${validatedQuery.cursor || "null"}:limit:${validatedQuery.limit}`;
        const cachedBooks = yield app_1.redisClient.get(cacheKey);
        if (cachedBooks) {
            res.json(JSON.parse(cachedBooks));
            return;
        }
        const query = validatedQuery.cursor ? { _id: { $gt: validatedQuery.cursor } } : {};
        const books = yield book_1.default.find(query)
            .limit(validatedQuery.limit + 1)
            .sort({ _id: 1 });
        const hasNextPage = books.length > validatedQuery.limit;
        if (hasNextPage)
            books.pop();
        const response = {
            books,
            pageInfo: {
                hasNextPage,
                endCursor: hasNextPage ? books[books.length - 1]._id : null,
            },
        };
        yield app_1.redisClient.set(cacheKey, JSON.stringify(response), {
            EX: 86400,
        });
        res.json(response);
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getAllBooks = getAllBooks;
const getRecentBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = "books:recent";
        const cachedBooks = yield app_1.redisClient.get(cacheKey);
        if (cachedBooks) {
            res.json(JSON.parse(cachedBooks));
            return;
        }
        const books = yield book_1.default.find().sort({ createdAt: -1 }).limit(10);
        const response = {
            status: "Success",
            data: books,
        };
        yield app_1.redisClient.set(cacheKey, JSON.stringify(response), {
            EX: 3600,
        });
        res.json(response);
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getRecentBooks = getRecentBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield book_1.default.findById(id);
        res.json({
            status: 'Success',
            data: book,
        });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getBookById = getBookById;
//# sourceMappingURL=book.js.map