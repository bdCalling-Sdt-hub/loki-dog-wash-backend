import express from 'express';
import { contactController } from './contact.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ContactValidation } from './contact.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.route('/contact-us').post(validateRequest(ContactValidation.createContactZodSchema),auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER, USER_ROLES.ADMIN), contactController.createContact);

router.get('/all',auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), contactController.getContacts);

router.get('/:id',auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), contactController.getSingleContact);

router.delete('/:id',auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), contactController.removeContact);

export const ContactRoutes = router;