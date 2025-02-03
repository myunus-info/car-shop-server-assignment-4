import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { verifyToken } from '../modules/auth/auth.utils';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req?.headers?.authorization &&
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You must log in to get access!');
    }

    const decoded = verifyToken(token, config.jwt.jwt_access_secret as string);
    const { userId, role, iat } = decoded;

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

    // Check if the user has permission
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to perform this action!');
    }

    req.user = user;
    next();
  });
};

export default auth;
