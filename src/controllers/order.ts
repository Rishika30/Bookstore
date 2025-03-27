import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import dotenv from "dotenv";
import bookModel from "../models/book";
import mongoose from "mongoose";
import orderModel from "../models/order";
import { AppError, handleError } from "../errorController/errorHandler";
dotenv.config();

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const { id, order } = req.body;

        const user = await userModel.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const cartBookIds = user.cart.map(item => item.toString());
        const invalidBooks = await order.filter(bookId => !cartBookIds.includes(bookId));
        if (invalidBooks.length > 0) {
            throw new AppError('Some books are not in your cart', 400, { invalidBooks });
        }
        const newOrder = await orderModel.create({ user: id, books: order });

        await userModel.findByIdAndUpdate(id, {
            $push: { order: newOrder._id },
            $pull: { cart: { $in: order } }
        });

        res.status(201).json({
            status: "success",
            message: "Order Placed Successfully",
            orderId: newOrder._id
        });
        return;
    } catch (error) {
        handleError(error, res);
    }
}

export const getOrderHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.headers;
        const userData = await userModel.findById(id).populate({
            path: "order",
            populate: {path: "books"},
        });

        const orderData = userData.order.reverse();
        res.status(200).json({
            status: "success",
            data: orderData,
        });
        return;
    } catch (error) {
        handleError(error, res);
    }
}

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const userData = await orderModel.find().populate({
            path: "books",
        })
        .populate({
            path: "user",
            select: "-password",
        }).sort({ createdAt: -1});

        res.status(200).json({
            status: "success",
            data: userData,
        });
        return;
    } catch (error) {
        handleError(error, res);
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id);
        if(user && user.role === 'admin') {
            const { orderId } = req.params;
            await orderModel.findByIdAndUpdate(orderId, { status: req.body.status });
            res.status(200).json({
                status: "success",
                message: "Status updated successfully",
            });
            return;
        }else{
            throw new AppError('Not Authorized', 403);
        }
    } catch (error) {
        handleError(error, res);
    }
}