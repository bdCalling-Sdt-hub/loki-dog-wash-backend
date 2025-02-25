import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { StationController } from './station.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { StationValidation } from './station.validation';
const router = express.Router();

router.route('/create-station').post(auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(), validateRequest(StationValidation.createStationZodSchema), StationController.createStation);
router.route('/all-station').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), StationController.getAllStations);

export const StationRoutes = router;