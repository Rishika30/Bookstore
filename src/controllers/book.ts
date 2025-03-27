import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import dotenv from "dotenv";
import bookModel from "../models/book";
import { AppError, handleError } from "../errorController/errorHandler";
import { redisClient } from "../app";
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
        throw new AppError('Not Authorized', 403);  
    } catch (error) {
        handleError(error, res);
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
                throw new AppError('Book not found', 404);
            }
            res.status(200).json({
                message: "Updated book successfully",
                book: updatedBook,
            });
            return;
        }else{
            throw new AppError('Not Authorized', 403);
        }
    } catch (error) {
        handleError(error, res);
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
        handleError(error, res);
    }
}

export const getAllBooks = async (req: Request, res: Response) => {
    try {

        const validatedQuery = {
            cursor: req.query.cursor as string | undefined,
            limit: parseInt(req.query.limit as string, 10) | 10,
        };

        const cacheKey = `books:cursor:${validatedQuery.cursor || "null"}:limit:${validatedQuery.limit}`;

        const cachedBooks = await redisClient.get(cacheKey);
        if (cachedBooks) {
            res.json(JSON.parse(cachedBooks));
            return;
        }

        const query = validatedQuery.cursor ? { _id: { $gt: validatedQuery.cursor } } : {};
        const books = await bookModel.find(query)
        .limit(validatedQuery.limit + 1)
        .sort({ _id: 1 });

        const hasNextPage = books.length > validatedQuery.limit;
        if (hasNextPage) books.pop();

        const response = {
            books,
            pageInfo: {
                hasNextPage,
                endCursor: hasNextPage ? books[books.length - 1]._id : null,
            },
        };

        await redisClient.set(cacheKey, JSON.stringify(response), {
            EX: 86400,
        });

        res.json(response);
        return;
    } catch (error) {
        handleError(error, res);
    }
}

export const getRecentBooks = async (req: Request, res: Response) =>{
    try {

        const cacheKey = "books:recent";
        const cachedBooks = await redisClient.get(cacheKey);
        if (cachedBooks) {
            res.json(JSON.parse(cachedBooks));
            return;
        }
        const books = await bookModel.find().sort({ createdAt: -1 }).limit(10);
        const response = {
            status: "Success",
            data: books,
        };

        await redisClient.set(cacheKey, JSON.stringify(response), {
            EX: 3600,
        });

        res.json(response);
        return;
    } catch (error) {
        handleError(error, res);
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
        handleError(error, res);
    }
}