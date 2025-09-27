import { createHash, createHmac } from 'node:crypto';

import { S3 } from '../s3.utils.js';
import { AWS4SignerBase } from './AWS4SignerBase.js';

/**
 * Подписыватель, который позволяет получить AWS Signature V4 (https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
 * на основе Query-параметров, без явного обращения к клиенту S3
 */
export class AWS4SignerForQueryParameterAuth extends AWS4SignerBase {
  constructor(
    uri: string,
    httpMethod: 'GET' | 'HEAD' | 'PUT',
    service: string,
    region: string,
  ) {
    super(uri, httpMethod, service, region);
  }

  /**
   * Метод вычисления AWS4 подписи авторизации
   * - возвращает строку, содержащую несколько Query-параметров (X-Amz-*) и их значений, что в совокупности отражают
   * "строку авторизации"
   */
  computeSignature(
    headers: Map<string, string>,
    queryParameters: string,
    bodyHash: string,
    awsAccessKey: string,
    awsSecretKey: string,
  ): string {
    const requestDate = new Date();

    // ISO 8601 - 20240628T142843Z в сокращённом формате, без часового пояса
    const dateIso8601 = S3.dateToIso8601(requestDate);
    // только дата в формате yyyyMMdd
    const dateYmd = S3.dateToShortYmdFormat(requestDate);

    // добавление заголовка Host
    /**
     * ```
     * Пример C#
     *    var hostHeader = EndpointUri.Host;
     *    if (!EndpointUri.IsDefaultPort)
     *      hostHeader += ":" + EndpointUri.Port;
     *    headers.Add("Host", hostHeader);
     * ``
     */
    const hostWithUrn = this.endpointUri.includes('https://')
      ? this.endpointUri.split('https://')[1]
      : this.endpointUri.split('http://')[1];
    const host = hostWithUrn !== undefined ? hostWithUrn.split('/')[0] : '';
    const urn = host !== '' ? hostWithUrn.split(host)[1] : '';
    if (!headers.has('Host')) {
      // должно быть: 'localhost:9000';
      headers.set('Host', host);
    }

    const scope = `${dateYmd}/${this.region}/${this.service}/${S3.TERMINATOR}`;

    // Формирование "канонических" строк:
    // - 1 - названия всех заголовков, разделённых по определённым правилам
    // - 2 - заголовок-значение, отформатированные определённым образом
    const canonicalizedHeaderNames = this.canonicalizeHeaderNames(headers);
    const canonicalizedHeaders = this.canonicalizeHeaders(headers);

    // Создание словаря всех заголовков
    // - уже существующие добавляются к словарю
    // - далее будут добавлены заголовки авторизации AWS и некоторые служебные
    // - данные заголовки в последствии будут представлять собой __query__ параметры presignedUrl
    let paramDictionary: Map<string, string> = new Map();
    if (queryParameters !== null && queryParameters !== '') {
      const params = queryParameters.split('&');
      paramDictionary = new Map(
        params.map((p) => {
          const [k, v] = p.split('=');
          return [k, v ?? ''];
        }),
      );
    }

    // Заголовки авторизации AWS Signature V4
    paramDictionary.set(
      S3.X_Amz_Algorithm,
      S3.urlEncode(`${S3.SCHEME}-${S3.ALGORITHM}`),
    );
    paramDictionary.set(
      S3.X_Amz_Credential,
      S3.urlEncode(`${awsAccessKey}/${scope}`),
    );
    paramDictionary.set(
      S3.X_Amz_SignedHeaders,
      S3.urlEncode(canonicalizedHeaderNames),
    );

    // Заголовок даты в базовом формате 8601
    paramDictionary.set(S3.X_Amz_Date, S3.urlEncode(dateIso8601));

    // Преобразование словаря заголовков в "каноническую" строку query-параметров
    // - заголовки сортируются по названию ключа
    // - и склеиваются как обычные http query пар
    let sb = '';
    const keys = [...paramDictionary.keys()];
    const sKeys = keys.sort((a, b) => {
      return a === b ? 0 : a > b ? 1 : -1;
    });
    for (const k of sKeys) {
      if (sb.length > 0) sb += '&';
      sb += `${k}=${paramDictionary.get(k)}`;
    }
    const canonicalizedQueryParameters = sb.toString();

    // Получение "канонической" строки отражающей весь запрос
    const canonicalRequest = this.canonicalizeRequest(
      urn,
      this.httpMethod,
      canonicalizedQueryParameters,
      canonicalizedHeaderNames,
      canonicalizedHeaders,
      bodyHash,
    );

    // шифрация "канонической" строки запроса и получение его SHA256 хэша
    const canonicalRequestHashBytes = createHash('sha256')
      .update(canonicalRequest)
      .digest('hex');

    // формирование строки, которая будет подписана
    let stringToSign = `${S3.SCHEME}-${S3.ALGORITHM}\n${dateIso8601}\n${scope}\n`;
    stringToSign += `${canonicalRequestHashBytes.toLowerCase()}`;

    // получение ключа подписи
    const signingKey = this.deriveSigningKey(
      'sha256',
      awsSecretKey,
      this.region,
      dateYmd,
      this.service,
    );

    // получение подписи AWS v4 - может быть добавлена к query-параметрам в presignedUrl
    const signatureString = createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')
      .toLowerCase();

    // финальное формирование "строки авторизации" - представляет собой набор определённых заголовков AWS и их значений
    let authString = '';
    for (const p of [
      S3.X_Amz_Algorithm,
      S3.X_Amz_Credential,
      S3.X_Amz_Date,
      S3.X_Amz_SignedHeaders,
    ]) {
      if (authString.length > 0) {
        authString += '&';
      }
      authString += `${p}=${paramDictionary.get(p)}`;
    }
    authString += `&${S3.X_Amz_Signature}=${signatureString}`;

    return authString;
  }
}
