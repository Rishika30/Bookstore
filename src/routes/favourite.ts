import express from "express";
const router = express.Router();
import { authenticateToken } from "../middlewares/auth";
import { addBookToFavourites, deleteBookFromFav, getBooksFromFav } from "../controllers/favourite";

router.put('/book/:bookId', authenticateToken, addBookToFavourites);
router.delete('/book/:bookId', authenticateToken, deleteBookFromFav);
router.get('/book', authenticateToken, getBooksFromFav);
export = router;
