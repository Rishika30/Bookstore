import express, {Express, Request, Response, NextFunction} from 'express';
const app: Express = express();
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
import './conn/conn';
import userRoutes from './routes/user';
import bookRoutes from './routes/book';
import favouriteRoutes from './routes/favourite';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';
import { AppError, handleError } from './errorController/errorHandler';

app.use(express.json());
app.use('/users', userRoutes);
app.use('/inventory', bookRoutes);
app.use('/favourite', favouriteRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

// const redisClient = createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//     password: process.env.REDIS_PASSWORD || undefined,
// });

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis', error);
    }
};

connectRedis();

export { redisClient };

app.all('*', (req: Request) => {
    throw new AppError(`Can't find requested URL ${req.originalUrl} on this server`, 404);
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server started at port ${process.env.PORT}`);
});
