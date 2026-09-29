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
];

export default games;
