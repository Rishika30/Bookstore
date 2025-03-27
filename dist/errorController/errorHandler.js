"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const handleError = (error, res) => {
    if (error instanceof AppError) {
        const response = {
            status: error.status,
            message: error.message
        };
        if (error.data) {
            response.data = error.data;
        }
        return res.status(error.statusCode).json({ response });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};
exports.handleError = handleError;
//# sourceMappingURL=errorHandler.js.map