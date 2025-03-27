"use strict";
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
exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./conn/conn");
const user_1 = __importDefault(require("./routes/user"));
const book_1 = __importDefault(require("./routes/book"));
const favourite_1 = __importDefault(require("./routes/favourite"));
const cart_1 = __importDefault(require("./routes/cart"));
const order_1 = __importDefault(require("./routes/order"));
const errorHandler_1 = require("./errorController/errorHandler");
app.use(express_1.default.json());
app.use('/users', user_1.default);
app.use('/inventory', book_1.default);
app.use('/favourite', favourite_1.default);
app.use('/cart', cart_1.default);
app.use('/order', order_1.default);
// const redisClient = createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//     password: process.env.REDIS_PASSWORD || undefined,
// });
const redisClient = (0, redis_1.createClient)();
exports.redisClient = redisClient;
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        console.log('Connected to Redis');
    }
    catch (error) {
        console.error('Failed to connect to Redis', error);
    }
});
connectRedis();
app.all('*', (req) => {
    throw new errorHandler_1.AppError(`Can't find requested URL ${req.originalUrl} on this server`, 404);
});
app.use((err, req, res, next) => {
    (0, errorHandler_1.handleError)(err, res);
});
app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map