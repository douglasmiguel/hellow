import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Expected a stable release version.');
const html = readFileSync(join(root, 'publishing/privacy/index.html'), 'utf8').trimEnd() + '\n';
if (html.split('\n').includes('HELLOW_PRIVACY_HTML')) throw new Error('HTML conflicts with the shell delimiter.');
const sha = createHash('sha256').update(html).digest('hex');
const template = readFileSync(join(root, 'publishing/deploy/update-policy.template.sh'), 'utf8');
const script = template.replaceAll('__VERSION__', version).replaceAll('__SHA256__', sha).replace('__HTML__', () => html.trimEnd());
mkdirSync(join(root, 'release'), { recursive: true });
const output = join(root, 'release', `update-hellow-policy-${version}.sh`);
writeFileSync(output, script, { mode: 0o755 });
console.log(`Prepared ${output}\nEmbedded privacy-page SHA-256: ${sha}`);
