import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { specialtyRoutes } from "../modules/specialty/speciality.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { ScheduleRoutes } from "../modules/schedule/schedule.routes";

const router = Router();

router.use('/auth', authRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);
router.use('/admins', AdminRoutes);
router.use('/schedules', ScheduleRoutes);

export const IndexRoutes = router;