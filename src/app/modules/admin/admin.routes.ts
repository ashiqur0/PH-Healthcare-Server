import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getAllAdmins);
router.get('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getAdminById);

export const AdminRoutes = router;