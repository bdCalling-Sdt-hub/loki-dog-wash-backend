import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ReviewController } from './review.controller';
const router = express.Router();

router.route('/create-review/:stationId').post(auth(USER_ROLES.USER), ReviewController.createReview);
router.route('/get-review/:stationId').get(auth(USER_ROLES.SUPER_ADMIN), ReviewController.getReviewByStationId);

export const ReviewRoutes = router;