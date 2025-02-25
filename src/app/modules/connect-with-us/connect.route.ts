import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ConnectWithUsController } from './connect.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ConnectWithUsValidation } from './connect.validation';
const router = express.Router();

router.route('/create-connect').post(auth(USER_ROLES.SUPER_ADMIN), validateRequest(ConnectWithUsValidation.createConnectWithUsZodSchema), ConnectWithUsController.createConnectWithUs);
router.route('/get-connect').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), ConnectWithUsController.getConnectWithUs);

export const ConnectRoutes = router;