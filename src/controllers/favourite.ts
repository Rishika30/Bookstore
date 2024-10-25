import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import dotenv from "dotenv";
import bookModel from "../models/book";
import mongoose from "mongoose";
dotenv.config();

export const addBookToFavourites = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const { bookId } = req.params;
        const userData = userModel.findById(id);
        const isFavouriteBook = (await userData).favourites.includes(new mongoose.Types.ObjectId(bookId));
        if(isFavouriteBook){
            res.status(409).json({ message: "Book is already in favourites" });
            return;
        }
        await userModel.findByIdAndUpdate(id, { $push: { favourites: bookId }});
        res.status(201).json({ message: "Book Added to Fvaourites" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteBookFromFav = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const { id } = req.body;
        const userData = await userModel.findById(id);
        const isFavouriteBook = userData.favourites.includes(new mongoose.Types.ObjectId(bookId));
        if(isFavouriteBook){
            await userModel.findByIdAndUpdate(id, { $pull: { favourites: bookId }});
        }
        res.status(200).json({message: "Book removed from favourites" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBooksFromFav = async (req: Request, res: Response) => {
    try {
        const { id } = req.headers;
        const userData = await userModel.findById(id).populate('favourites');
        const favouriteBooks = userData.favourites;
        res.status(200).json({
            status: "Success",
            data: favouriteBooks,
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}