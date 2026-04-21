import z from "zod";

const createspecialtyZodSchema = z.object({
    title: z.string("Title is required" ),
    description: z.string("Description is required").optional(),
})

export const specialtyValidation = {
    createspecialtyZodSchema
}