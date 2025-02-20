import express from 'express';
import { TermsController } from './terms.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route('/create-read').post(auth(USER_ROLES.SUPER_ADMIN), TermsController.createRead);
router.route('/create-work').post(auth(USER_ROLES.SUPER_ADMIN), TermsController.createWork);
router.route('/create-operation').post(auth(USER_ROLES.SUPER_ADMIN), TermsController.createOperation);

router.route('/get-read').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), TermsController.getAllRead);
router.route('/get-work').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), TermsController.getAllWork);
router.route('/get-operation').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), TermsController.getAllOperation);

router.route('/post-read-agreement').post(auth(USER_ROLES.USER), TermsController.ReadAgreement);
router.route('/post-work-agreement').post(auth(USER_ROLES.USER), TermsController.WorksAgreement);
router.route('/post-operation-agreement').post(auth(USER_ROLES.USER), TermsController.OperationAgreement);

export const TermsRoutes = router;