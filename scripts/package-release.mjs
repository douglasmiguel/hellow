import { readFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const manifest = JSON.parse(readFileSync(join(dist, 'manifest.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (manifest.name !== 'Hellow' || manifest.version !== pkg.version) {
  throw new Error('Release name or version does not match package.json.');
}
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [relative(dist, path)];
  });
}
const entries = files(dist).sort();
if (entries.some(path => /(^|\/)(\.env|\.git|node_modules)|\.map$/.test(path))) {
  throw new Error('Unexpected development files in release.');
}
mkdirSync(join(root, 'release'), { recursive: true });
const archive = join(root, 'release', `hellow-${manifest.version}.zip`);
// Remove an earlier archive so deleted build assets cannot survive repackaging.
rmSync(archive, { force: true });
execFileSync('zip', ['-q', '-X', archive, ...entries], { cwd: dist });
execFileSync('unzip', ['-tq', archive]);
console.log(`Validated ${entries.length} packaged files: ${archive}`);
