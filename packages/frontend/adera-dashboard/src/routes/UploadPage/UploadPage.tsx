import * as stylex from '@stylexjs/stylex';
import { Container, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { FileList } from './_components/FileList';
import { FileUpload } from './_components/FileUpload';

export const UploadPage = () => {
  return (
    <main>
      <Container style={styles.root}>
        <h1 {...stylex.props(headers.h1Semibold)}>Загруженные данные</h1>
        <FileUpload />
        <FileList loading={false} files={['1']} />
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
