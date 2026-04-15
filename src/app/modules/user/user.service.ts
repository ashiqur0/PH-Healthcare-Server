import status from "http-status";
import { ROLE, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {

    const specialities: Speciality[] = [];

    for (const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        });

        if (!speciality) {
            // throw new Error(`Speciality with ID ${specialityId} not found`);
            throw new AppError(status.NOT_FOUND, `Speciality with ID ${specialityId} not found`);
        }

        specialities.push(speciality);
    }

    // check if user with the same email already exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    });

    if (userExists) {
        // throw new Error(`User with email ${payload.doctor.email} already exists`);
        throw new AppError(status.BAD_REQUEST, `User with email ${payload.doctor.email} already exists`);
    }

    // create user in auth system
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: ROLE.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true
        }
    });

    // transaction to create doctor and link specialities
    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,
                }
            });

            const doctorSpecialityData = specialities.map((speciality) => {
                return {
                    doctorId: doctorData.id,
                    specialityId: speciality.id
                }
            });

            await tx.doctorSpeciality.createMany({
                data: doctorSpecialityData
            });

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            deletedAt: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    specialities: {
                        select: {
                            speciality: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            });

            return doctor;
        });

        return result;
    } catch (error) {
        console.log("Transaction Error: ", error);

        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        });

        throw error;
    }
}

export const UserService = {
    createDoctor
}