"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middlewares/auth");
const favourite_1 = require("../controllers/favourite");
router.put('/book/:bookId', auth_1.authenticateToken, favourite_1.addBookToFavourites);
router.delete('/book/:bookId', auth_1.authenticateToken, favourite_1.deleteBookFromFav);
router.get('/book', auth_1.authenticateToken, favourite_1.getBooksFromFav);
module.exports = router;
//# sourceMappingURL=favourite.js.map