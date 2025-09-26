import { HttpStatus } from '@adera/common-enums';

/**
 * Поля для создания универсального объекта ошибки - AppError
 */
type AppErrorConstructorFields = {
  errorText: string;
  errorScope?: string;
  statusCode?: number;
  additionalInfo?: string;
  // logLevel?: PinoLogLevel; <- спокойно в будущем можно будет прикрутить pino
};

/**
 * Универсальный объект ошибки
 * - используется для унификации объектов ошибок REST API
 * - позволяет однозначно настроить логирование (для REST-API - middleware)
 * - позволяет гарантировать наличие полей для frontend, чтобы тот мог понять к какой логической области принадлежит ошибка
 */
export class AppError extends Error {
  readonly errorText: string;
  readonly errorScope: string;
  readonly statusCode: number;
  readonly additionalInfo: string | undefined;
  // readonly logLevel: PinoLogLevel | undefined;

  constructor(readonly errorFields: AppErrorConstructorFields) {
    super(errorFields.errorText);
    this.errorText = errorFields.errorText;
    this.errorScope = errorFields.errorScope ?? 'adera-core-api';
    this.statusCode =
      errorFields.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.additionalInfo = errorFields.additionalInfo;
    // this.logLevel = errorFields.logLevel;
  }
}
