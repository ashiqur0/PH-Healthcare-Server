import { GENDER } from "../../../generated/prisma/enums"

export interface ICreateDoctorPayload {
    password: string
    doctor: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber: string;
        experience?: number;
        gender: GENDER;
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
    },
    specialities: string[]
}