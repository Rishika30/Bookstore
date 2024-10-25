import express, {Express} from 'express';
const app: Express = express();
import dotenv from 'dotenv';
dotenv.config();
import './conn/conn';
import userRoutes from './routes/user';
import bookRoutes from './routes/book';
import favouriteRoutes from './routes/favourite';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';

app.use(express.json());
app.use('/users', userRoutes);
app.use('/inventory', bookRoutes);
app.use('/favourite', favouriteRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server started at port ${process.env.PORT}`);
});
