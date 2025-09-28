import * as stylex from '@stylexjs/stylex';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useAuthFetch } from '@adera/auth-fetch';
import { Container, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { ApiFile, ApiFileAnalysisList } from 'store/_types';
import { queryClient } from 'store/queryClient';
import { FileList } from './_components/FileList';
import { FileUpload } from './_components/FileUpload';

export const UploadPage = () => {
  const authFetch = useAuthFetch();
  const { mutateAsync: createFileAnalysis, isPending } = useMutation<ApiFileAnalysisList, Error, string>({
    mutationFn: (objectKey: string) =>
      authFetch('/file-analysis', {
        method: 'POST',
        body: JSON.stringify({ objectKey }),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['file-analysis'] });
    }
  });

  const { data: fileAnalysis, isFetching: loading } = useSuspenseQuery({
    queryKey: ['file-analysis'],
    queryFn: () => authFetch<ApiFileAnalysisList[]>('/file-analysis')
  });

  const handleUploadFile = async (file: ApiFile | null) => {
    if (file?.objectKey) {
      await createFileAnalysis(file.objectKey);
    }
  };

  return (
    <main>
      <Container style={styles.root}>
        <h1 {...stylex.props(headers.h1Semibold)}>Загруженные данные</h1>
        <FileUpload disabled={isPending} onFileUpload={handleUploadFile} />
        <FileList isNewFileCreating={isPending} loading={loading} files={fileAnalysis} />
      </Container>
    </main>
  );
};

const styles = stylex.create({
  root: {
    color: colors.textPrimaryDefault,
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  }
});
