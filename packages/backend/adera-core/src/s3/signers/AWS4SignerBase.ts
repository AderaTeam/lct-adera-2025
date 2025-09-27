import { createHmac } from 'node:crypto';

import { S3 } from '../s3.utils.js';

/**
 * Класс, содержащий общие методы и свойства для всех AWS "подписывателей"
 */
export class AWS4SignerBase {
  // настраиваемые свойства:
  public readonly endpointUri: string;
  public readonly httpMethod: 'GET' | 'PUT' | 'HEAD';
  public readonly service: string;
  public readonly region: 'us-east-1' | string;

  constructor(uri: string, httpMethod: 'GET' | 'PUT' | 'HEAD', service: string, region: string) {
    this.endpointUri = uri;
    this.httpMethod = httpMethod;
    this.service = service;
    this.region = region;
  }

  /**
   * Возвращает "каноническую" строку, состоящую из __названий__ "AWS" заголовков
   * - сортировка по возрастанию
   * - приведение к нижнему регистру и разделение через ";"
   */
  protected canonicalizeHeaderNames(headers: Map<string, string>): string {
    if (headers === null || headers.size === 0) {
      return '';
    }
    const headersKeys = [...headers.keys()];
    const sortedHeaderKeys = headersKeys.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    let result = '';
    for (const header of sortedHeaderKeys) {
      if (result.length > 0) {
        result += ';';
      }
      result += header.toLowerCase();
    }
    return result;
  }

  /**
   * Возвращает "каноническую" строку, состоящую из "AWS" заголовков и их значений
   * - сортировка по возрастанию (при сортировке хедеры приводятся к нижнему регистру)
   * - формат: `${заголовок}:${значение}\n"
   * - значение заголовка подвергается сжатию - "whitespace compression"
   */
  protected canonicalizeHeaders(headers: Map<string, string>): string {
    if (headers === null || headers.size === 0) {
      return '';
    }
    // формирование новой Map заголовков в отсортированном порядке
    const headersKeys = [...headers.keys()];
    const sortedHeaderKeys = headersKeys.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    const sortedHeaderMap = new Map<string, string>();
    for (const header of sortedHeaderKeys) {
      sortedHeaderMap.set(header.toLowerCase(), headers.get(header)!);
    }
    // формирование результирующей строки "AWS" заголовков
    let result = '';
    for (const header of sortedHeaderMap.keys()) {
      const headerValue = sortedHeaderMap.get(header)!.replace(S3.CompressWhitespaceRegex, ' ').trim();
      result += `${header}:${headerValue}\n`;
    }
    return result;
  }

  /**
   * Возвращает "каноническую" строку самого запроса. Состоит из нескольких частей
   * - canonicalizedHeaderNames - "каноническая" строка __названий__ заголовков - должны быть отсортированы и разделены ";"
   * - canonicalizedHeaders - "каноническая строка __заголовков__ - отсортированы, значения прошли сжатие (whitespace compression)
   * и отформатированы соответствующим образом
   * - bodyHash - вычисленный хэш SHA256 контента в теле запроса. В случае "chunked" запросов должен быть установлен в ''.
   *
   * - returns - String representing the canonicalized request for signing
   */
  protected canonicalizeRequest(
    endpointUri: string,
    httpMethod: 'GET' | 'PUT' | 'HEAD',
    queryParameters: string,
    canonicalizedHeaderNames: string,
    canonicalizedHeaders: string,
    bodyHash: string
  ): string {
    let canonicalRequest = '';

    canonicalRequest += `${httpMethod}\n`;
    canonicalRequest += `${this.canonicalResourcePath(endpointUri)}\n`;
    canonicalRequest += `${queryParameters}\n`;
    canonicalRequest += `${canonicalizedHeaders}\n`;
    canonicalRequest += `${canonicalizedHeaderNames}\n`;

    canonicalRequest += `${bodyHash}`;

    return canonicalRequest;
  }

  /**
   * Возвращает "каноническую" строку "адреса ресурса"
   * - кодирует строку в соответствии с RFC3986
   *
   * URI - Uniform Resource Identifier (унифицированный идентификатор ресурса)
   * URL - Uniform Resource Locator (унифицированный определитель местонахождения ресурса)
   * URN - Uniform Resource Name (унифицированное имя ресурса)
   *
   * URL - https://wiki.merionet.ru
   * URN - images/vse-chto-vam-nuzhno-znat-pro-devops/1.png
   * URI = [URL + URN] https://wiki.merionet.ru/images/vse-chto-vam-nuzhno-znat-pro-devops/1.png
   */
  protected canonicalResourcePath(endpointUri: string): string {
    if (endpointUri === null || endpointUri === '') {
      return '/';
    }
    return S3.urlEncode(endpointUri, true);
  }

  /**
   * Получение ключа подписи для авторизации. Состоит из нескольких стадий шифрации
   * - algorithm - криптографический алгоритм используемый при шифровании (SHA256)
   * - awsSecretKey - AWS SecretKey
   * - region - регион хранилища или bucket-а
   * - date - дата в сокращённом формате yyyyMMdd
   * - service - название сервиса, вызываемого запросом (s3)
   *
   * - возвращает ключ, который может быть использован для подписи авторизации (ещё одного вычисления хэша)
   */
  protected deriveSigningKey(
    algorithm: string,
    awsSecretKey: string,
    region: string,
    date: string,
    service: string
  ): Buffer {
    const initialKey = S3.SCHEME + awsSecretKey;
    const hmac1 = createHmac(algorithm, initialKey).update(date).digest();
    const hmac2 = createHmac(algorithm, hmac1).update(region).digest();
    const hmac3 = createHmac(algorithm, hmac2).update(service).digest();
    return createHmac(algorithm, hmac3).update(S3.TERMINATOR).digest();
  }
}
