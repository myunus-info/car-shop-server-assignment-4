/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { TUser } from '../user/user.interface';

const createOrder = catchAsync(async (req, res) => {
  const user = req.user as TUser;

  const order = await OrderServices.createOrder(user, req.body, req.ip as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await OrderServices.getAllOrders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});

const getAllOrdersOfSingleUser = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const orders = await OrderServices.getAllOrdersOfSingleUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: orders,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await OrderServices.getSingleOrder(userId, orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: order,
  });
});
const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await OrderServices.updateOrderStatus(orderId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const { order_id } = req.query;
  const order = await OrderServices.verifyPayment(order_id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

const calculateRevenueFromOrders = catchAsync(async (req, res) => {
  const totalRevenue = await OrderServices.calculateRevenue();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue calculated successfully',
    data: { totalRevenue },
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrdersOfSingleUser,
  getSingleOrder,
  updateOrderStatus,
  getAllOrders,
  verifyPayment,
  calculateRevenueFromOrders,
};
