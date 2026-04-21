import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;

    const result = await DoctorScheduleService.createDoctorSchedule(user, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor schedule created successfully",
        data: result
    });
})

export const DoctorScheduleController = {
    createDoctorSchedule,
}