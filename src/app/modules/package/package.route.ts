import express from 'express';
import { PackageController } from './package.contoller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router
  .route('/create-package')
  .post(auth(USER_ROLES.SUPER_ADMIN), PackageController.createPackage);

router
  .route('/get-all-packages')
  .get(auth(USER_ROLES.SUPER_ADMIN), PackageController.getAllPackages);

router
  .route('/get-single-package/:id')
  .get(auth(USER_ROLES.SUPER_ADMIN), PackageController.getSinglePackage);

router
  .route('/update-package/:id')
  .patch(auth(USER_ROLES.SUPER_ADMIN), PackageController.updatePackage);

router
  .route('/delete-package/:id')
  .delete(auth(USER_ROLES.SUPER_ADMIN), PackageController.deletePackage);

export const PackageRoutes = router;
