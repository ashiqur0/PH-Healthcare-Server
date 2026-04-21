import { GENDER } from "../../../generated/prisma/enums";

export interface IUpdateDoctorspecialtyPayload {
    specialtyId: string;
    shouldDelete?: boolean;
}

export interface IUpdateDoctorPayload {
    doctor?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        experience?: number;
        registrationNumber?: string;
        gender?: GENDER;
        appointmentFee?: number;
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    },
    specialties?: IUpdateDoctorspecialtyPayload[];
}