import { ReactNode, useEffect, useState } from 'react';

export function ShowAfter({ delay, children }: { delay: number; children: ReactNode }) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShouldShow(true);
    }, delay);
  }, [delay]);

  if (!shouldShow) {
    return null;
  } else {
    return children;
  }
}
