export const autosizeTextarea = ({
  textareaRef,
  autosize,
  maxRows,
  minRows
}: {
  textareaRef: React.RefObject<HTMLDivElement | null>;
  autosize?: boolean;
  maxRows?: number;
  minRows?: number;
}) => {
  if (!autosize || !textareaRef.current) return;

  const textareaContainer = textareaRef.current;
  const textarea = textareaContainer.querySelector('textarea');

  if (!textarea) return;

  textareaContainer.style.height = 'auto';

  const computedStyle = window.getComputedStyle(textarea);
  const lineHeight = parseFloat(computedStyle.lineHeight);
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const paddingBottom = parseFloat(computedStyle.paddingBottom);

  const maxHeight = maxRows ? maxRows * lineHeight + paddingTop + paddingBottom : undefined;
  const minHeight = minRows ? minRows * lineHeight + paddingTop + paddingBottom : 72;

  const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Infinity));

  textareaContainer.style.height = `${newHeight.toString()}px`;
};
