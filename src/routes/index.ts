import express, { Router } from 'express';
import auth from './auth.routes';
import shop from './shop/index';
import collabForum from './collab-forum/index';
import greenMap from './green-map/index';
import events from './events/index';
import sustainableInnovation from './sustainable-innovation/index';
import farm from './farm/index';
const router: Router = express.Router();

router.use('/auth', auth);
router.use('/shop', shop);
router.use('/collab-forum', collabForum);
router.use('/green-map', greenMap);
router.use('/events', events);
router.use('/sustainable-innovation', sustainableInnovation);
router.use('/farm', farm);

export default router;
