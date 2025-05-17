import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser
);
router.post(
  '/logout',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  AuthController.logoutUser
);

router.post(
  '/delete-profile',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN),
  AuthController.deleteProfile
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.forgetPassword
);

router.post(
  '/verify-email',
  validateRequest(AuthValidation.createVerifyEmailZodSchema),
  AuthController.verifyEmail
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.resetPassword
);

router.post(
  '/change-password',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.changePassword
);

router.post(
  '/delete-profile',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  AuthController.deleteProfile
);

router.post(
  '/resend-otp',
  validateRequest(AuthValidation.resendOtp),
  AuthController.resendOtp
);

router.post(
  '/active-restrict-user/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AuthController.activeOrRestrictUser
);

export const AuthRoutes = router;
