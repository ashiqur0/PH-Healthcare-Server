import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { ROLE, USER_STATUS } from "../../generated/prisma/enums";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: true,
                defaultValue: ROLE.PATIENT
            },

            status: {
                type: 'string',
                required: true,
                defaultValue: USER_STATUS.ACTIVE
            },

            needPasswordChange: {
                type: 'boolean',
                required: true,
                defaultValue: false
            },

            isDeleted: {
                type: 'boolean',
                required: true,
                defaultValue: false
            },

            deletedAt: {
                type: 'date',
                required: false,
                defaultValue: null
            }
        }
    },

    plugins: [
        bearer()
    ],

    session: {
        expiresIn: 1 * 24 * 60 * 60, // 1 day
        updateAge: 1 * 24 * 60 * 60, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 1 * 24 * 60 * 60 // 1 day
        }
    }
});