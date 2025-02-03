import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleGenericError = (err: Error): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err?.message,
    },
  ];

  return {
    statusCode: 500,
    message: err?.message,
    errorSources,
  };
};

export default handleGenericError;
