/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await SpecialityService.createSpeciality(payload);
        res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        })
    }
}

export const SpecialityController = {
    createSpeciality
};