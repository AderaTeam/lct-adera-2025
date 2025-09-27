import { HttpStatus } from '@adera/common-enums';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { AppError } from 'src/common/errors';
import { isValidFileName } from 'src/common/utils/validation';

/**
 * Статический класс предоставляющий доступ к константам и некоторым вспомогательным функциям
 */
export class S3 {
  /**
   * Константы
   */
  // SHA256 hash для пустого body в запросе
  static readonly EMPTY_BODY_SHA256: string =
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  static readonly SCHEME = 'AWS4';
  static readonly ALGORITHM = 'HMAC-SHA256';
  static readonly TERMINATOR = 'aws4_request';

  // общие AWS (x-amz-*) заголовки авторизации используемые в подписанных ссылках
  static readonly X_Amz_Algorithm = 'X-Amz-Algorithm';
  static readonly X_Amz_Credential = 'X-Amz-Credential';
  static readonly X_Amz_SignedHeaders = 'X-Amz-SignedHeaders';
  static readonly X_Amz_Date = 'X-Amz-Date';
  static readonly X_Amz_Signature = 'X-Amz-Signature';
  static readonly X_Amz_Expires = 'X-Amz-Expires';
  static readonly X_Amz_Content_SHA256 = 'X-Amz-Content-SHA256';
  static readonly X_Amz_Decoded_Content_Length = 'X-Amz-Decoded-Content-Length';
  static readonly X_Amz_Meta_UUID = 'X-Amz-Meta-UUID';
  static readonly X_Amz_Meta_Original_Name = 'X-Amz-Meta-Original-Name';

  // Regex для поиска множественных пробелов (они будут заменены на 1: multiple whitespace compression)
  static readonly CompressWhitespaceRegex = /\s+/g;

  private static s3BucketURL: string;
  private static s3BucketExternalURL: string | null;

  constructor(private readonly configService: ConfigService) {
    S3.s3BucketExternalURL =
      this.configService.get<string>('S3_EXTERNAL_BUCKET_URL') ?? null;
    S3.s3BucketURL = this.configService.get<string>('S3_BUCKET_URL');
  }

  /**
   * Статические методы
   */

  /**
   * Приводит дату к формату ISO 8601 в упрощённом виде
   * - 'YYYYMMDDTHHmmss' + Z
   * - использование dateFns не подходит, т.к. в результате добавляет часовые пояса и недопустимые разделители, поэтому
   * проще через Date (такой-же алгоритм используется в MiniO js-клиенте)
   */
  static dateToIso8601(date?: Date): string {
    date = date || new Date();
    // '2024-06-30T15:53:31.908Z'
    const s = date.toISOString();
    return (
      s.slice(0, 4) +
      s.slice(5, 7) +
      s.slice(8, 13) +
      s.slice(14, 16) +
      s.slice(17, 19) +
      'Z'
    );
  }

  /**
   * Приводит дату сокращённому формат - 'YYYYMMDD' (без часовых поясов)
   */
  static dateToShortYmdFormat(date?: Date): string {
    date = date || new Date();
    // '2024-06-30T15:53:31.908Z'
    const s = date.toISOString();
    return s.slice(0, 4) + s.slice(5, 7) + s.slice(8, 10);
  }

  /**
   * Метод для кодирования строки данных (data) в формат допустимый по RFC3986
   * - в случае если содержимое является "путём" (isPath), набор допустимых символов расширяется
   */
  static urlEncode(data: string, isPath = false): string {
    // Набор допустимых символов по RFC3986, символы вне этого набора будут закодированы
    const validUrlCharacters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~';

    // в случае если это путь, добавляются ещё два символа: "/" и ":"
    const unreservedChars = isPath
      ? validUrlCharacters + '/:'
      : validUrlCharacters + '';

    let result = '';
    for (const dataSymbol of data) {
      if (unreservedChars.indexOf(dataSymbol) !== -1) {
        result += dataSymbol;
      } else {
        result += '%';
        result += Buffer.from(dataSymbol).toString('hex').toUpperCase();
      }
    }
    return result;
  }

  /**
   * Получение url по objectKey
   * - возвращает null, если objectKey равен null
   */
  static getUrlByObjectKey(objectKey: string | null): string | null {
    if (!objectKey) return null;
    return `${this.s3BucketExternalURL ?? this.s3BucketURL}/${objectKey}`;
  }

  /**
   * Получение url по objectKey
   */
  static getUrlByObjectKeyStrict(objectKey: string): string {
    return `${this.s3BucketExternalURL ?? this.s3BucketURL}/${objectKey}`;
  }

  /**
   * Генерация objectKey на основе названия файла
   */
  static generateObjectKeyByFileName(
    fileName: string,
    options?: { skipValidation?: boolean; forceExtension?: string },
  ): string {
    if (!options?.skipValidation && !isValidFileName(fileName)) {
      throw new AppError({
        errorText: 'wrong file name',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const { fileExtension } = S3.getFileExtensionFromFileName(
      fileName,
      options,
    );
    const yyyyMMdd = S3.dateToShortYmdFormat(new Date());
    return `${yyyyMMdd}_${randomUUID().replace(/-/g, '')}${fileExtension}`;
  }

  /**
   * Получение расширения файла
   */
  static getFileExtensionFromFileName(
    fileName: string,
    options?: { forceExtension?: string },
  ): { fileExtension: string; mbForcedFileName?: string } {
    let fileExtension: string = '';
    let mbForcedFileName: string | undefined = undefined;
    const extensionPointIndex = fileName.lastIndexOf('.');
    if (extensionPointIndex !== -1) {
      fileExtension = fileName.slice(extensionPointIndex);
    }
    if (fileExtension === '' && options?.forceExtension) {
      fileExtension = `.${options.forceExtension}`;
      mbForcedFileName = fileName + fileExtension;
    }
    return { fileExtension, mbForcedFileName };
  }
}
