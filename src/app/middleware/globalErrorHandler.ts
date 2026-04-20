/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z, { unknown } from "zod";
import { TErrorResponse, TErrorSource } from "../interface/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";

// Global error handler
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === 'development') {
        console.error("Error from Global Error Handler: ", err);
    }

    // delete single file from cloudinary
    if (req.file) {
        await deleteFileFromCloudinary(req.file.path);
    }
    // প্রয়োজনীয়তা: ইমেক আলাদাভাবে আপলোড হয়ে যায়। এক্ষেত্রে অন্যান্য ডকুমেন্ট যদি ডাটাবেসে আপডেট হতে সমস্যা হয় তাহলে এই গ্লোবাল এরর হ্যান্ডলার এ ধরা পড়বে এবং ক্লাউডিনারিতে আপলোড হয়য়া ইমেজ গুলো ডিলেট হয়ে যাবে।

    // delete multiple files from cloudinary
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map((file) => file.path);

        await Promise.all(imageUrls.map(async (url) => deleteFileFromCloudinary(url)));
    }

    let errorSources: TErrorSource[] = [];
    let statusCode: number = status.INTERNAL_SERVER_ERROR; // Default to 500
    let message: string = "Something went wrong!";
    let stack: string | undefined = undefined;

    if (err instanceof z.ZodError) {    // Zod validation error
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    } else if (err instanceof Error) {  //JS Native Error. Keep last 
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    }

    const errorResponse: TErrorResponse = {
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? err : undefined,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined
    }

    res.status(statusCode).json(errorResponse);
};