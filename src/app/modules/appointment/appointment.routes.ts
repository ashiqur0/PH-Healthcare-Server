import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    '/book-appointment', 
    checkAuth(ROLE.PATIENT),
    AppointmentController.bookAppointment
);

router.get(
    '/my-appointment', 
    checkAuth(ROLE.PATIENT, ROLE.DOCTOR),
    AppointmentController.getMyAppointments
);

router.patch(
    '/change-appointment-status/:id', 
    checkAuth(ROLE.PATIENT, ROLE.DOCTOR, ROLE.ADMIN, ROLE.SUPER_ADMIN),
    AppointmentController.changeAppointmentStatus
);

router.get(
    '/my-single-appointment/:id', 
    checkAuth(ROLE.PATIENT, ROLE.DOCTOR),
    AppointmentController.getMySingleAppointment
);

router.get(
    'all-appointments',
    checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
    AppointmentController.getAllAppointments
)

export const AppointmentRoutes = router;