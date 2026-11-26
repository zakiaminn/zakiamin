import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import WriteUpPage from './components/writeup/WriteUpPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

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

// The 404 page, served for any path that matches no file.
export function renderNotFound() {
  return renderToString(
    <StrictMode>
      <NotFoundPage />
    </StrictMode>
  );
}
