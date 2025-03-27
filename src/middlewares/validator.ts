import Joi from 'joi';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    next();
  };
};

// Order Schemas
export const placeOrderSchema = Joi.object({
  id: Joi.string().required(),
  order: Joi.array().items(Joi.string()).min(1).required()
});

export const updateOrderStatusSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().valid('Order Placed', 'Out for Delivery', 'Delivered', 'Cancelled').required()
});

// User Schemas
export const registerUserSchema = Joi.object({
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  address: Joi.string().required()
});

export const loginUserSchema = Joi.object({
  username: Joi.string().min(4).required(),
  password: Joi.string().required()
});

// Book Schemas
export const addBookSchema = Joi.object({
  url: Joi.string().uri().required(),
  title: Joi.string().required(),
  author: Joi.string().required(),
  price: Joi.number().positive().required(),
  description: Joi.string().required(),
  language: Joi.string().required()
});

export const getBooksSchema = Joi.object({
  cursor: Joi.string().optional(),
  limit: Joi.number().integer().min(1).default(10),
});