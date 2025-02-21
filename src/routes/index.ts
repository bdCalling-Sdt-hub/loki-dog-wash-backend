import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
//import { AdminRoutes } from '../app/modules/admin/admin.route';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { ContactRoutes } from '../app/modules/contact-us/contact.route';
import { TermsRoutes } from '../app/modules/termsAgreement/terms.route';
import { StationRoutes } from '../app/modules/station/station.route';
import { ReviewRoutes } from '../app/modules/stationReview/review.route';
import { SavedRoutes } from '../app/modules/savedStation/save.route';
import { BookingRoutes } from '../app/modules/booking/book.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { ConnectRoutes } from '../app/modules/connect-with-us/connect.route';
const router = express.Router();

router.use('/payment/webhook', express.raw({ type: 'application/json' }));

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/terms',
    route: TermsRoutes
  },
  {
    path: '/station',
    route: StationRoutes
  },
  {
    path: '/station',
    route: ReviewRoutes
  },
  {
    path: '/station',
    route: SavedRoutes
  },
  {
    path: '/booking',
    route: BookingRoutes
  },
  {
    path: '/package',
    route: PackageRoutes
  },
  {
    path: '/connect',
    route: ConnectRoutes
  },
  { path: '/rule', route: RuleRoutes },
  { path: "/contact", route: ContactRoutes }

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
