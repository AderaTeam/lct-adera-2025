import { addDays, differenceInSeconds } from 'date-fns';

import { Injectable } from '@nestjs/common';
import { AWS4SignerForQueryParameterAuth } from './signers/AWS4SignerForQueryParameterAuth';
import { AppError } from 'src/common/errors';
import { S3 } from './s3.utils';
import { ConfigService } from '@nestjs/config';

/**
 * Сервис для взаимодействия с S3-совместимым хранилищем
 * - отвечает за генерацию различных presign-ссылок
 */
@Injectable()
export class S3Service {
  /**
   * Основные настройки, которые будут использованы для генерации различных presignedUrl
   */
  private readonly s3: {
    serviceName: string;
    accessKey: string;
    secretKey: string;
    region: string;
    bucketUrl: string;
    externalBucketUrl?: string | null;
  };

  constructor(private readonly configService: ConfigService) {
    this.s3 = {
      serviceName: 's3',
      accessKey: this.configService.get<string>('S3_ACCESS_KEY'),
      secretKey: this.configService.get<string>('S3_SECRET_KEY'),
      region: 'us-east-1',
      bucketUrl: this.configService.get<string>('S3_BUCKET_URL'),
      externalBucketUrl: this.configService.get<string>(
        'S3_EXTERNAL_BUCKET_URL',
      ),
    };
  }

  /**
   * Создание presign ссылки для доступа к объекту "objectKey"
   * - версия подписи - AWS Signature Version 4 (https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
   * - регион по умолчанию - es-east-1, т.к. в minio баг
   * - expirationDays
   */
  private generatePresignedUrl(
    method: 'GET' | 'PUT' | 'HEAD',
    objectKey: string,
    expirationDays = 2,
    autoDownloadAttachment?: boolean | null,
  ): string {
    if (expirationDays > 7) {
      throw new AppError({
        errorText: 'max expiration days for s3 presigned url is 7',
      });
    }

    // формирование Endpoint-а с учётом bucket и названия файла (objectKey)
    /**
     * У AWS-like название бакета внутри домена, пример AWS:
     *
     * ```
     * Java:
     *         URL endpointUrl;
     *         try {
     *             if (regionName.equals("us-east-1")) {
     *                 endpointUrl = new URL("https://s3.amazonaws.com/" + bucketName + "/ExampleObject.txt");
     *             } else {
     *                 endpointUrl = new URL("https://s3-" + regionName + ".amazonaws.com/" + bucketName + "/ExampleObject.txt");
     *             }
     *         } catch (MalformedURLException e) {
     *             throw new RuntimeException("Unable to parse service endpoint: " + e.getMessage());
     *         }
     *
     * C#:
     *        var endpointUri = string.Format("https://{0}.s3{1}.amazonaws.com/{2}",
     *                                           bucketName,
     *                                           regionUrlPart,
     *                                           objectKey);
     *
     * ```
     *
     * У Minio путь до объекта идёт после названия бакета:
     * ```
     *    const endpointUri = `http://localhost:9000/${bucket_name}/${objectKey}`;
     * ```
     */
    const endpointUri = `${this.s3.bucketUrl}/${objectKey}`;

    // фомирование строки с query-параметрами presignedUrl
    let queryParams = '';
    const expiresOn = addDays(new Date(), expirationDays);
    const currentDate = new Date();
    const period = differenceInSeconds(expiresOn, currentDate);
    queryParams += `${S3.X_Amz_Expires}=${S3.urlEncode(period.toString())}`;
    const downloadFile = method === 'GET' && autoDownloadAttachment;
    if (downloadFile) {
      queryParams += '&';
      queryParams += `response-content-disposition=${S3.urlEncode('attachment; filename=' + objectKey)}`;
    }

    // создание объекта "подписывателя", тип зависит от того какую именно presignedUrl необходимо сгенерировать
    const signer = new AWS4SignerForQueryParameterAuth(
      endpointUri,
      method,
      this.s3.serviceName,
      this.s3.region,
    );

    // Получение сигнатуры авторизации (набор X-Amz-* заголовков и их значений)
    const headers = new Map<string, string>();
    if (downloadFile) {
      headers.set(
        'response-content-disposition',
        `attachment; filename=${objectKey}`,
      );
    }
    if (method === 'PUT') {
      headers.set('x-amz-meta-source', 'adera-admin');
    }

    const authorization = signer.computeSignature(
      headers,
      queryParams,
      'UNSIGNED-PAYLOAD',
      this.s3.accessKey,
      this.s3.secretKey,
    );

    // формирование ссылки для чтения из s3-хранилища
    let presignedUrl = `${endpointUri}?${queryParams}&${authorization}`;

    // опционально: в случае, если s3 развёрнут на другом домене - можно заменить URL до бакета:
    if (this.s3.externalBucketUrl) {
      const externalPresignedUrl = `${this.s3.externalBucketUrl}/${objectKey}?${queryParams}&${authorization}`;
      presignedUrl = externalPresignedUrl;
    }

    return presignedUrl;
  }

  /**
   * Формирование ссылки на получение доступа к файлу "objectKey"
   */
  presignedGetObject(
    objectKey: string,
    autoDownloadAttachment: boolean,
    expirationDays = 2,
  ): string {
    return this.generatePresignedUrl(
      'GET',
      objectKey,
      expirationDays,
      autoDownloadAttachment,
    );
  }

  /**
   * Формирование ссылки на загрузку файла "objectKey" в bucketName
   */
  presignedPutObject(objectKey: string, expirationDays = 2): string {
    return this.generatePresignedUrl('PUT', objectKey, expirationDays);
  }

  /**
   * Формирование ссылки на получение метаданные
   */
  presignedHeadObject(objectKey: string, expirationDays = 2): string {
    return this.generatePresignedUrl('HEAD', objectKey, expirationDays);
  }
}
