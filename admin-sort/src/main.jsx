import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode disabled to avoid double-mounting issues during drag in development
  <App />
);
