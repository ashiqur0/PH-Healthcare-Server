import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/specialities', SpecialityRoutes);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);

export const IndexRoutes = router;