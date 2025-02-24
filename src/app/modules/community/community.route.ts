import express from 'express';
import { CommunityController } from './community.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router
  .route('/questions')
  .post(
    auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN),
    fileUploadHandler(),
    CommunityController.askQuestion
  )
  .get(
    auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN),
    CommunityController.getAllQuestions
  );

router
  .route('/questions/:questionId/reply')
  .post(
    auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN),
    CommunityController.replyToQuestion
  );

  router
  .route('/notifications')
  .get(
    auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
    CommunityController.getUserNotifications
  );

router
  .route('/notifications/:notificationId/read')
  .patch(
    auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
    CommunityController.markNotificationAsRead
  );

export const CommunityRoutes = router;