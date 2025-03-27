"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middlewares/auth");
const book_1 = require("../controllers/book");
const validator_1 = require("../middlewares/validator");
router.post('/admin/:id/book', auth_1.authenticateToken, (0, validator_1.validateRequest)(validator_1.addBookSchema), book_1.addBook);
router.patch('/admin/:id/book', auth_1.authenticateToken, book_1.updateBook);
router.delete('/admin/:id/book', auth_1.authenticateToken, book_1.deleteBook);
router.get('/books', (0, validator_1.validateRequest)(validator_1.getBooksSchema), book_1.getAllBooks);
router.get('/recent-books', book_1.getRecentBooks);
router.get('/book/:id', book_1.getBookById);
module.exports = router;
//# sourceMappingURL=book.js.map