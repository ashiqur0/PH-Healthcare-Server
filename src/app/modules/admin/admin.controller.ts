import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import status from "http-status";
import sendResponse from "../../shared/sendResponse";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
    const results = await AdminService.getAllAdmins();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admins retrieved successfully",
        data: results
    });
});

export const AdminController = {
    getAllAdmins
}