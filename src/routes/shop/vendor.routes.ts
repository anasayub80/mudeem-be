import express, { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as schema from '../../validations/vendor.schema';
import * as vendorController from '../../controllers/shop/vendor.controller';

const router: Router = express.Router();

router.route('/').get(isAuthenticated, isAdmin, vendorController.getAllVendors);
router
  .route('/:id')
  .patch(
    isAuthenticated,
    isAdmin,
    validate(schema.approveVendor),
    vendorController.approveVendor
  );
router
  .route('/:id')
  .delete(isAuthenticated, isAdmin, vendorController.deleteVendor);

export default router;
