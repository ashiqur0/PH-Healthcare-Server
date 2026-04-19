import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.post('/register', AuthController.registerPatient);
router.post('/login', AuthController.loginUser);
router.get('/me', checkAuth(ROLE.ADMIN, ROLE.DOCTOR, ROLE.PATIENT, ROLE.SUPER_ADMIN), AuthController.getMe);
router.get('/refresh-token', AuthController.getNewToken);
router.post('/change-password', checkAuth(ROLE.ADMIN, ROLE.DOCTOR, ROLE.PATIENT, ROLE.SUPER_ADMIN), AuthController.changePassword);
router.post('/logout', checkAuth(ROLE.ADMIN, ROLE.DOCTOR, ROLE.PATIENT, ROLE.SUPER_ADMIN), AuthController.logoutUser);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forget-password', AuthController.forgetPassword);
router.post('/reset-password', AuthController.resetPassword); 

export const authRoutes = router;