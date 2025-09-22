import { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { AccordionControl } from './_components/AccordionControl';
import { AccordionItem } from './_components/AccordionItem';
import { AccordionPanel } from './_components/AccordionPanel';
import { AccordionProvider } from './Accordion.context';

interface AccordionProps {
  multiple?: boolean;

  value?: string | string[] | null;

  defaultValue?: string | string[] | null;

  onChange?: (value: string | string[] | null) => void;

  children?: ReactNode;

  style?: StyleXStyles;

  transitionDuration?: number;
}

export const Accordion = ({
  value,
  defaultValue,
  multiple,
  onChange,
  children,
  style,
  transitionDuration
}: AccordionProps) => {
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: multiple ? [] : null,
    onChange
  });

  const isItemActive = (itemValue: string) =>
    Array.isArray(_value) ? _value.includes(itemValue) : _value === itemValue;

  const handleItemChange = (itemValue: string) => {
    if (multiple && Array.isArray(_value)) {
      handleChange(_value.includes(itemValue) ? _value.filter((v) => v !== itemValue) : [..._value, itemValue]);
    } else {
      handleChange(_value === itemValue ? null : itemValue);
    }
  };

  return (
    <AccordionProvider value={{ isItemActive, onChange: handleItemChange, transitionDuration }}>
      <div {...stylex.props(styles.root, style)}>{children}</div>
    </AccordionProvider>
  );
};

Accordion.Item = AccordionItem;
Accordion.Control = AccordionControl;
Accordion.Panel = AccordionPanel;

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    // eslint-disable-next-line @stylexjs/valid-styles
    overflowY: 'clip',
    width: '100%'
  }
});
