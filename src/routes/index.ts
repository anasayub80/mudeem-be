import express, { Router } from 'express';
import auth from './auth.routes';
import shop from './shop/index';
const router: Router = express.Router();

router.use('/auth', auth);
router.use('/shop', shop);


export default router;
