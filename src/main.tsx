import type {} from '@polymeshassociation/polymesh-types/polkadot/types-lookup';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />,
  </StrictMode>,
);
