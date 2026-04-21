import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { ROLE } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { specialtyValidation } from "./specialty.validation";

const router = Router();

router.post('/',
    // checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
    multerUpload.single('file'),
    validateRequest(specialtyValidation.createspecialtyZodSchema),
    specialtyController.createspecialty);

router.get('/', specialtyController.getAllspecialties);
router.put('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), specialtyController.updatespecialty);
router.delete('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), specialtyController.deletespecialty);

export const specialtyRoutes = router;