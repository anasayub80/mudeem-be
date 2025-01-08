import express, { Router } from 'express';
import auth from './auth.routes';
import shop from './shop/index';
import collabForum from './collab-forum/index';
import greenMap from './green-map/index';
import sustainableInnovation from './sustainable-innovation/index';
const router: Router = express.Router();

router.use('/auth', auth);
router.use('/shop', shop);
router.use('/collab-forum', collabForum);
router.use('/green-map', greenMap);
router.use('/sustainable-innovation', sustainableInnovation);


export default router;
