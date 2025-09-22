import { createSafeContext } from '@adera/ui/utils/createSafeContext';

export interface AccordionContext {
  isItemActive: (itemValue: string) => boolean;

  transitionDuration?: number;

  onChange: (itemValue: string) => void;
}

export const [AccordionProvider, useAccordionContext] = createSafeContext<AccordionContext>(
  'Accordion component was not found in the tree'
);
