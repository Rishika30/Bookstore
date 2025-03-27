"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middlewares/auth");
const cart_1 = require("../controllers/cart");
router.put('/book/:bookId', auth_1.authenticateToken, cart_1.addBookToCart);
router.delete('/book/:bookId', auth_1.authenticateToken, cart_1.deleteBookFromCart);
router.get('/book', auth_1.authenticateToken, cart_1.getBooksFromCart);
module.exports = router;
//# sourceMappingURL=cart.js.map