import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'pocket-play');
const expectedGames = ['runner', 'bandit', 'qpath', 'orbit', 'signature', 'echo', 'match', 'merge'];
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
    const path = join(siteRoot, 'games', game, file);
    if (!existsSync(path)) errors.push(`missing ${path}`);
  }

  const gameRoot = join(siteRoot, 'games', game);
  const markupPath = join(gameRoot, 'index.html');
  const stylePath = join(gameRoot, 'style.css');
  if (existsSync(markupPath) && existsSync(stylePath)) {
    const markup = readFileSync(markupPath, 'utf8');
    const styles = readFileSync(stylePath, 'utf8');
    const ids = [...markup.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicateIds.length) {
      errors.push(
        `games/${game}/index.html: duplicate ids ${[...new Set(duplicateIds)].join(', ')}`,
      );
    }
    if (!markup.includes('../shared/runtime.js')) {
      errors.push(`games/${game}/index.html: shared runtime is not loaded`);
    }
    if (!markup.includes('../shared/theme.css') && !styles.includes('../shared/theme.css')) {
      errors.push(`games/${game}: shared theme is not loaded`);
    }
  }
}

let gameMetadata = [];
for (const jsonFile of ['games.json']) {
  const path = join(siteRoot, jsonFile);
  try {
    gameMetadata = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${jsonFile}: invalid JSON (${error.message})`);
  }
}

const metadataIds = gameMetadata.map((game) => game.id);
if (JSON.stringify(metadataIds) !== JSON.stringify(expectedGames)) {
  errors.push(`games.json: expected ordered ids ${expectedGames.join(', ')}`);
}

for (const game of gameMetadata) {
  if (!game.title || !game.title_en || !game.session || !game.session_en) {
    errors.push(`games.json: ${game.id || 'unknown'} is missing bilingual metadata`);
  }
}

const embedSource = readFileSync(join(siteRoot, 'embed.js'), 'utf8');
const embedHeights = new Map(
  [...embedSource.matchAll(/^\s{4}([a-z]+):.*height:\s*(\d+)/gm)].map((match) => [
    match[1],
    Number(match[2]),
  ]),
);
for (const game of gameMetadata) {
  if (embedHeights.get(game.id) !== game.preferred_height) {
    errors.push(`embed.js: ${game.id} height does not match games.json (${game.preferred_height})`);
  }
}

const sourceFiles = walk(siteRoot).filter((path) => sourceExtensions.has(extname(path)));

for (const path of sourceFiles) {
  const content = readFileSync(path, 'utf8');
  const relative = path.slice(siteRoot.length + 1);
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

  const markupWithoutExamples = content.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, '');
  for (const match of markupWithoutExamples.matchAll(/(?:src|href)\s*=\s*["']([^"'#]+)["']/gi)) {
    const reference = match[1].split('?')[0];
    if (/^(?:data:|mailto:|tel:|javascript:)/i.test(reference)) continue;

    let target = resolve(dirname(path), reference);
    if (reference.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${relative}: missing reference ${reference}`);
  }
}

for (const game of expectedGames) {
  const gameRoot = join(siteRoot, 'games', game);
  const totalBytes = walk(gameRoot).reduce((sum, path) => sum + statSync(path).size, 0);
  if (totalBytes > 40_000) {
    errors.push(`games/${game}: ${totalBytes} bytes exceeds 40 KB source budget`);
  }
}

if (errors.length) {
  console.error(`Static QA failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Static QA passed: ${expectedGames.length} games, ${sourceFiles.length} source files, valid JavaScript, relative HTML/CSS asset paths, and synchronized publish files.`,
  );
}
