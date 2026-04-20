import { NextFunction, Request, Response } from "express";
import { ROLE, USER_STATUS } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: ROLE[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Session Token Verification
            const sessionToken = CookieUtils.getCookie(req, 'better-auth.session_token');
            if (!sessionToken) {
                throw new Error('Authentication token is missing');
            }

            if (sessionToken) {
                const sessionExists = await prisma.session.findFirst({
                    where: {
                        token: sessionToken,
                        expiresAt: {
                            gt: new Date()
                        }
                    },
                    include: {
                        user: true
                    }
                });

                if (sessionExists && sessionExists.user) {
                    const user = sessionExists.user;
                    const now = new Date();

                    const expiresAt = new Date(sessionExists.expiresAt);
                    const createdAt = new Date(sessionExists.createdAt);

                    const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
                    const timeRemaining = expiresAt.getTime() - now.getTime();
                    const parcentageRemaining = (timeRemaining / sessionLifetime) * 100;

                    if (parcentageRemaining < 20) {
                        res.setHeader('X-Refresh-Token', 'true');
                        res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                        res.setHeader('X-Time-Remaining', timeRemaining.toString());

                        console.log("Session expiring soon!!");
                    }

                    if (user.status === USER_STATUS.BLOCKED || user.status === USER_STATUS.DELETED) {
                        throw new AppError(status.UNAUTHORIZED, 'User is blocked or deleted');
                    }

                    if (user.isDeleted) {
                        throw new AppError(status.UNAUTHORIZED, 'Unauthorized Access. User is deleted');
                    }

                    if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                        throw new AppError(status.FORBIDDEN, 'You do not have permission to access this resource');
                    }

                    req.user = {
                        userId: user.id,
                        role: user.role,
                        email: user.email
                    }
                }

                const accessToken = CookieUtils.getCookie(req, 'accessToken');

                if (!accessToken) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized Access. No access token provided');
                }
            }

            // Access Token Verification
            const accessToken = CookieUtils.getCookie(req, 'accessToken');
            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, 'Access token is missing');
            }

            const verifiedToken = await jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

            if (!verifiedToken.success) {
                throw new AppError(status.UNAUTHORIZED, 'Invalid access token');
            }

            if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as ROLE)) {
                throw new AppError(status.FORBIDDEN, 'You do not have permission to access this resource');
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}