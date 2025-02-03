/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
}

export interface UserModel extends Model<TUser> {
  doesUserExistByEmail(email: string): Promise<TUser>;

  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;

  isJWTIssuedBeforePasswordChange(
    passwordChangeTime: Date,
    jwtIssuedTimestamp: number,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
