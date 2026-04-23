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

const changeAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
    const appointmentId = req.body.id;
    const payload = req.body;
    const user = req.user;
    const result = await AppointmentService.changeAppointmentStatus(appointmentId, payload, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Appointment status updated successfully',
        data: result
    })
});

const getMySingleAppointment = catchAsync(async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const user = req.user;
    const result = await AppointmentService.getMySingleAppointment(appointmentId as string, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Appointment retrieved successfully',
        data: result
    })
});

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.getAllAppointments();
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
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
}