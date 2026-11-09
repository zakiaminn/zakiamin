// Injects the server-rendered pages into the built HTML files.
// Runs after `vite build` and `vite build --ssr src/entry-server.jsx`.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const serverDir = `${root}dist-server`;

const server = await import(pathToFileURL(`${serverDir}/entry-server.js`).href);

// Each built page and the function that renders it.
const pages = [
  { file: 'dist/index.html', render: server.render },
  { file: 'dist/batin/index.html', render: server.renderWriteup },
];

const marker = '<div id="root"></div>';
for (const page of pages) {
  const path = `${root}${page.file}`;
  const template = await readFile(path, 'utf8');
  if (!template.includes(marker)) {
    throw new Error(`prerender: ${marker} not found in ${page.file}`);
  }
  const html = template.replace(marker, `<div id="root">${page.render()}</div>`);
  await writeFile(path, html);
  console.log(`prerender: wrote ${(html.length / 1024).toFixed(1)} kB to ${page.file}`);
}

await rm(serverDir, { recursive: true, force: true });
