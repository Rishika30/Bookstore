import { Response } from 'express';

export class AppError extends Error {
    statusCode: number;
    status: string;
    data?: any;

    constructor(message: string, statusCode: number, data?: any){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail': 'error';
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (error:any, res: Response) => {
    if(error instanceof AppError){
        const response: any = {
            status: error.status,
            message: error.message
        };

        if(error.data){
            response.data = error.data;
        }

        return res.status(error.statusCode).json({response});
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
}