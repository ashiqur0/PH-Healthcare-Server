import { prisma } from "../../lib/prisma"

const getAllAdmins = async () => {
    const admins = await prisma.admin.findMany({
        include: {
            user: true
        }
    });

    return admins;
}

export const AdminService = {
    getAllAdmins
}