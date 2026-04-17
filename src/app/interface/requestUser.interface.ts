import { ROLE } from "../../generated/prisma/enums";

export interface IRequestUser {
    userId: string;
    role: ROLE;
    email: string;
}