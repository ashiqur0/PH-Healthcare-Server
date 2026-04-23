import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { AppointmentService } from "./appointment.service";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const result = await AppointmentService.bookAppointment(payload, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Appointment booked successfully',
        data: result
    })
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.getMyAppointments(user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Appointments retrieved successfully',
        data: result
    })
});

export const AppointmentController = {
    bookAppointment,
    getMyAppointments,
}