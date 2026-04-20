import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { ROLE } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialityValidation } from "./speciality.validation";

const router = Router();

router.post('/',
    // checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
    multerUpload.single('file'),
    validateRequest(SpecialityValidation.createSpecialityZodSchema),
    SpecialityController.createSpeciality);

router.get('/', SpecialityController.getAllSpecialities);
router.put('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), SpecialityController.updateSpeciality);
router.delete('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), SpecialityController.deleteSpeciality);

export const SpecialityRoutes = router;