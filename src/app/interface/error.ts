import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import AppError from '../errors/AppError';

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};

export type CustomGlobalError =
  | ZodError
  | MongooseError.ValidationError
  | MongooseError.CastError
  | AppError
  | MongoServerError
  | Error;
