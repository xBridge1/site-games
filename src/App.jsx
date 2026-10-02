import React, { useMemo, useState } from 'react';
import games from './data/games';
import GameCard from './components/GameCard';
import GamePlayer from './components/GamePlayer';

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState('name');
  const [showFavs, setShowFavs] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [selectedGame, setSelectedGame] = useState(null);

  const categories = ['Todos', ...new Set(games.map((game) => game.category))];
  const dosGames = games.filter((game) => game.platform === 'dos');
  const portableGames = games.filter((game) => game.platform === 'gbc' || game.platform === 'gba');
  const lanGames = games.filter((game) => game.platform === 'lan');
  const featured = games.find((game) => game.id === 'doom');

  const toggleFav = (id) => {
    setFavorites((previous) => {
      const next = previous.includes(id)
        ? previous.filter((favorite) => favorite !== id)
        : [...previous, id];
      try {
        localStorage.setItem('favorites', JSON.stringify(next));
      } catch {
        // Os favoritos continuam disponíveis durante a sessão.
      }
      return next;
    });
  };

  const filteredGames = useMemo(() => {
    const query = normalize(search.trim());
    const list = games.filter((game) => (
      (!query || normalize(`${game.title} ${game.description}`).includes(query)) &&
      (category === 'Todos' || game.category === category) &&
      (!showFavs || favorites.includes(game.id))
    ));

    return list.sort((a, b) => sort === 'newest'
      ? (Date.parse(b.addedAt || '2026-09-29') - Date.parse(a.addedAt || '2026-09-29')) || a.title.localeCompare(b.title, 'pt-BR')
      : a.title.localeCompare(b.title, 'pt-BR'));
  }, [search, category, sort, showFavs, favorites]);

  const resetFilters = () => {
    setSearch('');
    setCategory('Todos');
    setShowFavs(false);
  };

  const renderCards = (list) => list.map((game) => (
    <GameCard
      key={game.id}
      game={game}
      onPlay={setSelectedGame}
      onToggleFav={toggleFav}
      isFav={favorites.includes(game.id)}
    />
  ));

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Central da Sacanagem, início">
          <span className="brand-mark">C<span>↗</span></span>
          <span>Central da<span className="brand-sub">Sacanagem<span className="brand-dot">.</span></span></span>
        </a>
        <nav aria-label="Navegação principal">
          <a className="nav-active" href="#catalogo">Explorar</a>
          {dosGames.length > 0 && <a href="#dos">DOS</a>}
          {portableGames.length > 0 && <a href="#portateis">Portáteis</a>}
          {lanGames.length > 0 && <a href="#lan">LAN</a>}
          <button onClick={() => { setShowFavs(true); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Meus favoritos <span>{games.filter((game) => favorites.includes(game.id)).length}</span>
          </button>
        </nav>
        <span className="header-note"><i /> Seu próximo intervalo começa aqui</span>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">APERTE O PLAY. ESQUEÇA O RELÓGIO.</p>
            <h1 id="hero-title">Velhos clássicos.<br /><span>Novas partidas.</span></h1>
            <p>Do fliperama ao apocalipse. Uma coleção de jogos para abrir, escolher e jogar direto no navegador.</p>
            <a className="primary-link" href="#catalogo">Explorar os jogos <span>↗</span></a>
            <div className="hero-foot"><span>{String(games.length).padStart(2, '0')} jogos na coleção</span><span>Sem instalação</span></div>
          </div>
          {featured && (
            <button className="featured" onClick={() => setSelectedGame(featured)} aria-label="Jogar Doom">
              <span className="featured-top"><span className="tag">ESCOLHA DA CENTRAL</span><span>1993 / DOS</span></span>
              <span className="doom-art" aria-hidden="true"><span className="doom-orbit" /><strong>DOOM</strong><span className="doom-subtitle">KNEE-DEEP IN THE DEAD</span></span>
              <span className="featured-bottom"><span><small>O inferno tem um botão de play.</small><b>DOOM · Shareware</b></span><span className="round-play">▶</span></span>
            </button>
          )}
        </section>

        {dosGames.length > 0 && (
          <section id="dos" className="dos-section" aria-labelledby="dos-title">
            <div className="dos-heading">
              <div>
                <p className="eyebrow">MS-DOS NO NAVEGADOR</p>
                <h2 id="dos-title">Jogos DOS<span> / {String(dosGames.length).padStart(2, '0')}</span></h2>
                <p className="section-description">Clássicos de PC rodando direto na tela, sem instalar emulador.</p>
              </div>
              <span className="dos-badge">TECLADO + TOUCH</span>
            </div>
            <div className="grid">{renderCards(dosGames)}</div>
          </section>
        )}

        {portableGames.length > 0 && (
          <section id="portateis" className="dos-section portable-section" aria-labelledby="portable-title">
            <div className="dos-heading">
              <div>
                <p className="eyebrow">GAME BOY NO NAVEGADOR</p>
                <h2 id="portable-title">Portáteis<span> / {String(portableGames.length).padStart(2, '0')}</span></h2>
                <p className="section-description">Jogos de GBC e GBA com controles de toque, teclado e gamepad.</p>
              </div>
              <span className="dos-badge">GBC + GBA</span>
            </div>
            <div className="grid">{renderCards(portableGames)}</div>
          </section>
        )}

        {lanGames.length > 0 && (
          <section id="lan" className="dos-section lan-section" aria-labelledby="lan-title">
            <div className="dos-heading">
              <div>
                <p className="eyebrow">MULTIPLAYER NA REDE LOCAL</p>
                <h2 id="lan-title">LAN<span> / {String(lanGames.length).padStart(2, '0')}</span></h2>
                <p className="section-description">Clientes para jogar na rede usando um servidor CS 1.6 separado.</p>
              </div>
              <span className="dos-badge">WEBSOCKET + WEBRTC</span>
            </div>
            <div className="grid">{renderCards(lanGames)}</div>
          </section>
        )}

        <section id="catalogo" className="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div><p className="eyebrow">ESCOLHA SUA PRÓXIMA PARTIDA</p><h2 id="catalog-title">A coleção<span> / {String(games.length).padStart(2, '0')}</span></h2></div>
            <label className="search-wrap"><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar jogos" placeholder="Qual vai ser o jogo de hoje?" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          </div>
          <div className="catalog-toolbar"><div className="categories" role="group" aria-label="Categorias">{categories.map((cat) => <button key={cat} className={'category-btn ' + (category === cat ? 'active' : '')} aria-pressed={category === cat} onClick={() => setCategory(cat)}>{cat}</button>)}</div><button className={'fav-toggle ' + (showFavs ? 'active' : '')} aria-pressed={showFavs} onClick={() => setShowFavs(!showFavs)}>♡ Favoritos</button></div>
          <div className="results-bar"><span aria-live="polite">{filteredGames.length} {filteredGames.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}</span><label>Ordenar por <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Nome: A–Z</option><option value="newest">Adicionados recentemente</option></select></label></div>
          <div className="grid">{renderCards(filteredGames)}</div>
          {!filteredGames.length && <div className="empty-state"><span>⌕</span><h3>Nenhum jogo por aqui.</h3><p>Tente outro nome ou escolha uma nova categoria.</p><button className="play-btn" onClick={resetFilters}>Limpar filtros</button></div>}
        </section>
      </main>

      <footer className="footer"><span>Central da Sacanagem<span className="brand-dot">.</span></span><span>Uma pausa bem jogada. © {new Date().getFullYear()}</span><a href="#">Voltar ao topo ↑</a></footer>
      {selectedGame && <GamePlayer key={selectedGame.id} game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </div>
  );
}
