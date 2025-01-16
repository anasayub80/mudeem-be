import express from 'express';
import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
// import * as wasteController from '../../controllers/waste/waste.controller';
// import * as schema from '../../validations/waste.schema';
import { validate } from '../../middleware/validate.middleware';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();


export default router;