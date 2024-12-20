import express, { Router } from 'express';
import auth from './auth.routes';
import shop from './shop/index';
import collabForum from './collab-forum/index';
const router: Router = express.Router();

router.use('/auth', auth);
router.use('/shop', shop);
router.use('/collab-forum', collabForum);


export default router;
