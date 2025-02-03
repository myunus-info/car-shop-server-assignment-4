import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../config';
import { generateToken, verifyToken } from './auth.utils';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

const registerUserIntoDB = async (payload: TUser) => {
  const user = await User.doesUserExistByEmail(payload.email);
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user already exists!');
  }

  const result = await User.create(payload);

  return {
    _id: result._id,
    name: result.name,
    email: result.email,
    role: result.role,
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  // Check if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Check if the password is correct
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expires_in as string,
  );

  return { accessToken, refreshToken };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findById(userData._id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // Check if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Check if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!');
  }

  // Hash password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const res = await User.findOneAndUpdate(
    { _id: userData._id, role: userData.role },
    { password: newHashedPassword, passwordChangedAt: new Date() },
    { runValidators: true, new: true },
  );

  if (!res) throw new AppError(httpStatus.BAD_REQUEST, 'Password was not changed!');

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt.jwt_refresh_secret as string);
  const { userId, iat } = decoded;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // Check if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (
    user.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'JWT expired!');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  return { accessToken };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  changePassword,
};
