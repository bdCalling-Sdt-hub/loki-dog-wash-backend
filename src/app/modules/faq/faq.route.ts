import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { FaqController } from './faq.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FaqValidation } from './faq.validation';
const router = express.Router();

router.post('/createOrUpdateOthers', auth(USER_ROLES.SUPER_ADMIN), validateRequest(FaqValidation.createOrUpdateOthersZodSchema), FaqController.createOrUpdateOthers);
router.get('/getOthers/:type', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), FaqController.getOthers);
router.post('/faq', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), validateRequest(FaqValidation.addQuestionAndAnswerZodSchema), FaqController.addQuestionAndAnswer);
router.delete('/faq/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), validateRequest(FaqValidation.removeQuestionAndAnswerZodSchema), FaqController.removeQuestionAndAnswer);
router.patch('/faq/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), validateRequest(FaqValidation.updateQuestionAndAnswerZodSchema), FaqController.updateQuestionAndAnswer);
router.get('/faq', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), FaqController.getFaq);

export const OtherRoutes = router;