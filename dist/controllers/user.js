"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAddress = exports.getUserInformation = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("../errorController/errorHandler");
dotenv_1.default.config();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, address } = req.body;
        //check username alreadys exists
        const existingUsername = yield user_1.default.findOne({ username });
        if (existingUsername) {
            throw new errorHandler_1.AppError('Username already exists', 409);
        }
        //check email already exists
        const existingEmail = yield user_1.default.findOne({ email });
        if (existingEmail) {
            throw new errorHandler_1.AppError('Email already exists', 409);
        }
        const hashedPass = yield bcrypt.hash(password, 10);
        yield user_1.default.create({ username, email, password: hashedPass, address });
        res.status(201).json({
            message: "Signup successful"
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield user_1.default.findOne({ username });
        if (!existingUser) {
            throw new errorHandler_1.AppError('Invalid Credentials', 401);
        }
        yield bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = { name: existingUser.username, role: existingUser.role };
                const token = jsonwebtoken_1.default.sign({ authClaims }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
                res.status(200).json({ id: existingUser._id, role: existingUser.role, token });
            }
            else {
                throw new errorHandler_1.AppError('Invalid Credentials', 401);
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.loginUser = loginUser;
const getUserInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield user_1.default.findById(id).select("-password").populate('favourites');
        if (data) {
            res.status(200).json(data);
            return;
        }
        else {
            throw new errorHandler_1.AppError('NO user with the give id found', 400);
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.getUserInformation = getUserInformation;
const updateUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { address } = req.body;
        yield user_1.default.findByIdAndUpdate(id, { address });
        res.status(200).json({ message: "Address updated successfully" });
        return;
    }
    catch (error) {
        (0, errorHandler_1.handleError)(error, res);
    }
});
exports.updateUserAddress = updateUserAddress;
//# sourceMappingURL=user.js.map