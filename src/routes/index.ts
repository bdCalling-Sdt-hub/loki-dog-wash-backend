import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { ContactRoutes } from '../app/modules/contact-us/contact.route';
import { TermsRoutes } from '../app/modules/termsAgreement/terms.route';
import { StationRoutes } from '../app/modules/station/station.route';
import { ReviewRoutes } from '../app/modules/stationReview/review.route';
import { SavedRoutes } from '../app/modules/savedStation/save.route';
import { BookingRoutes } from '../app/modules/booking/book.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { ConnectRoutes } from '../app/modules/connect-with-us/connect.route';
import {  OtherRoutes } from '../app/modules/faq/faq.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { CommunityRoutes } from '../app/modules/community/community.route';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { AboutRoutes } from '../app/modules/about-us/about-us.route';
import { ReferRoutes } from '../app/modules/referFriends/refer.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
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
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/terms',
    route: TermsRoutes
  },
  {
    path: '/notifications',
    route: NotificationRoutes
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
    path: '/saved',
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
    path: '/subscription',
    route: SubscriptionRoutes
  },
  {
    path: '/connect',
    route: ConnectRoutes
  },
  {
    path: '/others',
    route: OtherRoutes
  },
  {
    path: '/community',
    route: CommunityRoutes
  },
  {
    path: '/about',
    route: AboutRoutes
  },
  {
    path: '/refer',
    route: ReferRoutes
  },
  { path: '/rule', route: RuleRoutes },
  { path: "/contact", route: ContactRoutes }

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
