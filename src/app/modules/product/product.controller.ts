/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { TUser } from '../user/user.interface';

const createProduct = catchAsync(async (req, res) => {
  const productData = { ...req.body, owner: req.user._id };
  const product = await ProductServices.createOne(productData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.fetchAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getASpecificProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await ProductServices.fetchOne(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

const updateAProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const user = req.user;
  const productUpdates = req.body;

  const updatedProduct = await ProductServices.updateOne(user as TUser, productId, productUpdates);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

const deleteAProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const user = req.user;

  await ProductServices.deleteOne(productId, user as TUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: {},
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getASpecificProduct,
  updateAProduct,
  deleteAProduct,
};
