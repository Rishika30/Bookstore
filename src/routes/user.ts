import express from "express";
const router = express.Router();
import { registerUser, loginUser, getUserInformation, updateUserAddress } from "../controllers/user";
import { authenticateToken } from "../middlewares/auth";
import { loginUserSchema, registerUserSchema, validateRequest } from "../middlewares/validator";

router.post('/register', validateRequest(registerUserSchema), registerUser);
router.post('/login', validateRequest(loginUserSchema), loginUser);
router.get('/:id', authenticateToken, getUserInformation);
router.put('/:id/address', authenticateToken , updateUserAddress)
export = router;