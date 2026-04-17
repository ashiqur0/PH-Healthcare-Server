import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateAdminPayload } from "./admin.interface";

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

export const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
}