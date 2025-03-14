import express, { NextFunction, Request, Response } from 'express';
import { CommunityController } from './community.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { communityValidation } from './community.validation';

const router = express.Router();


router.post('/questions',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN),fileUploadHandler(), (req:Request, res:Response, next:NextFunction)=>{
 if(req.body.data) {
  req.body = communityValidation.askQuestionZodSchema.parse(
    JSON.parse(req.body.data)
  );
 }   
 CommunityController.askQuestion(req, res, next);
})

router.post('/questions/reply/:id',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN),fileUploadHandler(), (req:Request, res:Response, next:NextFunction)=>{
 if(req.body.data) {
  req.body = communityValidation.replyToQuestionZodSchema.parse(
    JSON.parse(req.body.data)
  );
 }   
 CommunityController.replyToQuestion(req, res, next);
})

router.get('/questions',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), CommunityController.getQuestions);

router.get('/questions/:id',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), CommunityController.getQuestion);



export const CommunityRoutes = router;