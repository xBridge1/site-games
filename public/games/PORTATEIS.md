# Jogos portáteis

Para adicionar um jogo de Game Boy Color, crie uma pasta dentro de `public/games` com a ROM autorizada e um `game.json`:

```text
public/games/meu-jogo/
├── game.gbc
└── game.json
```

```json
{
  "title": "Nome do jogo",
  "category": "Portáteis",
  "description": "Descrição curta.",
  "kind": "rom",
  "platform": "gbc",
  "entry": "game.gbc"
}
```

Para Game Boy Advance, use `game.gba` e troque `platform` para `gba`.
O catálogo é gerado automaticamente no `npm run dev` ou `npm run build`.
