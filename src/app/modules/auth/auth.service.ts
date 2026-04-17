import status from "http-status";
import { USER_STATUS } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUser.interface";

interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            // default values
            // needPasswordChange: false,
            // role: ROLE.PATIENT
        }
    });

    if (!data.user) {
        // throw new Error('Failed to register patient');
        throw new AppError(status.BAD_REQUEST, 'Failed to register patient');
    }

    //* TODO: create patient profile in transaction after sign up of patient in User model
    try {
        const patient = await prisma.$transaction(async (tx) => {
            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email,

                }
            });

            return patientTx;
        });

        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        });

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        });

        return {
            ...data,
            accessToken,
            refreshToken,
            patient,
        };
    } catch (error) {
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        });

        throw error;
    }
}

interface ILoginUserPayload {
    email: string;
    password: string;
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });

    if (data.user.status === USER_STATUS.BLOCKED) {
        // throw new Error('User is blocked. Please contact support.');
        throw new AppError(status.FORBIDDEN, 'User is blocked. Please contact support.');
    }

    if (data.user.isDeleted || data.user.status === USER_STATUS.DELETED) {
        // throw new Error('User is deleted. Please contact support.');
        throw new AppError(status.FORBIDDEN, 'User is deleted. Please contact support.');
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    });

    return {
        ...data,
        accessToken,
        refreshToken
    };
}

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    medicalReports: true,
                    prescriptions: true,
                    reviews: true,
                    patientHealthData: true
                }
            },
            doctor: {
                include: {
                    specialities: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true
                }
            },
            admin: true
        }
    });

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    return isUserExists;
};

export const AuthService = {
    registerPatient,
    loginUser,
    getMe
}