import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { IQueryParams } from "../../interface/query.interface";

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
    const query = req.query;
    const schedules = ScheduleService.getAllSchedules(query as IQueryParams);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedules retrieved successfully",
        data: schedules,
    });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = ScheduleService.getScheduleById(id as string);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedule retrieved successfully",
        data: schedule,
    });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
    const  { id } = req.params;
    const payload = req.body;
    const schedule = ScheduleService.updateSchedule(id as string, payload);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Schedule updated successfully",
        data: schedule,
    });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = ScheduleService.deleteSchedule(id as string);
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