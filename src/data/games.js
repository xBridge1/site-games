import localGames from './localGames.generated';

const games = [
  ...localGames,
  {
    id: 'reflexo',
    title: 'Reflexo Ultrassônico',
    category: 'Reflexo',
    description: 'Teste seus reflexos e veja se você é mais rápido que um raio.',
    rating: 4.8,
    plays: 12450,
    local: true,
    emoji: '⚡',
  },
  {
    id: 2,
    title: 'Pac-Man Clássico',
    category: 'Clássicos',
    description: 'O clássico dos arcades. Coma todos os pontos e fuja dos fantasmas.',
    rating: 4.9,
    plays: 98200,
    kind: 'external',
    url: 'https://www.google.com/logos/2010/pacman10-i.html',
    local: false,
    emoji: '🟡',
  },
];

export default games;
