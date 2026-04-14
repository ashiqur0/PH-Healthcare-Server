import { Router } from "express";
import { SpecialityController } from "./speciality.controller";

const router = Router();

router.post('/', SpecialityController.createSpeciality);
router.get('/', SpecialityController.getAllSpecialities);
router.put('/:id', SpecialityController.updateSpeciality);
router.delete('/:id', SpecialityController.deleteSpeciality);

export const SpecialityRoutes = router;