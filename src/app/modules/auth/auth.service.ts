import { USER_STATUS } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
        throw new Error('Failed to register patient');
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

        return { ...data, patient };
    } catch (error) {
        console.log("Transaction error: ", error);

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
        throw new Error('User is blocked. Please contact support.');
    }

    if (data.user.isDeleted || data.user.status === USER_STATUS.DELETED) {
        throw new Error('User is deleted. Please contact support.');
    }

    return data;
}

export const AuthService = {
    registerPatient,
    loginUser
}