import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthFetch } from '@adera/auth-fetch';
import { ApiFile } from 'store/_types';

interface PresignedUrlResponse {
  generatedObjectKey: string;
  presignedUrl: string;
}

export interface UseFileUploadArgs {
  onFileUpload?: (file: ApiFile | null) => void;
  validTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
}

export const useFileUpload = ({ validTypes, maxSize, maxFiles, onFileUpload }: UseFileUploadArgs) => {
  const authFetch = useAuthFetch();
  const { mutateAsync: getFilePresignedUrl } = useMutation<PresignedUrlResponse, Error, string>({
    mutationFn: (fileName: string) =>
      authFetch('/s3/presignedUrl', {
        method: 'PUT',
        body: JSON.stringify({ fileName }),
        headers: { 'Content-Type': 'application/json' }
      })
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Проверяет файл на допустимость по типу и размеру
   */
  const isValid = useCallback(
    (file: File): boolean => {
      if (validTypes && !validTypes.includes(file.type)) {
        setError('Недопустимый тип файла');
        return false;
      }

      if (file.size > (maxSize ?? 10 * 1024 * 1024)) {
        setError('Размер файла превышает максимальный');
        return false;
      }

      return true;
    },
    [validTypes, maxSize]
  );

  /**
   * Получает presigned URL и objectKey для загрузки файла
   */
  const getPresignedUrl = useCallback(
    async (file: File) => {
      const { generatedObjectKey, presignedUrl } = await getFilePresignedUrl(file.name);
      if (!generatedObjectKey || !presignedUrl) {
        throw new Error('Не удалось получить presigned URL');
      }
      return { objectKey: generatedObjectKey, url: presignedUrl };
    },
    [getFilePresignedUrl]
  );

  /**
   * Отправляет файл в S3 по presigned URL
   */
  const uploadToS3 = async (file: File, url: string) => {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: { 'x-amz-meta-source': 'adera-admin' }
    });
    if (!response.ok) {
      throw new Error('Не удалось загрузить файл на S3');
    }
  };

  /**
   * Создаёт объект ApiFile из загруженного файла и objectKey
   */
  const buildApiFile = (file: File, objectKey: string): ApiFile => ({
    id: objectKey,
    objectKey,
    originalFileName: file.name
  });

  /**
   * Сбрасывает значение file input, чтобы можно было повторно выбрать тот же файл
   */
  const resetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = '';
  };

  /**
   * Добавляет новый файл в список (загружает его в s3)
   */
  const addFile = useCallback(
    async (file: File) => {
      if (!isValid(file)) return;
      const { objectKey, url } = await getPresignedUrl(file);
      await uploadToS3(file, url);
      const newFile = buildApiFile(file, objectKey);
      onFileUpload?.(newFile);
    },
    [isValid, getPresignedUrl, onFileUpload]
  );

  /**
   * Обрабатывает выбор файлов через file input
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      if (maxFiles !== undefined && selectedFiles.length > maxFiles) {
        setError(`Максимальное количество файлов: ${String(maxFiles)}`);
        resetInput(event);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await Promise.all(Array.from(selectedFiles).map(addFile));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки';
        setError(message);
      } finally {
        setLoading(false);
        resetInput(event);
      }
    },
    [maxFiles, addFile]
  );

  return {
    loading,
    error,
    handleFileChange
  };
};
