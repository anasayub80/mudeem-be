import express, { Router } from 'express';
import auth from './auth.routes';
import shop from './shop/index';
import collabForum from './collab-forum/index';
import greenMap from './green-map/index';
import events from './events/index';
import sustainableInnovation from './sustainable-innovation/index';
import farm from './farm/index';
import waste from './waste/index';

import contentCreator from './content-creator/index';
import academy from './academy/index';
import gpt from './gpt/index';
import careers from './careers/index';
const router: Router = express.Router();

router.use('/auth', auth);
router.use('/shop', shop);
router.use('/collab-forum', collabForum);
router.use('/green-map', greenMap);
router.use('/events', events);
router.use('/sustainable-innovation', sustainableInnovation);
router.use('/farm', farm);
router.use('/waste', waste);

router.use('/content-creator', contentCreator);
router.use('/academy', academy);
router.use('/gpt', gpt);
router.use('/careers', careers);

export default router;
