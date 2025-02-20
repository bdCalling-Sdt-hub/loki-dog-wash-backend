import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ReviewController } from './review.controller';
const router = express.Router();

router.route('/create-review/:stationId').post(auth(USER_ROLES.USER), ReviewController.createReview);

export const ReviewRoutes = router;