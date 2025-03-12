import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ReviewController } from './review.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
const router = express.Router();

router.route('/create-review/:stationId').post(auth(USER_ROLES.USER), validateRequest(ReviewValidation.createReviewZodSchema), ReviewController.createReview);
router.route('/get-review/:stationId').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER), validateRequest(ReviewValidation.getReviewByStationIdZodSchema), ReviewController.getReviewByStationId);

export const ReviewRoutes = router;