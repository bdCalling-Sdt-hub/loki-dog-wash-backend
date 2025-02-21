import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BookingController } from './book.controller';
const router = express.Router();

router.route('/create-booking/:stationId').post(auth(USER_ROLES.USER), BookingController.createBooking);
router.route('/all-booking').get(auth(USER_ROLES.USER), BookingController.getAllBooking);

export const BookingRoutes = router;