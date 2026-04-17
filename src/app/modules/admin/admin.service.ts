import { prisma } from "../../lib/prisma"

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

export const AdminService = {
    getAllAdmins,
    getAdminById
}