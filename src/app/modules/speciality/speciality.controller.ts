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

const getAllSpecialities = async (req: Request, res: Response) => {
    try {
        const result = await SpecialityService.getAllSpecialities();
        res.status(200).json({
            success: true,
            message: "Specialities retrieved successfully",
            data: result
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
}

const updateSpeciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const result = await SpecialityService.updateSpeciality(id as string, payload);
        res.status(200).json({
            success: true,
            message: "Speciality updated successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
}

const deleteSpeciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await SpecialityService.deleteSpeciality(id as string);
        res.status(200).json({
            success: true,
            message: "Speciality deleted successfully",
            data: null
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
}

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    updateSpeciality,
    deleteSpeciality
};