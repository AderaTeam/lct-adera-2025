import { AderaSize } from '@adera/ui/styles/AderaSize';
import { createOptionalContext } from '@adera/ui/utils/createOptionalContext';

interface InputWrapperContextValue {
  size: Extract<AderaSize, 'md' | 'lg'>;

  error: string | null;

  setError: (error: string | null) => void;

  // custom validation function => errorMessage || null
  validate?: (value: string, validity: ValidityState) => string | null;
}

export const [InputWrapperProvider, useInputWrapper] = createOptionalContext<InputWrapperContextValue>({
  size: 'md',
  error: '',
  setError: () => null
});
