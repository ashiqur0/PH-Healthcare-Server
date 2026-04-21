import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const schedule = ScheduleService.createSchedule(payload);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedule created successfully",
        data: schedule,
    })
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
    const schedules = ScheduleService.getAllSchedules();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedules retrieved successfully",
        data: schedules,
    });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
    const schedule = ScheduleService.getScheduleById();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedule retrieved successfully",
        data: schedule,
    });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedule = ScheduleService.updateSchedule();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedule updated successfully",
        data: schedule,
    });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedule = ScheduleService.deleteSchedule();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedule deleted successfully",
        data: schedule,
    });
});

export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};