/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { TErrorSources, TGenericErrorResponse } from './../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err?.message.match(/"([^"]*)"/);
  const extractedMsg = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMsg} already exists!`,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate Field Error',
    errorSources,
  };
};

export default handleDuplicateError;
