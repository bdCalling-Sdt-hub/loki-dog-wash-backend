import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ConnectWithUsController } from './connect.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ConnectWithUsValidation } from './connect.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();

router.route('/create-connect').post(auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(),(req: Request, res: Response, next: NextFunction) => {
    if(req?.body?.data){
        req.body = ConnectWithUsValidation.createConnectWithUsZodSchema.parse(
            JSON.parse(req.body.data)
        );
    }
    return ConnectWithUsController.createConnectWithUs(req, res, next);
});
router.route('/get-connect').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), ConnectWithUsController.getConnectWithUs);

router.patch('/update-connect/:id', auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(),(req: Request, res: Response, next: NextFunction) => {
    if(req?.body?.data){
        req.body = ConnectWithUsValidation.updateConnectWithUsZodSchema.parse(
            JSON.parse(req.body.data)
        );
    }
    return ConnectWithUsController.updateConnectWithUs(req, res, next);
});

router.delete('/delete-connect/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), ConnectWithUsController.deleteConnectWithUs)

export const ConnectRoutes = router;