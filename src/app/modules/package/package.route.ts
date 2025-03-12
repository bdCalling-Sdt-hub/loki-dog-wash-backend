import express from 'express';
import { PackageController } from './package.contoller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PackageValidation } from './package.validation';
const router = express.Router();

router
  .route('/create-package')
  .post(auth(USER_ROLES.SUPER_ADMIN), validateRequest(PackageValidation.createPackageZodSchema), PackageController.createPackage);

router
  .route('/get-all-packages')
  .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), PackageController.getAllPackages);

router
  .route('/get-single-package/:id')
  .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), validateRequest(PackageValidation.getSinglePackageZodSchema), PackageController.getSinglePackage);

router
  .route('/update-package/:id')
  .patch(auth(USER_ROLES.SUPER_ADMIN), validateRequest(PackageValidation.updatePackageZodSchema), PackageController.updatePackage);

router
  .route('/delete-package/:id')
  .delete(auth(USER_ROLES.SUPER_ADMIN), validateRequest(PackageValidation.deletePackageZodSchema), PackageController.deletePackage);

export const PackageRoutes = router;
