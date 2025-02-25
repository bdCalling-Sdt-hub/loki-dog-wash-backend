import express from 'express';
import { contactController } from './contact.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ContactValidation } from './contact.validation';

const router = express.Router();

router.route('/contact-us').post(validateRequest(ContactValidation.createContactZodSchema), contactController.createContact);

export const ContactRoutes = router;