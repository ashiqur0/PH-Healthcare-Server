import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interface/query.interface";

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
});

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const query = req.query;

    const result = await DoctorScheduleService.getMyDoctorSchedules(user, query as IQueryParams);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My doctor schedules retrieved successfully",
        data: result
    });
});

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await DoctorScheduleService.getAllDoctorSchedules(query as IQueryParams);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor schedules retrieved successfully",
        data: result
    });
});

export const DoctorScheduleController = {
    createDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules
};