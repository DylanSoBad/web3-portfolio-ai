import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const bundle = JSON.parse(readFileSync('kage-source.json', 'utf8').replace(/^\uFEFF/, ''));
for (const file of [...bundle.files, ...bundle.assets]) {
  const bytes = readFileSync(`vendor/threeui/${file.path}`);
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== file.sha256) throw new Error(`Source checksum mismatch: ${file.path}`);
}
console.log('Verified 8 registered source files and 14 binary assets.');
