import { useId, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button, Input, UploadIcon } from '@adera/ui';
import { ApiFile } from 'store/_types';
import { useFileUpload } from './useFileUpload';

export const FileUpload = ({
  disabled,
  onFileUpload
}: {
  disabled?: boolean;
  onFileUpload: (file: ApiFile | null) => void;
}) => {
  const id = useId();

  const inputRef = useRef<HTMLInputElement>(null);

  const { handleFileChange, loading } = useFileUpload({
    validTypes: ['application/json'],
    maxFiles: 1,
    onFileUpload: onFileUpload
  });

  return (
    <Input.Wrapper>
      <Button disabled={loading || disabled} asChild>
        <label aria-disabled={disabled} htmlFor={id}>
          Загрузить новые данные <UploadIcon />
        </label>
      </Button>

      <Input
        ref={inputRef}
        disabled={disabled}
        type={'file'}
        id={id}
        name={id}
        accept={'application/json'}
        onChange={(e) => {
          if (e.isTrusted) void handleFileChange(e);
        }}
        style={styles.input}
      />
    </Input.Wrapper>
  );
};

const styles = stylex.create({
  input: {
    display: 'none'
  }
});
