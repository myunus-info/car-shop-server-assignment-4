import express from 'express';
import { OrderControllers } from './order.controller';
import validateRequest from '../../middleware/validateRequest';
import { OrderValidations } from './order.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/all-orders', auth(USER_ROLE.admin), OrderControllers.getAllOrders);

router
  .route('/')
  .post(
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(OrderValidations.createOrderValidationSchema),
    OrderControllers.createOrder,
  )
  .get(auth(USER_ROLE.admin, USER_ROLE.user), OrderControllers.getAllOrdersOfSingleUser);

router
  .route('/:orderId')
  .get(auth(USER_ROLE.admin, USER_ROLE.user), OrderControllers.getSingleOrder)
  .patch(auth(USER_ROLE.admin), OrderControllers.updateOrderStatus);

router.post('/verify', auth(USER_ROLE.user, USER_ROLE.admin), OrderControllers.verifyPayment);

router.get('/revenue', OrderControllers.calculateRevenueFromOrders);

export const OrderRoutes = router;
