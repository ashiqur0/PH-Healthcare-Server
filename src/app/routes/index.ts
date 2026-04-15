import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/specialities', SpecialityRoutes);
router.use('/users', UserRoutes);

export const IndexRoutes = router;