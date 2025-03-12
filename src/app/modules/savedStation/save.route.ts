import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SaveController } from './save.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SaveValidation } from './save.validation';
const router = express.Router();

router.route('/save-station/:stationId').post(auth(USER_ROLES.USER), validateRequest(SaveValidation.saveStationZodSchema), SaveController.saveOrRemoveStation);
router.get('/all-saved-station', auth(USER_ROLES.USER), SaveController.getAllSavedStation);

export const SavedRoutes = router;