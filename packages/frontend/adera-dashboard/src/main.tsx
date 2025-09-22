import '@adera/ui/styles/fonts.css';
import '@adera/ui/styles/base.css';
import '@adera/ui/styles/ui.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const containerElement = document.getElementById('root');

if (containerElement) {
  const root = createRoot(containerElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
