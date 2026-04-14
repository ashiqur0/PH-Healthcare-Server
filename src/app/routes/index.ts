import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/specialities', SpecialityRoutes);

export const IndexRoutes = router;