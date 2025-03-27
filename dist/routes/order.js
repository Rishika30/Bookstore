"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middlewares/auth");
const order_1 = require("../controllers/order");
const validator_1 = require("../middlewares/validator");
router.post('/', auth_1.authenticateToken, (0, validator_1.validateRequest)(validator_1.placeOrderSchema), order_1.placeOrder);
router.get('/history', auth_1.authenticateToken, order_1.getOrderHistory);
router.get('/', auth_1.authenticateToken, order_1.getAllOrders);
router.patch('/:orderId', auth_1.authenticateToken, (0, validator_1.validateRequest)(validator_1.updateOrderStatusSchema), order_1.updateOrderStatus);
module.exports = router;
//# sourceMappingURL=order.js.map