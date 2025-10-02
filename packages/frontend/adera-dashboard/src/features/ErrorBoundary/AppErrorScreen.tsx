import * as stylex from '@stylexjs/stylex';
import { headers, Button, text, ButtonWidth } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

export const AppErrorScreen = () => {
  return (
    <section {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.content)}>
        <h2 {...stylex.props(headers.h2Semibold)}>Не удалось получить информацию</h2>
        <p {...stylex.props(styles.errorText, text.defaultMedium)}>
          Произошла ошибка, попробуйте перезагрузить страницу или&nbsp;выйти на&nbsp;главную&nbsp;
        </p>
        <div {...stylex.props(styles.actionBlock)}>
          <Button
            width={ButtonWidth.full}
            onClick={() => {
              window.location.reload();
            }}>
            Перезагрузить страницу
          </Button>
          <Button
            width={ButtonWidth.full}
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/';
            }}>
            Выйти
          </Button>
        </div>
      </div>
    </section>
  );
};

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
    color: colors.textPrimaryDefault,
    display: 'flex',
    height: '100dvh',
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    justifyContent: { default: 'center', '@media (max-width: 768px)': 'flex-start' },
    textAlign: 'center',
    width: '100%'
  },
  errorText: {
    maxWidth: 500
  },
  actionBlock: {
    display: 'flex',
    gap: 12
  }
});
