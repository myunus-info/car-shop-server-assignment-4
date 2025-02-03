/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import config from '../config';
import handleGlobalError from '../errors/handleGlobalError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode, message, errorSources } = handleGlobalError(err);

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
    err,
  });
};

export default globalErrorHandler;
