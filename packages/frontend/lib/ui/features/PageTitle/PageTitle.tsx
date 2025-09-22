import { useEffect } from 'react';

interface PageTitleProps {
  children: string;
  noTemplate?: boolean;
}

export const PageTitle = ({ children, noTemplate }: PageTitleProps) => {
  const title = noTemplate ? children : `${children} — Днд`;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return null;
};
