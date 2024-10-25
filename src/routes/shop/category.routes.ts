import express, { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as schema from '../../validations/category.schema';
import * as categoryController from '../../controllers/shop/category.controller';
// import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  //   .get(isAuthenticated, categoryController.getAllCategories)
  .post(
    isAuthenticated,
    isAdmin,
    // multerMiddleware.single('image'),
    validate(schema.createCategory),
    categoryController.createCategory
  );
// router
//   .route('/:id')
//   .get(isAuthenticated, categoryController.getCategory)
//   .put(
//     isAuthenticated,
//     isAdmin,
//     multerMiddleware.single('image'),
//     validate(schema.updateCategory),
//     categoryController.updateCategory
//   )
//   .delete(isAuthenticated, isAdmin, categoryController.deleteCategory);

export default router;
