
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreApp } from './apps/StoreApp';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <StoreApp />
  </React.StrictMode>
);
