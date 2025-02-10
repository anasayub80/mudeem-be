import express from 'express';
import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import * as academyController from '../../controllers/academy/book.controller';
import multerMiddleware from '../../middleware/multer.middleware';
// import * as schema from '../../validations/academy.schema';
// import { validate } from '../../middleware/validate.middleware';

const router: Router = express.Router();

router
  .route('/book')
  .post(
    isAuthenticated,
    multerMiddleware.fields([
      { name: 'cover', maxCount: 1 },
      { name: 'file', maxCount: 1 }
    ]),
    // validate(schema.createAcademy),
    academyController.createBook
  )
  .get(isAuthenticated, academyController.getAllBooks);

router
  .route('/book/:id')
  .get(isAuthenticated, academyController.getBook)
  .patch(
    isAuthenticated,
    // validate(schema.updateAcademy),
    multerMiddleware.fields([
      { name: 'cover', maxCount: 1 },
      { name: 'file', maxCount: 1 }
    ]),
    academyController.updateBook
  )
  .delete(isAuthenticated, academyController.deleteBook);

router.route('/book/mine').get(isAuthenticated, academyController.getMyBooks);

router
  .route('/book/purchase/:id')
  .put(isAuthenticated, academyController.purchaseBook);

router.route('/book/download/:id');
//   .get(isAuthenticated, academyController.downloadBook);

export default router;
