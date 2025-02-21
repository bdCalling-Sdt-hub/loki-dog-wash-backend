import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ConnectWithUsController } from './connect.controller';
const router = express.Router();

router.route('/create-connect').post(auth(USER_ROLES.SUPER_ADMIN), ConnectWithUsController.createConnectWithUs);
router.route('/get-connect').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), ConnectWithUsController.getConnectWithUs);

export const ConnectRoutes = router;