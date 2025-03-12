import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { StationController } from './station.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

import { StationValidation } from './station.validation';
const router = express.Router();

router.route('/create-station').post(auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(), (req:Request, res:Response, next:NextFunction)=>{

    if(req.body.data){
        req.body = StationValidation.createStationZodSchema.parse(
            JSON.parse(req.body.data)
        );
    }
    return StationController.createStation(req, res, next);
});

router.patch('/update-station/:id', auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(), (req:Request, res:Response, next:NextFunction)=>{
    if(req.body.data){
        req.body = StationValidation.updateStationZodSchema.parse(
            JSON.parse(req.body.data)
        );
    }
    return StationController.updateStation(req, res, next);
});
router.route('/all-station').get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), StationController.getAllStations);
router.get('/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), StationController.getSingleStation);
export const StationRoutes = router;