import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { ROLE, USER_STATUS } from "../../generated/prisma/enums";
import ms from "ms";
import { envVars } from "../../config/env";

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

    session: {
        expiresIn: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))) || 0,
        updateAge: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE))) || 0,
        cookieCache: {
            enabled: envVars.NODE_ENV === 'production',
            maxAge: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))) || 0
        }
    }
});