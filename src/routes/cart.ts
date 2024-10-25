import express from "express";
const router = express.Router();
import { authenticateToken } from "../middlewares/auth";
import { addBookToCart, deleteBookFromCart, getBooksFromCart } from "../controllers/cart";

router.put('/book/:bookId', authenticateToken, addBookToCart);
router.delete('/book/:bookId', authenticateToken, deleteBookFromCart);
router.get('/book', authenticateToken, getBooksFromCart);
export = router;
