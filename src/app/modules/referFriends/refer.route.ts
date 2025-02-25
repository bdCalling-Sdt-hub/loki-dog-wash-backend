import express from 'express';
import { ReferController } from './refer.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReferValidation } from './refer.validation';

const router = express.Router();

router.route(
  '/send-refer')
  .post(
  auth(USER_ROLES.USER),
  validateRequest(ReferValidation.createReferZodSchema),
  ReferController.createRefer
);


export const ReferRoutes = router;