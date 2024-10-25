import express, { Router } from 'express';
// import { isAuthenticated, isAdmin } from 'middleware/auth.middleware';
// import {
//   createProduct,
//   getAllProducts,
//   getProduct,
//   updateProduct,
//   deleteProduct,
// } from 'controllers/product.controller';
const router: Router = express.Router();

// router
//   .route('/')
//   .post(isAuthenticated, isAdmin, createProduct)
//   .get(getAllProducts);
// router
//   .route('/:id')
//   .get(getProduct)
//   .put(isAuthenticated, isAdmin, updateProduct)
//   .delete(isAuthenticated, isAdmin, deleteProduct);

export default router;
