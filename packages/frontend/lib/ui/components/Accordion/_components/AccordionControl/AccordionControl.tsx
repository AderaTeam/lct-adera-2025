import { MouseEvent, ComponentProps, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { useAccordionContext } from '../../Accordion.context';
import { useAccordionItemContext } from '../../AccordionItem.context';

export interface AccordionControlProps extends Omit<ComponentProps<'div'>, 'style' | 'children'> {
  style?: StyleXStyles;

  children?: ReactNode | ((open: boolean) => ReactNode);
}

export const AccordionControl = ({ children, onClick, style }: AccordionControlProps) => {
  const { onChange, isItemActive } = useAccordionContext();
  const { value } = useAccordionItemContext();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    onChange(value);
    onClick?.(e);
  };

  return (
    <div {...stylex.props(styles.root, style)} onClick={handleClick}>
      {typeof children === 'function' ? children(isItemActive(value)) : children}
    </div>
  );
};

const styles = stylex.create({
  root: {
    alignItems: 'center',
    borderStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    gap: 20,
    justifyContent: 'space-between',
    paddingBlock: 16,
    paddingInline: '0',
    userSelect: 'none',
    width: '100%'
  }
});
