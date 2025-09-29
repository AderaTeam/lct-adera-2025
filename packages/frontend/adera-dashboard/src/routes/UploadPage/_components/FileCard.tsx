import { Fragment, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Stack,
  MessageIconS,
  Button,
  DownloadIcon,
  ArrowRightIcon,
  CircleCheckFilledIcon,
  headers,
  text,
  ButtonVariant,
  LoaderIcon
} from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { ApiFileAnalysisList } from 'store/_types';
import { formatDate } from 'utils/formatDate';
import { getWordForm } from 'utils/getWordForm';

export const FileCard = ({
  createdAt,
  reviewsCount,
  objectKeyUrl,
  id,
  loading
}: { loading?: boolean } & ApiFileAnalysisList) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const navigate = useNavigate();

  const handleDownload = async (url: string, filename = 'file') => {
    setDownloadLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Fragment>
      <Flex gap={16} justify="space-between" align="flex-end">
        <Stack gap={12}>
          <Flex gap={8}>
            {loading ? (
              <Fragment>
                <LoaderIcon color={colors.textBlueDefault} />{' '}
                <h3 {...stylex.props(headers.h3Semibold)}>Новый анализ</h3>
              </Fragment>
            ) : (
              <Fragment>
                <CircleCheckFilledIcon color={colors.statusSuccess} />{' '}
                <h3 {...stylex.props(headers.h3Semibold)}>Данные от {formatDate(createdAt, { showTime: true })}</h3>
              </Fragment>
            )}
          </Flex>
          <Flex gap={5} style={[text.defaultMedium, styles.status]}>
            {loading ? (
              '••• Идет анализ комментариев'
            ) : (
              <Fragment>
                <MessageIconS /> {reviewsCount} {getWordForm(reviewsCount, ['отзыв', 'отзыва', 'отзывов'])}
              </Fragment>
            )}
          </Flex>
        </Stack>
        <Flex gap={16}>
          {!!objectKeyUrl && (
            <Button
              disabled={loading}
              loading={downloadLoading}
              onClick={() => {
                void handleDownload(objectKeyUrl);
              }}
              variant={ButtonVariant.tertiaryAccent}>
              Скачать .json <DownloadIcon />
            </Button>
          )}
          <Button
            onClick={() => {
              void navigate(`/upload/${id.toString()}`);
            }}
            disabled={loading}>
            Смотреть аналитику <ArrowRightIcon />
          </Button>
        </Flex>
      </Flex>
    </Fragment>
  );
};

const styles = stylex.create({
  status: {
    color: colors.textTertiaryDefault
  }
});
