import z from "zod";

export const updateDoctorZodSchema = z.object({
    name: z.string("Name must be string").min(5, "Name must be atleast 5 characters").max(30, "Name must be less than 30 characters"),

    email: z.email("Invalid email address"),

    profilePhoto: z.string("Profile photo must be string"),

    contactNumber: z.string("Contact number must be string").min(11, "Contact number must be atleast 11 characters").max(14, "Contact number must be maximum 14 characters"),

    address: z.string("Address must be string").max(100, "Address must be less than 100 characters"),
    
    registrationNumber: z.string("Registration number must be string").min(5, "Registration number must be atleast 5 characters").max(20, "Registration number must be less than 20 characters"),

    experience: z.number("Experience must be a number").min(0, "Experience must be a positive number"),
}).partial();