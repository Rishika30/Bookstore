"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const validator_1 = require("../middlewares/validator");
router.post('/register', (0, validator_1.validateRequest)(validator_1.registerUserSchema), user_1.registerUser);
router.post('/login', (0, validator_1.validateRequest)(validator_1.loginUserSchema), user_1.loginUser);
router.get('/:id', auth_1.authenticateToken, user_1.getUserInformation);
router.put('/:id/address', auth_1.authenticateToken, user_1.updateUserAddress);
module.exports = router;
//# sourceMappingURL=user.js.map