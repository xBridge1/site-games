import React, { useState, useMemo } from 'react';
import gamesData from './data/games';
import GameCard from './components/GameCard';
import GamePlayer from './components/GamePlayer';

export default function App() {
  const [games] = useState(gamesData);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState('popular');
  const [showFavs, setShowFavs] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGame, setSelectedGame] = useState(null);

  const categories = ['Todos', ...new Set(games.map(g => g.category))];

  const toggleFav = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const filteredGames = useMemo(() => {
    let list = [...games];
    if (search) {
      list = list.filter(
        g =>
          g.title.toLowerCase().includes(search.toLowerCase()) ||
          g.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'Todos') {
      list = list.filter(g => g.category === category);
    }
    if (showFavs) {
      list = list.filter(g => favorites.includes(g.id));
    }
    if (sort === 'popular') {
      list.sort((a, b) => b.plays - a.plays);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [games, search, category, showFavs, favorites, sort]);

  return (
    <div className="app">
      <header>
        <div className="logo">Central da Sacanagem</div>
        <input
          className="search-bar"
          placeholder="Buscar jogos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>

      <div className="controls">
        {categories.map(cat => (
          <button
            key={cat}
            className={'category-btn ' + (category === cat ? 'active' : '')}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <select
          className="sort-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="popular">Mais Populares</option>
          <option value="rating">Melhor Avaliados</option>
          <option value="newest">Mais Recentes</option>
        </select>
        <button
          className={'fav-toggle ' + (showFavs ? 'active' : '')}
          onClick={() => setShowFavs(!showFavs)}
        >
          {showFavs ? 'â¤ï¸ Favoritos' : 'ðŸ¤ Favoritos'}
        </button>
      </div>

      <div className="grid">
        {filteredGames.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onPlay={setSelectedGame}
            onToggleFav={toggleFav}
            isFav={favorites.includes(game.id)}
          />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
          Nenhum jogo encontrado.
        </p>
      )}

      <div className="footer">
        Central da Sacanagem Â© 2025 â€” Jogos online sem frescura.
      </div>

      {selectedGame && (
        <GamePlayer game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
}