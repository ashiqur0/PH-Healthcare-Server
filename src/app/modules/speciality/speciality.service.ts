import { specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createspecialty = async (payload: specialty) => {
    const specialty = await prisma.specialty.create({
        data: payload
    });

    return specialty;
}

const getAllspecialties = async () => {
    const specialties = await prisma.specialty.findMany();
    return specialties;
}

const updatespecialty = async (id: string, payload: specialty) => {
    const specialty = await prisma.specialty.update({
        where: { id },
        data: payload
    });

    return specialty;
}

const deletespecialty = async (id: string) => {
    await prisma.specialty.delete({
        where: { id }
    });
}

export const specialtyService = {
    createspecialty,
    getAllspecialties,
    updatespecialty,
    deletespecialty
};