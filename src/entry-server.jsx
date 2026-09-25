import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

/**
 * Renders the page to HTML at build time (see scripts/prerender.mjs), so
 * crawlers and link previews get the full content without running
 * JavaScript. The tree matches main.jsx exactly, so hydration lines up.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
