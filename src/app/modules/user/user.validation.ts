
import z from "zod";
import { GENDER } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
    password: z.string("Password is required and must be string").min(6, "Password must be at least 6 characters").max(20, "Password must be less than 20 characters"),
    doctor: z.object({
        name: z.string("Name is required").min(5, "Name must be atleast 5 characters").max(30, "Name must be less than 30 characters"),

        email: z.email("Invalid email address"),

        contactNumber: z.string("Contact number is required").min(11, "Contact number must be atleast 11 characters").max(14, "Contact number must be maximum 14 characters"),

        address: z.string("Address is required").min(10, "Address must be atleast 10 characters").max(100, "Address must be less than 100 characters").optional(),

        registrationNumber: z.string("Registration number is required"),

        experience: z.int("Experience must be an integer").nonnegative("Experience cannot be negative").optional(),

        gender: z.enum([GENDER.MALE, GENDER.FEMALE], "Gender must be either MALE or FEMALE"),

        appointmentFee: z.number("Appoinment fee must be a number").nonnegative("Appoinment fee cannot be negative"),

        qualification: z.string("Qualification is required").min(2, "Qualification must be atleast 2 characters").max(50, "Qualification must be less than 50 characters"),

        currentWorkingPlace: z.string("Current working place is required").min(2, "Current working place must be atleast 2 characters").max(50, "Current working place must be less than 50 characters"),

        designation: z.string("Designation is required").min(2, "Designation must be atleast 2 characters").max(50, "Designation must be less than 50 characters"),
    }),

    specialties: z.array(z.uuid("specialty ID must be a valid UUID")).min(1, "At least one specialty is required")
});