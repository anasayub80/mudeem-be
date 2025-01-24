import express from 'express';
import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
import * as wasteController from '../../controllers/waste/waste.controller';
// import * as schema from '../../validations/waste.schema';
import { validate } from '../../middleware/validate.middleware';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/company')
  .post(
    isAuthenticated,
    isAdmin,
    // multerMiddleware.array('documents', 5),
    // validate(schema.createProject),
    wasteController.createCompany
  )
  .get(
    isAuthenticated,
    // isAdmin,
    wasteController.getAllCompanies
  );

router
  .route('/company/:id')
  .delete(isAuthenticated, isAdmin, wasteController.deleteCompany);

router
  .route('/request')
  .post(
    isAuthenticated,
    // validate(schema.createRequest),
    wasteController.createRequest
  )
  .get(isAuthenticated, wasteController.getAllRequests);

router
  .route('/request/:id')
  .get(isAuthenticated, wasteController.getRequestById)

router
  .route('/request/approve-reject/:id')
  .put(isAuthenticated, isAdmin, wasteController.approveRejectRequest);

export default router;
