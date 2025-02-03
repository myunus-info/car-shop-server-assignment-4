import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from './user.model';

const getAllUsers = async () => {
  const users = await User.find({ role: 'user' }).select('-password');
  return users;
};

const getSingleUser = async (id: string) => {
  const users = await User.findOne({ _id: id, role: 'user' }).select('-password');
  return users;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, { $set: payload }, { new: true });
  return result;
};

const getMe = async (userId: string) => {
  const result = await User.findById(userId);

  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');

  return result;
};

export const UserServices = {
  getAllUsers,
  getSingleUser,
  changeStatus,
  getMe,
};
