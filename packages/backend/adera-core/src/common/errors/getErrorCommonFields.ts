import { HttpStatus } from '@adera/common-enums';

import { AppError } from './AppError.js';

/**
 * Функция, вытаскивает основные данные из разных ошибок:
 * - определяет, чем является ошибка - экземплярами AppError, Error или просто строкой
 * - возвращает текст ошибки, по-возможности - скоуп и стэк трассировки, http код, additionalInfo и уровень логирования
 */
export function getErrorCommonFields(
  error: AppError | Error | string | unknown,
): {
  errorMessage: string;
  errorScope: string | undefined;
  errorCode: HttpStatus;
  errorStack: string | undefined;
  additionalInfo: string | undefined;
  // logLevel: string | undefined;
} {
  const isAppError = error instanceof AppError;
  const isErrorInstance = error instanceof Error;
  const isString = typeof error === 'string';
  return {
    errorMessage: isAppError
      ? error.errorText
      : isErrorInstance
        ? error.message
        : isString
          ? error
          : 'unknown error',
    errorScope: isAppError ? error.errorScope : undefined,
    errorCode: isAppError ? error.statusCode : HttpStatus.INTERNAL_SERVER_ERROR,
    errorStack: isAppError || isErrorInstance ? error.stack : undefined,
    additionalInfo: isAppError ? error.additionalInfo : undefined,
    // logLevel: isAppError ? error.logLevel : undefined
  };
}
