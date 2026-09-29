import './verify-source.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'esbuild';

// The registered module also imports unrelated premium pages. Extract the exact
// Kage export and reuse its registered dependencies without altering any vendor file.
const source = readFileSync('vendor/threeui/src/shaders/landing-pages/LandingPages.tsx', 'utf8');
const component = source.match(/export function KageLandingPage\([^]*?\n\}/)?.[0];
if (!component) throw new Error('Registered Kage component was not found.');
writeFileSync('frontend/kage.generated.tsx', `import { splitTypographyProps, usePageTypography, type PageTypographyProps } from '../vendor/threeui/src/shaders/landing-pages/pageTypography';
import { LandingPageFrame, type LandingPageProps } from '../vendor/threeui/src/shaders/landing-pages/LandingPageFrame';
import { KAGE_TYPOGRAPHY } from '../vendor/threeui/src/shaders/landing-pages/pageRecipes';
${component}\n`);

await build({
  entryPoints: ['frontend/main.tsx'],
  outfile: 'static/kage-ui.js',
  bundle: true,
  minify: true,
  format: 'esm',
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: {
    '@designcodeio/threeui/style.css': resolve('node_modules/@designcodeio/threeui/lib-dist/style.css'),
    '@designcodeio/threeui': resolve('frontend/kage.generated.tsx'),
  },
});
console.log('Built static/kage-ui.js and static/kage-ui.css');
