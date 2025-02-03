import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    message: 'Users retrieved successfully',
    statusCode: httpStatus.OK,
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await UserServices.getSingleUser(userId);

  sendResponse(res, {
    success: true,
    message: 'User retrieved successfully',
    statusCode: httpStatus.OK,
    data: user,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.changeStatus(userId, req.body);

  sendResponse(res, {
    success: true,
    message: 'User status updated successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req.user._id);

  sendResponse(res, {
    success: true,
    message: 'Profile retrieved successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  getMe,
};
