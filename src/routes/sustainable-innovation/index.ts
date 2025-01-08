import express from 'express';
import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
import * as sustainableInnovationController from '../../controllers/sustainable-innovation/sustainable-innovation.controller';
import * as schema from '../../validations/sustainable-innovation.schema';
import { validate } from '../../middleware/validate.middleware';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    isAuthenticated,
    multerMiddleware.array('documents', 5),
    validate(schema.createProject),
    sustainableInnovationController.createProject
  )
  .get(
    isAuthenticated,
    isAdmin,
    sustainableInnovationController.getAllProjects
  );

router
  .route('/:id')
  .get(
    isAuthenticated,
    isAdmin,
    sustainableInnovationController.getSingleProject
  )
  .put(
    isAuthenticated,
    isAdmin,
    sustainableInnovationController.changeProjectStatus
  );

export default router;
