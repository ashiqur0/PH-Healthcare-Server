// eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import catchAsync from "../../shared/catchAsync";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await SpecialityService.createSpeciality(payload);
    res.status(201).json({
        success: true,
        message: "Speciality created successfully",
        data: result
    });
});

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialityService.getAllSpecialities();
    res.status(200).json({
        success: true,
        message: "Specialities retrieved successfully",
        data: result
    });
});

const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await SpecialityService.updateSpeciality(id as string, payload);
    res.status(200).json({
        success: true,
        message: "Speciality updated successfully",
        data: result
    });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await SpecialityService.deleteSpeciality(id as string);
    res.status(200).json({
        success: true,
        message: "Speciality deleted successfully",
        data: null
    });
});

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    updateSpeciality,
    deleteSpeciality
};