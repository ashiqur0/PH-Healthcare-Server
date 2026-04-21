import z from "zod";

const createDoctorScheduleZodSchema = z.object({
    doctorId: z.string("Doctor ID is required and must be a string"),
    scheduleId: z.string("Schedule ID is required and must be a string"),
    isBooked: z.boolean("Is booked is required and must be a boolean").optional(),
});

const updateDoctorScheduleZodSchema = z.object({
    doctorId: z.string("Doctor ID is required and must be a string").optional(),
    scheduleId: z.string("Schedule ID is required and must be a string").optional(),
    isBooked: z.boolean("Is booked is required and must be a boolean").optional(),
});

export const DoctorScheduleValidation = {
    createDoctorScheduleZodSchema,
    updateDoctorScheduleZodSchema,
};