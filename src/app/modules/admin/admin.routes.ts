import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminZodSchema } from "./admin.validate";

const router = Router();

router.get("/", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getAllAdmins);
router.get('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getAdminById);
router.put("/:id", checkAuth(ROLE.SUPER_ADMIN), validateRequest(updateAdminZodSchema), AdminController.updateAdmin);
router.delete("/:id", checkAuth(ROLE.SUPER_ADMIN), AdminController.deleteAdmin)

export const AdminRoutes = router;