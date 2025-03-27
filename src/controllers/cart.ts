import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import dotenv from "dotenv";
import bookModel from "../models/book";
import mongoose from "mongoose";
import { AppError, handleError } from "../errorController/errorHandler";
dotenv.config();

export const addBookToCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const { bookId } = req.params;
        const userData = userModel.findById(id);
        const isBookInCart = (await userData).cart.includes(new mongoose.Types.ObjectId(bookId));
        if(isBookInCart){
            throw new AppError('Book is already in cart', 403);
        }
        await userModel.findByIdAndUpdate(id, { $push: { cart: bookId }});
        res.status(200).json({ message: "Book Added to Cart" });
        return;
    } catch (error) {
        handleError(error, res);
    }
}

export const deleteBookFromCart = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const { id } = req.body;
        const userData = await userModel.findById(id);
        const isBookInCart = userData.cart.includes(new mongoose.Types.ObjectId(bookId));
        if(isBookInCart){
            await userModel.findByIdAndUpdate(id, { $pull: { cart: bookId }});
        }
        res.status(200).json({message: "Book removed from cart" });
        return;
    } catch (error) {
        handleError(error, res);
    }
}

export const getBooksFromCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.headers;
        const userData = await userModel.findById(id).populate('cart');
        const booksInCart = userData.cart.reverse();
        res.status(200).json({
            status: "Success",
            data: booksInCart,
        });
        return;
    } catch (error) {
        handleError(error, res);
    }
}