import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import validator from 'validator';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email address',
      },
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      required: [true, 'Password is required'],
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
  next();
});

userSchema.statics.doesUserExistByEmail = async function (email) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = async function (
  passwordChangeDate: Date,
  jwtIssuedTimeInSeconds: number,
) {
  const passwordChangeTimeInSeconds = Math.ceil(new Date(passwordChangeDate).getTime() / 1000);

  return passwordChangeTimeInSeconds > jwtIssuedTimeInSeconds;
};

export const User = model<TUser, UserModel>('User', userSchema);
