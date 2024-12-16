import express, { Router } from 'express';
import product from './product.routes';
import category from './category.routes';
import vendor from './vendor.routes';
import order from './order.routes';
const router: Router = express.Router();

router.use('/vendor', vendor);
router.use('/product', product);
router.use('/category', category);
router.use('/order', order);

export default router;
