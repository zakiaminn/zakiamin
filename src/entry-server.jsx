import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import WriteUpPage from './components/writeup/WriteUpPage.jsx';

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// The Batin write-up at /batin/.
export function renderWriteup() {
  return renderToString(
    <StrictMode>
      <WriteUpPage />
    </StrictMode>
  );
}
