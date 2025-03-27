import express from "express";
const router = express.Router();
import { authenticateToken } from "../middlewares/auth";
import { addBook, deleteBook, getAllBooks, getBookById, getRecentBooks, updateBook } from "../controllers/book";
import { validateRequest, addBookSchema, getBooksSchema } from "../middlewares/validator";

router.post('/admin/:id/book', authenticateToken , validateRequest(addBookSchema), addBook);
router.patch('/admin/:id/book', authenticateToken, updateBook);
router.delete('/admin/:id/book', authenticateToken, deleteBook);
router.get('/books', validateRequest(getBooksSchema), getAllBooks);
router.get('/recent-books', getRecentBooks);
router.get('/book/:id', getBookById);
export = router;