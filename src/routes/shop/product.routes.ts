import express, { Router } from 'express';
import {
  isAuthenticated,
  isAdmin,
  isVendor
} from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
// import * as schema from '../../validations/product.schema';
import * as productController from '../../controllers/shop/product.controller';
const router: Router = express.Router();

router
  .route('/')
  .post(isAuthenticated, isAdmin, productController.createProduct)
  .get(productController.getAllProducts);
router
  .route('/:id')
  .get(productController.getProduct)
  .put(isAuthenticated, isAdmin, productController.updateProduct)
  .delete(isAuthenticated, isAdmin, productController.deleteProduct);

export default router;
