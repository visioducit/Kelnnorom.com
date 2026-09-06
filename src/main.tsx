import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent browser HTTP POST form resubmission warnings globally across all forms
if (typeof window !== 'undefined') {
  // Capture-phase listener to guarantee no native form submits as synchronous HTTP POST
  window.addEventListener(
    'submit',
    (e) => {
      // In SPA environment, prevent native HTTP POST/GET navigation on any form submit
      e.preventDefault();
    },
    false
  );

  // Normalize history state so browser reload/back navigation never prompts "Confirm Form Resubmission"
  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, document.title, window.location.href);
    }
  } catch {
    // Ignore any history restriction
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

