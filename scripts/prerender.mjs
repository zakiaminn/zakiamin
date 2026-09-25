// Injects the server-rendered page into the built index.html.
// Runs after `vite build` and `vite build --ssr src/entry-server.jsx`.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const indexPath = `${root}dist/index.html`;
const serverDir = `${root}dist-server`;

const { render } = await import(pathToFileURL(`${serverDir}/entry-server.js`).href);

const template = await readFile(indexPath, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

const html = template.replace(marker, `<div id="root">${render()}</div>`);
await writeFile(indexPath, html);
await rm(serverDir, { recursive: true, force: true });

console.log(`prerender: wrote ${(html.length / 1024).toFixed(1)} kB to dist/index.html`);
