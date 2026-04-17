import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateAdminPayload } from "./admin.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { USER_STATUS } from "../../../generated/prisma/enums";

const getAllAdmins = async () => {
    const admins = await prisma.admin.findMany({
        include: {
            user: true
        }
    });

    return admins;
}

const getAdminById = async (id: string) => {
    const admin = await prisma.admin.findUnique({
        where: { id },
        include: {
            user: true
        }
    });

    return admin;
}

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
    const isAdminExist = await prisma.admin.findUnique({
        where: { id }
    });

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    const { admin } = payload;
    const updatedAdmin = await prisma.admin.update({
        where: { id  },
        data: { ...admin }
    });

    return updatedAdmin;
}

    // soft delete admin by setting isDeleted to true
const deleteAdmin = async (id: string, user: IRequestUser) => {

    //TODO: Validate who is deleting the admin, only super admin can delete an admin and super admin, and admin cannot delete a super admin

    // validate self deleting
    const isAdminExist = await prisma.admin.findUnique({
        where: { id }
    });

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin or super admin not found");
    }

    if (isAdminExist.id === user.userId) {
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        await tx.user.update({
            where: { id: isAdminExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: USER_STATUS.DELETED
            }
        });

        await tx.session.deleteMany({
            where: { userId: isAdminExist.userId }
        });

        await tx.account.deleteMany({
            where: { userId: isAdminExist.userId }
        });

        const admin = await getAdminById(id);

        return admin;
    });

    return result;
}

export const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}