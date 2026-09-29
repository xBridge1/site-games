import React, { useState, useMemo } from 'react';
import games from './data/games';
import GameCard from './components/GameCard';
import GamePlayer from './components/GamePlayer';

const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState('name');
  const [showFavs, setShowFavs] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [selectedGame, setSelectedGame] = useState(null);
  const categories = ['Todos', ...new Set(games.map(g => g.category))];
  const featured = games.find(g => g.id === 'doom');
  const toggleFav = id => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem('favorites', JSON.stringify(next)); } catch { /* Keep session favorites available. */ }
      return next;
    });
  };
  const filteredGames = useMemo(() => {
    const query = normalize(search.trim());
    const list = games.filter(g => (!query || normalize(g.title + ' ' + g.description).includes(query)) &&
      (category === 'Todos' || g.category === category) && (!showFavs || favorites.includes(g.id)));
    return list.sort((a, b) => sort === 'newest'
      ? (Date.parse(b.addedAt || '2026-09-29') - Date.parse(a.addedAt || '2026-09-29')) || a.title.localeCompare(b.title, 'pt-BR')
      : a.title.localeCompare(b.title, 'pt-BR'));
  }, [search, category, sort, showFavs, favorites]);
  const resetFilters = () => { setSearch(''); setCategory('Todos'); setShowFavs(false); };

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Central da Sacanagem, início"><span className="brand-mark">C<span>↗</span></span><span>Central da<span className="brand-sub">Sacanagem<span className="brand-dot">.</span></span></span></a>
        <nav aria-label="Navegação principal"><a className="nav-active" href="#catalogo">Explorar</a><button onClick={() => { setShowFavs(true); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>Meus favoritos <span>{games.filter(g => favorites.includes(g.id)).length}</span></button></nav>
        <span className="header-note"><i /> Seu próximo intervalo começa aqui</span>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow">APERTE O PLAY. ESQUEÇA O RELÓGIO.</p><h1 id="hero-title">Velhos clássicos.<br /><span>Novas partidas.</span></h1><p>Do fliperama ao apocalipse. Uma coleção de jogos para abrir, escolher e jogar direto no navegador.</p><a className="primary-link" href="#catalogo">Explorar os jogos <span>↗</span></a><div className="hero-foot"><span>{String(games.length).padStart(2, '0')} jogos na coleção</span><span>Sem instalação</span></div></div>
          {featured && <button className="featured" onClick={() => setSelectedGame(featured)} aria-label="Jogar Doom"><span className="featured-top"><span className="tag">ESCOLHA DA CENTRAL</span><span>1993 / DOS</span></span><span className="doom-art" aria-hidden="true"><span className="doom-orbit" /><strong>DOOM</strong><span className="doom-subtitle">KNEE-DEEP IN THE DEAD</span></span><span className="featured-bottom"><span><small>O inferno tem um botão de play.</small><b>DOOM · Shareware</b></span><span className="round-play">▶</span></span></button>}
        </section>
        <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
          <div className="section-heading"><div><p className="eyebrow">ESCOLHA SUA PRÓXIMA PARTIDA</p><h2 id="catalog-title">A coleção<span> / {String(games.length).padStart(2, '0')}</span></h2></div><label className="search-wrap"><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar jogos" placeholder="Qual vai ser o jogo de hoje?" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
          <div className="catalog-toolbar"><div className="categories" role="group" aria-label="Categorias">{categories.map(cat => <button key={cat} className={'category-btn ' + (category === cat ? 'active' : '')} aria-pressed={category === cat} onClick={() => setCategory(cat)}>{cat}</button>)}</div><button className={'fav-toggle ' + (showFavs ? 'active' : '')} aria-pressed={showFavs} onClick={() => setShowFavs(!showFavs)}>♡ Favoritos</button></div>
          <div className="results-bar"><span aria-live="polite">{filteredGames.length} {filteredGames.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}</span><label>Ordenar por <select value={sort} onChange={e => setSort(e.target.value)}><option value="name">Nome: A–Z</option><option value="newest">Adicionados recentemente</option></select></label></div>
          <div className="grid">{filteredGames.map(game => <GameCard key={game.id} game={game} onPlay={setSelectedGame} onToggleFav={toggleFav} isFav={favorites.includes(game.id)} />)}</div>
          {!filteredGames.length && <div className="empty-state"><span>⌕</span><h3>Nenhum jogo por aqui.</h3><p>Tente outro nome ou escolha uma nova categoria.</p><button className="play-btn" onClick={resetFilters}>Limpar filtros</button></div>}
        </section>
      </main>
      <footer className="footer"><span>Central da Sacanagem<span className="brand-dot">.</span></span><span>Uma pausa bem jogada. © {new Date().getFullYear()}</span><a href="#">Voltar ao topo ↑</a></footer>
      {selectedGame && <GamePlayer key={selectedGame.id} game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </div>
  );
}