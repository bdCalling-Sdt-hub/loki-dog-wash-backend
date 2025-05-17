import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationValidation } from './notification.validation';

const router = express.Router();
router.post(
  '/announcement',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(NotificationValidation.createAnnouncementZodSchema),
  NotificationController.createAnnouncement
);
router.get(
  '/announcement',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.getPreviousAnnouncement
);
router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.getNotifications
);
router.get(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.getSingleNotification
);

export const NotificationRoutes = router;
