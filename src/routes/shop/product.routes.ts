import express, { Router } from 'express';
import {
  isAuthenticated,
  isAdmin,
  isVendor
} from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as schema from '../../validations/product.schema';
import * as productController from '../../controllers/shop/product.controller';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    isAuthenticated,
    isVendor,
    multerMiddleware.array('images', 5),
    validate(schema.createProduct),
    productController.createProduct
  )
  .get(productController.getAllProducts);
router
  .route('/:id')
  .get(productController.getProduct)
  .put(
    isAuthenticated,
    isVendor,
    multerMiddleware.array('images', 5),
    validate(schema.updateProduct),
    productController.updateProduct
  )
  .delete(isAuthenticated, isAdmin, productController.deleteProduct);

export default router;
