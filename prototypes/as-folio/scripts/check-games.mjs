import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gamesRoot = join(projectRoot, 'public', 'pocket-play', 'games');
const expectedGames = ['orbit', 'signature', 'echo', 'match', 'merge'];
const sourceExtensions = new Set(['.html', '.css', '.js']);
const errors = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

for (const game of expectedGames) {
  for (const file of ['index.html', 'style.css', 'game.js']) {
    const path = join(gamesRoot, game, file);
    if (!existsSync(path)) errors.push(`missing pocket game asset: ${game}/${file}`);
  }
}

if (!existsSync(gamesRoot)) {
  errors.push('missing public/pocket-play/games directory');
} else {
  const sourceFiles = walk(gamesRoot).filter((path) => sourceExtensions.has(extname(path)));

  for (const path of sourceFiles) {
    const content = readFileSync(path, 'utf8');
    const relative = path.slice(gamesRoot.length + 1);
    const networkScan = content.replaceAll('http://www.w3.org/2000/svg', '');

    if (/(?:src|href)\s*=\s*["']\//i.test(content)) {
      errors.push(`${relative}: root-relative asset path`);
    }
    if (extname(path) === '.css' && /url\(\s*["']?\//i.test(content)) {
      errors.push(`${relative}: root-relative CSS url()`);
    }
    if (/https?:\/\//i.test(networkScan)) {
      errors.push(`${relative}: runtime external URL`);
    }
    if (/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(content)) {
      errors.push(`${relative}: IPv4 literal`);
    }
    if (/github_pat_|ghp_[A-Za-z0-9]{20,}|BEGIN (?:OPENSSH |RSA )?PRIVATE KEY/.test(content)) {
      errors.push(`${relative}: credential-like material`);
    }

    if (extname(path) === '.js') {
      const syntax = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
      if (syntax.status !== 0) {
        errors.push(`${relative}: JavaScript syntax error\n${syntax.stderr.trim()}`);
      }
    }

    if (extname(path) !== '.html') continue;
    for (const match of content.matchAll(/(?:src|href)\s*=\s*["']([^"'#]+)["']/gi)) {
      const reference = match[1].split('?')[0];
      if (/^(?:data:|mailto:|tel:|javascript:)/i.test(reference)) continue;

      let target = resolve(dirname(path), reference);
      if (reference.endsWith('/')) target = join(target, 'index.html');
      if (!existsSync(target)) errors.push(`${relative}: missing reference ${reference}`);
    }
  }

  for (const game of expectedGames) {
    const gameRoot = join(gamesRoot, game);
    if (!existsSync(gameRoot)) continue;
    const totalBytes = walk(gameRoot).reduce((sum, path) => sum + statSync(path).size, 0);
    if (totalBytes > 40_000) {
      errors.push(`${game}: ${totalBytes} bytes exceeds 40 KB source budget`);
    }
  }

  if (sourceFiles.length !== expectedGames.length * 3) {
    errors.push(`expected 15 game source files, found ${sourceFiles.length}`);
  }
}

if (errors.length > 0) {
  console.error(`Pocket game QA failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('Pocket game QA passed: 5 games, 15 static assets, valid local-only paths.');
}
