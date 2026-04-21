import { Router } from "express";
import { ScheduleController } from "./schedue.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ScheduleValidation } from "./schedule.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.post('/', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema), ScheduleController.createSchedule);

router.get('/', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.DOCTOR), ScheduleController.getAllSchedules);

router.get('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.DOCTOR), ScheduleController.getScheduleById);

router.put('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);

router.delete('/:id', checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), ScheduleController.deleteSchedule);

export const ScheduleRoutes = router;