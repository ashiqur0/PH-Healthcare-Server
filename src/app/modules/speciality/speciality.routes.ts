import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { ROLE } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post('/', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), SpecialityController.createSpeciality);
router.get('/', SpecialityController.getAllSpecialities);
router.put('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), SpecialityController.updateSpeciality);
router.delete('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), SpecialityController.deleteSpeciality);

export const SpecialityRoutes = router;