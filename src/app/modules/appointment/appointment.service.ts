import { uuidv7 } from "zod";
import { IRequestUser } from "../../interface/requestUser.interface"
import { prisma } from "../../lib/prisma"
import { IBookAppointmentPayload } from "./appointment.interface"
import { APPOINMENT_STATUS, Appointment, ROLE } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const bookAppointment = async (payload: IBookAppointmentPayload, user: IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId
        }
    });

    const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: payload.doctorId,
                scheduleId: payload.scheduleId
            }
        }
    });

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async (tx) => {
        const appointmetData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        });

        // TODO: payment integration will be here

        return appointmetData;
    });

    return result;
}

const getMyAppointments = async (user: IRequestUser) => {
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointments = [];

    if (patientData) {
        appointments = await prisma.appointment.findMany({
            where: {
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    } else {
        throw new Error("User not found");
    }

    return appointments;
}

const changeAppointmentStatus = async (appointmentId: string, appointmentStatus: APPOINMENT_STATUS, user: IRequestUser) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });

    if (user?.role === ROLE.DOCTOR) {
        if (!(user?.email === appointmentData.doctor.email)) {
            throw new AppError(status.BAD_REQUEST, 'This is not your appointment');
        }
    }

    const result = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: appointmentStatus
        }
    });
    return result;
}

const getMySingleAppointment = async (appointmentId: string, user: IRequestUser) => {
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointment;

    if (patientData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }

    if (!appointment) {
        throw new AppError(status.BAD_REQUEST, 'This is not your appointment');
    }

    return appointment;
}

const getAllAppointments = async () => {
    const appointments = await prisma.appointment.findMany({
        include: {
            doctor: true,
            patient: true,
            schedule: true
        }
    });
    return appointments;
}

export const AppointmentService = {
    bookAppointment,
    getMyAppointments,
    getAllAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
}