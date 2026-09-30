import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gamesDirectory = path.join(projectRoot, 'public', 'games');
const outputFile = path.join(projectRoot, 'src', 'data', 'localGames.generated.js');

const inferKind = (entry) => {
  const extension = path.extname(entry).toLowerCase();
  if (extension === '.swf') return 'swf';
  if (extension === '.jsdos') return 'dos';
  if (extension === '.html' || extension === '.htm') return 'html';
  return 'external';
};

const encodeEntry = (entry) => entry
  .split(/[\\/]+/)
  .map((part) => encodeURIComponent(part))
  .join('/');

const games = fs.existsSync(gamesDirectory)
  ? fs.readdirSync(gamesDirectory, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((directory) => {
        const slug = directory.name;
        const manifestFile = path.join(gamesDirectory, slug, 'game.json');
        if (!fs.existsSync(manifestFile)) return null;

        const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
        const entry = manifest.entry || (
          manifest.kind === 'swf' ? 'game.swf' : manifest.kind === 'dos' ? 'game.jsdos' : 'index.html'
        );
        const kind = manifest.kind || inferKind(entry);
        const entryUrl = `/games/${encodeURIComponent(slug)}/${encodeEntry(entry)}`;

        return {
          id: manifest.id || slug,
          title: manifest.title || slug,
          category: manifest.category || 'Jogos',
          description: manifest.description || 'Jogo online.',
          rating: Number(manifest.rating || 0),
          plays: Number(manifest.plays || 0),
          kind,
          platform: manifest.platform || (kind === 'dos' ? 'dos' : kind === 'swf' ? 'flash' : 'web'),
          addedAt: manifest.addedAt || '2026-09-29T18:00:00Z',
          url: kind === 'dos'
            ? `/dos-player.html?bundle=${encodeURIComponent(entryUrl)}`
            : entryUrl,
          local: false,
          emoji: manifest.emoji || '🎮',
        };
      })
      .filter(Boolean)
  : [];

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(
  outputFile,
  `const localGames = ${JSON.stringify(games, null, 2)};\n\nexport default localGames;\n`,
  'utf8'
);

console.log(`Catálogo gerado: ${games.length} jogo(s) local(is).`);
