import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import * as bcrypt from "bcrypt";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError, handleError } from "../errorController/errorHandler";
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, address } = req.body;

        //check username alreadys exists
        const existingUsername = await userModel.findOne({ username });
        if(existingUsername){
            throw new AppError('Username already exists', 409);
        }
        //check email already exists
        const existingEmail = await userModel.findOne({ email });
        if(existingEmail){
            throw new AppError('Email already exists', 409);
        }
        
        const hashedPass = await bcrypt.hash(password, 10);

        await userModel.create({ username, email, password: hashedPass, address});
        res.status(201).json({ 
            message: "Signup successful"
         });
        
    } catch (error) {
        handleError(error, res);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userModel.findOne({ username });
        if(!existingUser) {
            throw new AppError('Invalid Credentials', 401);
        }

        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = { name: existingUser.username, role: existingUser.role };
                const token = jwt.sign({authClaims}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30d'});
                res.status(200).json({ id: existingUser._id, role: existingUser.role, token});
            } else {
                throw new AppError('Invalid Credentials', 401);
            }
        })
    } catch (error) {
        handleError(error, res);
    }
}

export const getUserInformation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await userModel.findById(id).select("-password").populate('favourites');
        if(data) {
            res.status(200).json(data);
            return;
        }else {
            throw new AppError('NO user with the give id found', 400);
        }
    } catch (error) {
        handleError(error, res);
    }
}

export const updateUserAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { address } = req.body;
        await userModel.findByIdAndUpdate(id, { address });
        res.status(200).json({ message: "Address updated successfully" });
        return;
    } catch (error) {
        handleError(error, res);
    }
}