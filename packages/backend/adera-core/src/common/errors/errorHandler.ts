import { HttpStatus } from '@adera/common-enums';

import type { AppError } from './AppError.js';
import { getErrorCommonFields } from './getErrorCommonFields.js';

type HandlerResponse = {
  status: HttpStatus;
  body: {
    errorMessage: string;
    errorScope: string;
    statusCode: HttpStatus;
  };
};

/**
 * Универсальный хендлер ошибки для приложения
 * - перехватывает ошибки выброшенные в роутерах/middleware
 * - производит логирование ошибки
 * - приводит любую ошибку к универсальному формату - HandlerResponse объект с JSON содержимым
 */
export const errorHandler = (
  error: AppError | Error | string | unknown,
): HandlerResponse => {
  const {
    errorScope,
    errorCode,
    errorMessage,
    // errorStack,
    // additionalInfo,
    // logLevel,
  } = getErrorCommonFields(error);

  // const objectToLog = {
  //   message: errorMessage,
  //   scope: errorScope,
  //   statusCode: errorCode,
  //   stack: errorStack,
  //   additionalInfo,
  // }; <- что-то такое можно выводить в логи в будущем

  return {
    status: errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
    body: {
      errorMessage: errorMessage ?? 'an error occurred',
      errorScope,
      statusCode: errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
    },
  };
};
