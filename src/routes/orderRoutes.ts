import express from 'express';
import { placeOrder, getOrderHistory, getAllOrders, updateOrderStatus } from '../controllers/order';
import { authenticateToken } from '../middlewares/auth';
import { validateRequest, placeOrderSchema, updateOrderStatusSchema } from '../middlewares/validationMiddleware';

const router = express.Router();

router.post('/place-order', authenticateToken, validateRequest(placeOrderSchema), placeOrder);
router.get('/order-history', authenticateToken, getOrderHistory);
router.get('/all-orders', authenticateToken, getAllOrders);
router.patch('/update-status/:orderId', authenticateToken, validateRequest(updateOrderStatusSchema), updateOrderStatus);

export default router;
