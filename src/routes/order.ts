import express from "express";
const router = express.Router();
import { authenticateToken } from "../middlewares/auth";
import { getAllOrders, getOrderHistory, placeOrder, updateOrderStatus } from "../controllers/order";
import { validateRequest, placeOrderSchema, updateOrderStatusSchema } from "../middlewares/validator";

router.post('/', authenticateToken, validateRequest(placeOrderSchema) ,placeOrder);
router.get('/history', authenticateToken, getOrderHistory);
router.get('/', authenticateToken, getAllOrders);
router.patch('/:orderId', authenticateToken, validateRequest(updateOrderStatusSchema), updateOrderStatus);

export = router;
