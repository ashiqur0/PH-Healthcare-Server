import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interface/query.interface";

const createMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;

    const result = await DoctorScheduleService.createMyDoctorSchedule(user, payload);

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

const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorScheduleService.getDoctorScheduleById(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor schedule retrieved successfully",
        data: result
    });
});

const updateMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const result = await DoctorScheduleService.updateMyDoctorSchedule(user, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor schedule updated successfully",
        data: result
    });
});

const deleteDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    await DoctorScheduleService.deleteMyDoctorSchedule(user, id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor schedule deleted successfully",
        data: null
    });
});

export const DoctorScheduleController = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteDoctorSchedule
};