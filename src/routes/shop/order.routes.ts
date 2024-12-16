import express from 'express';
import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import * as orderController from '../../controllers/shop/order.controller';
import * as schema from '../../validations/order.schema';
import { validate } from '../../middleware/validate.middleware';

const router: Router = express.Router();

router
  .route('/checkout')
  .post(
    isAuthenticated,
    validate(schema.checkoutSchema),
    orderController.checkout
  );

router
  .route('/')
  .get(isAuthenticated, orderController.getOrders)
  .post(
    isAuthenticated,
    validate(schema.createOrderSchema),
    orderController.createOrder
  )
  .patch(
    isAuthenticated,
    validate(schema.updateStatusSchema),
    orderController.updateOrderStatus
  );

export default router;
