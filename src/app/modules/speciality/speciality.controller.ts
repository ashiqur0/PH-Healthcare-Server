// eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createspecialty = catchAsync(async (req: Request, res: Response) => {    
    const payload = {
        ...req.body,
        icon: req.file?.path
    };

    const result = await specialtyService.createspecialty(payload);
    
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "specialty created successfully",
        data: result
    });
});

const getAllspecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await specialtyService.getAllspecialties();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "specialties retrieved successfully",
        data: result
    });
});

const updatespecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await specialtyService.updatespecialty(id as string, payload);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "specialty updated successfully",
        data: result
    });
});

const deletespecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await specialtyService.deletespecialty(id as string);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "specialty deleted successfully",
        data: null
    });
});

export const specialtyController = {
    createspecialty,
    getAllspecialties,
    updatespecialty,
    deletespecialty
};