import { Router } from "express";
import { ROLE } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post(
    '/create-my-doctor-schedule',
    checkAuth(ROLE.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleZodSchema),
    DoctorScheduleController.createMyDoctorSchedule
);

router.get(
    '/my-doctor-schedules',
    checkAuth(ROLE.DOCTOR),
    DoctorScheduleController.getMyDoctorSchedules
);

router.get(
    '/',
    checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
    DoctorScheduleController.getAllDoctorSchedules
);

router.get(
    '/:doctorId/schedule/:scheduleId',
    checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
    DoctorScheduleController.getDoctorScheduleById
);

router.put(
    '/update-my-doctor-schedule',
    checkAuth(ROLE.DOCTOR),
    validateRequest(DoctorScheduleValidation.updateDoctorScheduleZodSchema),
    DoctorScheduleController.updateMyDoctorSchedule
);

router.delete(
    '/delete-my-doctor-schedule/:id',
    checkAuth(ROLE.DOCTOR),
    DoctorScheduleController.deleteDoctorSchedule
);

export const DoctorScheduleRoutes = router;