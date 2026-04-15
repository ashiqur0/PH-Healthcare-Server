import { prisma } from "../../lib/prisma"

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

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
}