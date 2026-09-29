# Como adicionar jogos

Cada jogo local fica em uma pasta dentro de `public/games/`. O build detecta automaticamente qualquer pasta que tenha um arquivo `game.json`.

## Jogo HTML

Estrutura:

```text
public/games/meu-jogo/
├── game.json
├── index.html
├── assets/
└── js/
```

`game.json`:

```json
{
  "title": "Meu Jogo",
  "category": "Aventura",
  "description": "Descrição curta do jogo.",
  "rating": 4.8,
  "plays": 0,
  "kind": "html",
  "entry": "index.html",
  "emoji": "🎮"
}
```

## Jogo Flash/SWF

Estrutura mínima:

```text
public/games/meu-flash/
├── game.json
├── game.swf
└── assets/       (se o SWF usar arquivos externos)
```

`game.json`:

```json
{
  "title": "Meu Jogo Flash",
  "category": "Clássicos",
  "description": "Jogo Flash executado pelo Ruffle.",
  "kind": "swf",
  "entry": "game.swf",
  "emoji": "🕹️"
}
```

Depois basta executar `npm run build` e publicar na Vercel. Não é necessário editar `App.jsx` ou `GamePlayer.jsx`.

O Ruffle é carregado pelo site e emula o Flash no navegador. Alguns jogos antigos podem depender de recursos do Flash que ainda não são totalmente suportados.
