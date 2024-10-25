import { Request, Response } from "express";
import userModel from "../models/user";
import { iUser } from "../models/user";
import * as bcrypt from "bcrypt";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, address } = req.body;
        // if(username.length < 4) {
        //     res.status(400).json({ message: "Username length should be greater than 3"});
        // }

        //check username alreadys exists
        const existingUsername = await userModel.findOne({ username });
        if(existingUsername){
            res.status(409).json({ message: "Username already exists"});
        }
        //check email already exists
        const existingEmail = await userModel.findOne({ email });
        if(existingEmail){
            res.status(409).json({ message: "Email already exists"});
        }
        //check password length
        // if(password.length<=5){
        //     res.status(400).json({ message: "Password should be greater than 5"});
        // }

        const hashedPass = await bcrypt.hash(password, 10);

        await userModel.create({ username, email, password: hashedPass, address});
        res.status(201).json({ 
            message: "Signup successful"
         });
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userModel.findOne({ username });
        if(!existingUser) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }

        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = { name: existingUser.username, role: existingUser.role };
                const token = jwt.sign({authClaims}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30d'});
                res.status(200).json({ id: existingUser._id, role: existingUser.role, token});
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
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
            res.status(400).json({ message: "NO user with the give id found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
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
        res.status(500).json({ message: "Internal Server Error" });
    }
}