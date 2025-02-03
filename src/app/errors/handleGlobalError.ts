import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';

// Local imports
import handleZodError from './handleZodError';
import handleValidationError from './handleValidationError';
import handleCastError from './handleCastError';
import AppError from './AppError';
import handleDuplicateError from './handleDuplicateError';
import handleAppError from './handleAppError';
import handleGenericError from './handleGenericError';
import { CustomGlobalError, TGenericErrorResponse } from '../interface/error';

const handleGlobalError = (err: CustomGlobalError): TGenericErrorResponse => {
  if (err instanceof ZodError) return handleZodError(err);
  if (err instanceof MongooseError.ValidationError && err?.name === 'ValidationError')
    return handleValidationError(err);
  if (err instanceof MongooseError.CastError && err?.name === 'CastError')
    return handleCastError(err);
  if (err instanceof MongoServerError && err?.code === 11000) return handleDuplicateError(err);
  if (err instanceof AppError) return handleAppError(err);
  if (err instanceof Error) return handleGenericError(err);

  return {
    statusCode: 500,
    message: 'Internal Server Error',
    errorSources: [{ path: '', message: 'Something went wrong!' }],
  };
};

export default handleGlobalError;
