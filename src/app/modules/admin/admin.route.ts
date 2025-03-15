import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
const router = express.Router();

router
  .route('/admin-profile')
  .get(auth(USER_ROLES.SUPER_ADMIN), AdminController.getUserProfile)
  .patch(
    auth(USER_ROLES.SUPER_ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = AdminValidation.updateAdminZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return AdminController.updateProfile(req, res, next);
    }
  );

router.route('/all-users').get(auth(USER_ROLES.SUPER_ADMIN), AdminController.getAllUsers);
router.get('/general-stats', auth(USER_ROLES.SUPER_ADMIN), AdminController.getGeneralStats);

router.get('/yearly-subscription-data', auth(USER_ROLES.SUPER_ADMIN), AdminController.getYearlySubscriptionDataInMonthlyFormat);
/*router
  .route('/add-admin')
  .post(
    auth(USER_ROLES.SUPER_ADMIN),
    validateRequest(AdminValidation.createAdminZodSchema),
    AdminController.createAdmin
  );


router.route('/all-admin').get(auth(USER_ROLES.SUPER_ADMIN), AdminController.getAllAdmin);
router.route('/update-admin/:id').patch(auth(USER_ROLES.SUPER_ADMIN), AdminController.updateAdminBySuperAdmin);
router.route('/delete-admin/:id').delete(auth(USER_ROLES.SUPER_ADMIN), AdminController.deleteAdminBySuperAdmin);*/


export const AdminRoutes = router;
