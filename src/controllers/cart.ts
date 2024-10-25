import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import dotenv from "dotenv";
import bookModel from "../models/book";
import mongoose from "mongoose";
dotenv.config();

export const addBookToCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const { bookId } = req.params;
        const userData = userModel.findById(id);
        const isBookInCart = (await userData).cart.includes(new mongoose.Types.ObjectId(bookId));
        if(isBookInCart){
            res.status(200).json({ message: "Book is already in cart" });
            return;
        }
        await userModel.findByIdAndUpdate(id, { $push: { cart: bookId }});
        res.status(200).json({ message: "Book Added to Cart" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
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
        res.status(500).json({ message: "Internal Server Error" });
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
        res.status(500).json({ message: "Internal Server Error" });
    }
}