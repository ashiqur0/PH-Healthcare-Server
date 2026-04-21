import status from "http-status";
import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IqueryParams } from "../../interface/query.interface";
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";

const getAllDoctors = async (query: IqueryParams) => {
    // const doctors = await prisma.doctor.findMany({
    //     where: {
    //         isDeleted: false
    //     },
    //     include: {
    //         user: true,
    //         specialities: {
    //             include: {
    //                 speciality: true
    //             }
    //         }
    //     }
    // });

    // return doctors;

    const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
        prisma.doctor,
        query,
        {
            searchableFields: doctorSearchableFields,
            filterableFields: doctorFilterableFields
        }
    )

    const result = await queryBuilder
        .search()
        .filter()
        .where({ isDeleted: false })
        .include({
            user: true,
            specialities: true,
            // specialities: {
            //     include: {
            //         speciality: true
            //     }            
            // }
        })
        .dynamicInclude(doctorIncludeConfig)
        .paginate()
        .sort()
        .execute();

    return result;
}

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            },
            appointments: {
                include: {
                    patient: true,
                    schedule: true,
                    prescription: true
                }
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            reviews: true
        }
    });

    return doctor;
}

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: { id }
    });

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    const { doctor: doctorData, specialities } = payload;

    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: { id },
                data: { ...doctorData }
            })
        }

        if (specialities && specialities.length > 0) {
            for (const speciality of specialities) {
                const { specialityId, shouldDelete } = speciality;
                if (shouldDelete) {
                    await tx.doctorSpeciality.delete({
                        where: {
                            doctorId_specialityId: {
                                doctorId: id,
                                specialityId
                            }
                        }
                    });
                } else {
                    await tx.doctorSpeciality.upsert({
                        where: {
                            doctorId_specialityId: {
                                doctorId: id,
                                specialityId
                            }
                        },
                        create: {
                            doctorId: id,
                            specialityId
                        },
                        update: {}
                    });
                }
            }
        }
    });

    const doctor = await getDoctorById(id);

    return doctor;
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