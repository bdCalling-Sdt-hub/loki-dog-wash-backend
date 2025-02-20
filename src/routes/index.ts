import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
//import { AdminRoutes } from '../app/modules/admin/admin.route';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { ContactRoutes } from '../app/modules/contact-us/contact.route';
import { TermsRoutes } from '../app/modules/termsAndConditions/terms.route';
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
  
  { path: '/rule', route: RuleRoutes },
  { path: "/contact", route: ContactRoutes }

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
