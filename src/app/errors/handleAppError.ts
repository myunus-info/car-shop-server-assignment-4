import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import AppError from './AppError';

const handleAppError = (err: AppError): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err?.message,
    },
  ];

  return {
    statusCode: err?.statusCode,
    message: err?.message,
    errorSources,
  };
};

export default handleAppError;
