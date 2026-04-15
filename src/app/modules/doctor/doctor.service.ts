import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    });

    return doctors;
}

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    });

    return doctor;
}

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const updatedDoctor = await prisma.doctor.update({
        where: { id },
        data: payload
    });

    return updatedDoctor;
}

const deleteDoctor = async (id: string) => {
    const deletedDoctor = await prisma.doctor.delete({
        where: {
            id
        }
    });

    return deletedDoctor;
}

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}