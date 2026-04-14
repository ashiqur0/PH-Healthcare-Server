import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.routes";

const router = Router();

router.use('/specialities', SpecialityRoutes);

export const IndexRoutes = router;