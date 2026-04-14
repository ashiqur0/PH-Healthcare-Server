import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Speciality) => {
    const speciality = await prisma.speciality.create({
        data: payload
    });

    return speciality;
}

const getAllSpecialities = async () => {
    const specialities = await prisma.speciality.findMany();
    return specialities;
}

const updateSpeciality = async (id: string, payload: Speciality) => {
    const speciality = await prisma.speciality.update({
        where: { id },
        data: payload
    });

    return speciality;
}

const deleteSpeciality = async (id: string) => {
    await prisma.speciality.delete({
        where: { id }
    });
}

export const SpecialityService = {
    createSpeciality,
    getAllSpecialities,
    updateSpeciality,
    deleteSpeciality
};