import express from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middleware/validateRequest';
import { ProductValidations } from './product.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLE.admin),
    validateRequest(ProductValidations.createProductValidationSchema),
    ProductControllers.createProduct,
  )
  .get(ProductControllers.getAllProducts);

router
  .route('/:productId')
  .put(
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(ProductValidations.updateProductValidationSchema),
    ProductControllers.updateAProduct,
  )
  .get(ProductControllers.getASpecificProduct)
  .delete(auth(USER_ROLE.admin, USER_ROLE.user), ProductControllers.deleteAProduct);

export const ProductRoutes = router;
