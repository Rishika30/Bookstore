import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import dotenv from "dotenv";
import bookModel from "../models/book";
dotenv.config();

export const addBook = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if(user && user.role === 'admin') {
                const { url, title, author, price, description, language } = req.body;
                await bookModel.create({ url, title, author, price, description, language });
                res.status(201).json({ message: "Added book successfully" });
                return;
        }
        res.status(403).json({ message: "Not Authorized" });
        return;    
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateBook = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if(user && user.role === 'admin'){
            const { bookId } = req.query;
            const updates = req.body;
            const updatedBook = await bookModel.findByIdAndUpdate(bookId, updates, {new: true, runValidators: true});
            if(!updatedBook){
                res.status(404).json({ message: "Book not found" });
                return;
            }
            res.status(200).json({
                message: "Updated book successfully",
                book: updatedBook,
            });
            return;
        }else{
            res.status(403).json({ message: "Not Authorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if(user && user.role === 'admin') {
            const { bookId } = req.query;
            await bookModel.findByIdAndDelete(bookId);
            res.status(200).json({ message: "Book Deleted Successfully" });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const books = await bookModel.find().sort({ createdAt: -1 });
        res.json({
            status: "Success",
            data: books,
        })
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getRecentBooks = async (req: Request, res: Response) =>{
    try {
        const books = await bookModel.find().sort({ createdAt: -1 }).limit(4);
        res.json({
            status: "Success",
            data: books,
        })
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBookById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const book = await bookModel.findById(id);
        res.json({
            status: 'Success',
            data: book,
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}