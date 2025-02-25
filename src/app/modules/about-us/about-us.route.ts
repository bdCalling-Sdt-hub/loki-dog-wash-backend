import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AboutController } from './about-us.controller';
const router = express.Router();

router
  .route('/create-about')
  .post(auth(USER_ROLES.SUPER_ADMIN), AboutController.createAbout);

router
  .route('/get-all-about')
  .get(auth(USER_ROLES.SUPER_ADMIN , USER_ROLES.USER), AboutController.getAllAbout);

export const AboutRoutes = router;
